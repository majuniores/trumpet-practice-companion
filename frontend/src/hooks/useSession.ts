import { useState, useCallback } from 'react';
import { db, queueSync } from '../db';
import { generateId } from '../lib/utils';
import type { Session } from '../types';

interface UseSessionReturn {
  activeSession: Session | null;
  startSession: (studentId: string, moodBefore?: number) => Promise<Session>;
  endSession: (data: { moodAfter?: number; focusRating?: number; notes?: string }) => Promise<void>;
  elapsedMinutes: number;
}

export function useSession(): UseSessionReturn {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const startSession = useCallback(async (studentId: string, moodBefore?: number): Promise<Session> => {
    const session: Session = {
      id: generateId(),
      student_id: studentId,
      started_at: new Date().toISOString(),
      mood_before: moodBefore,
      created_at: new Date().toISOString()
    };

    await db.sessions.add(session);
    await queueSync('sessions', 'INSERT', session as unknown as Record<string, unknown>, session.id);

    setActiveSession(session);

    const interval = setInterval(() => {
      const start = new Date(session.started_at).getTime();
      setElapsedMinutes(Math.floor((Date.now() - start) / 60000));
    }, 1000);

    (window as unknown as Record<string, unknown>).__sessionInterval = interval;

    return session;
  }, []);

  const endSession = useCallback(async (data: { moodAfter?: number; focusRating?: number; notes?: string }) => {
    if (!activeSession) return;

    const endedAt = new Date().toISOString();
    const startTime = new Date(activeSession.started_at).getTime();
    const durationMinutes = Math.floor((Date.now() - startTime) / 60000);

    const updates = {
      ended_at: endedAt,
      duration_minutes: durationMinutes,
      mood_after: data.moodAfter,
      focus_rating: data.focusRating,
      notes: data.notes
    };

    await db.sessions.update(activeSession.id, updates);
    await queueSync('sessions', 'UPDATE', updates, activeSession.id);

    setActiveSession(null);
    setElapsedMinutes(0);

    const interval = (window as unknown as Record<string, unknown>).__sessionInterval as ReturnType<typeof setInterval>;
    if (interval) clearInterval(interval);
  }, [activeSession]);

  return { activeSession, startSession, endSession, elapsedMinutes };
}
