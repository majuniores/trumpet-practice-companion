import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db, queueSync } from '../db';

describe('TrumpetDB', () => {
  beforeEach(async () => {
    await db.syncQueue.clear();
    await db.sessions.clear();
    await db.checkIns.clear();
  });

  it('can add and retrieve a session', async () => {
    const session = {
      id: 'test-session-1',
      student_id: 'student-1',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    await db.sessions.add(session);
    const retrieved = await db.sessions.get('test-session-1');
    expect(retrieved).toBeDefined();
    expect(retrieved!.student_id).toBe('student-1');
  });

  it('can add and retrieve a check-in', async () => {
    const checkIn = {
      id: 'test-checkin-1',
      student_id: 'student-1',
      mood: 4,
      energy: 3,
      created_at: new Date().toISOString()
    };

    await db.checkIns.add(checkIn);
    const retrieved = await db.checkIns.get('test-checkin-1');
    expect(retrieved).toBeDefined();
    expect(retrieved!.mood).toBe(4);
  });

  it('queues sync items', async () => {
    await queueSync('sessions', 'INSERT', { id: 'test-1' }, 'test-1');
    await queueSync('sessions', 'UPDATE', { id: 'test-2' }, 'test-2');

    const items = await db.syncQueue.toArray();
    expect(items).toHaveLength(2);
    expect(items[0].table).toBe('sessions');
    expect(items[0].operation).toBe('INSERT');
    expect(items[0].synced).toBe(false);
    expect(items[1].operation).toBe('UPDATE');
  });

  it('can filter unsynced items', async () => {
    await queueSync('sessions', 'INSERT', { id: 's1' }, 's1');
    await queueSync('check_ins', 'INSERT', { id: 'c1' }, 'c1');

    // Use filter since IndexedDB can't index booleans directly
    const unsynced = await db.syncQueue.filter(item => !item.synced).toArray();
    expect(unsynced).toHaveLength(2);
    expect(unsynced[0].entity_id).toBe('s1');
    expect(unsynced[1].entity_id).toBe('c1');
  });
});
