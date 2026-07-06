export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  teacher_id?: string;
  level: string;
  preferences: Record<string, unknown>;
  created_at: string;
}

export interface Piece {
  id: string;
  title: string;
  composer?: string;
  difficulty?: number;
  genre?: string;
  notes?: string;
  created_at: string;
}

export interface Method {
  id: string;
  name: string;
  author?: string;
  description?: string;
  created_at: string;
}

export interface Session {
  id: string;
  student_id: string;
  piece_id?: string;
  method_id?: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  notes?: string;
  mood_before?: number;
  mood_after?: number;
  focus_rating?: number;
  created_at: string;
}

export interface AudioRecording {
  id: string;
  session_id: string;
  student_id: string;
  file_path: string;
  file_size?: number;
  duration_seconds?: number;
  mime_type: string;
  uploaded: boolean;
  created_at: string;
  blob?: Blob;
}

export interface Goal {
  id: string;
  student_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused';
  priority: number;
  created_at: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  completed_at?: string;
  order_index: number;
  created_at: string;
}

export interface Instruction {
  id: string;
  student_id: string;
  teacher_id: string;
  content: string;
  category: 'warmup' | 'technique' | 'repertoire' | 'general';
  priority: number;
  active: boolean;
  created_at: string;
}

export interface CheckIn {
  id: string;
  student_id: string;
  mood: number;
  energy: number;
  notes?: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  student_id: string;
  day_of_week: number;
  start_time: string;
  duration_minutes: number;
  label?: string;
  active: boolean;
  created_at: string;
}

export interface SyncQueueItem {
  id?: number;
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  created_at: number;
  synced: boolean;
  retry_count: number;
  entity_id: string;
}
