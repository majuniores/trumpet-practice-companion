import { db } from '../db';
import { supabase } from '../lib/supabase';

const MAX_RETRIES = 5;
const RETRY_DELAY_BASE = 1000;

async function processSyncQueue(): Promise<void> {
  const pending = await db.syncQueue
    .where('synced')
    .equals(0)
    .sortBy('created_at');

  for (const item of pending) {
    if (item.retry_count >= MAX_RETRIES) {
      console.error(`[Sync] Max retries reached for item ${item.id}`);
      continue;
    }

    try {
      let result;

      switch (item.operation) {
        case 'INSERT':
          result = await supabase.from(item.table).insert(item.payload);
          break;
        case 'UPDATE':
          result = await supabase
            .from(item.table)
            .update(item.payload)
            .eq('id', item.entity_id);
          break;
        case 'DELETE':
          result = await supabase
            .from(item.table)
            .delete()
            .eq('id', item.entity_id);
          break;
      }

      if (result?.error) {
        throw new Error(result.error.message);
      }

      await db.syncQueue.update(item.id!, { synced: true });
    } catch (error) {
      console.error(`[Sync] Error processing item ${item.id}:`, error);
      await db.syncQueue.update(item.id!, {
        retry_count: item.retry_count + 1
      });

      const delay = RETRY_DELAY_BASE * Math.pow(2, item.retry_count);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function uploadPendingAudio(): Promise<void> {
  const pending = await db.audioRecordings
    .where('uploaded')
    .equals(0)
    .toArray();

  for (const recording of pending) {
    if (!recording.blob) continue;

    try {
      const { error } = await supabase.storage
        .from('recordings')
        .upload(recording.file_path, recording.blob, {
          contentType: recording.mime_type
        });

      if (error) throw error;

      await db.audioRecordings.update(recording.id, { uploaded: true, blob: undefined });
    } catch (error) {
      console.error(`[Sync] Audio upload failed for ${recording.id}:`, error);
    }
  }
}

export async function runSync(): Promise<void> {
  if (!navigator.onLine) return;

  await processSyncQueue();
  await uploadPendingAudio();
}

let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startSyncWorker(): void {
  runSync();

  syncInterval = setInterval(runSync, 30000);

  window.addEventListener('online', () => {
    runSync();
  });
}

export function stopSyncWorker(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}
