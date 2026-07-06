import Dexie, { type Table } from 'dexie';
import type {
  User, Student, Piece, Method, Session,
  AudioRecording, Goal, Milestone, Instruction,
  CheckIn, Schedule, SyncQueueItem
} from '../types';

export class TrumpetDB extends Dexie {
  users!: Table<User, string>;
  students!: Table<Student, string>;
  pieces!: Table<Piece, string>;
  methods!: Table<Method, string>;
  sessions!: Table<Session, string>;
  audioRecordings!: Table<AudioRecording, string>;
  goals!: Table<Goal, string>;
  milestones!: Table<Milestone, string>;
  instructions!: Table<Instruction, string>;
  checkIns!: Table<CheckIn, string>;
  schedules!: Table<Schedule, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('TrumpetPracticeDB');

    this.version(1).stores({
      users: 'id, email, role',
      students: 'id, user_id, teacher_id',
      pieces: 'id, title, difficulty',
      methods: 'id, name',
      sessions: 'id, student_id, started_at',
      audioRecordings: 'id, session_id, student_id, uploaded',
      goals: 'id, student_id, teacher_id, status',
      milestones: 'id, goal_id, order_index',
      instructions: 'id, student_id, teacher_id, category, active',
      checkIns: 'id, student_id, created_at',
      schedules: 'id, student_id, day_of_week, active',
      syncQueue: '++id, table, synced, created_at'
    });
  }
}

export const db = new TrumpetDB();

export async function queueSync(
  table: string,
  operation: 'INSERT' | 'UPDATE' | 'DELETE',
  payload: Record<string, unknown>,
  entityId: string
): Promise<void> {
  await db.syncQueue.add({
    table,
    operation,
    payload,
    entity_id: entityId,
    created_at: Date.now(),
    synced: false,
    retry_count: 0
  });
}
