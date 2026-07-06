-- Trumpet Practice Companion - Initial Schema
-- Includes all tables and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  level TEXT DEFAULT 'beginner',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE pieces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  composer TEXT,
  difficulty INT CHECK (difficulty BETWEEN 1 AND 10),
  genre TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  author TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  piece_id UUID REFERENCES pieces(id) ON DELETE SET NULL,
  method_id UUID REFERENCES methods(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  notes TEXT,
  mood_before INT CHECK (mood_before BETWEEN 1 AND 5),
  mood_after INT CHECK (mood_after BETWEEN 1 AND 5),
  focus_rating INT CHECK (focus_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audio_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_size INT,
  duration_seconds INT,
  mime_type TEXT DEFAULT 'audio/webm',
  uploaded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  priority INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('warmup', 'technique', 'repertoire', 'general')),
  priority INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  mood INT NOT NULL CHECK (mood BETWEEN 1 AND 5),
  energy INT NOT NULL CHECK (energy BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  label TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_teacher_id ON students(teacher_id);
CREATE INDEX idx_sessions_student_id ON sessions(student_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_audio_session_id ON audio_recordings(session_id);
CREATE INDEX idx_goals_student_id ON goals(student_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_milestones_goal_id ON milestones(goal_id);
CREATE INDEX idx_instructions_student_id ON instructions(student_id);
CREATE INDEX idx_check_ins_student_id ON check_ins(student_id);
CREATE INDEX idx_schedules_student_id ON schedules(student_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Users: can read own profile, teachers can read students
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());

-- Students: own record, teacher can read
CREATE POLICY "students_read_own" ON students
  FOR SELECT USING (user_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "students_insert_own" ON students
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "students_update_own" ON students
  FOR UPDATE USING (user_id = auth.uid());

-- Pieces: readable by all authenticated users
CREATE POLICY "pieces_read_all" ON pieces
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "pieces_manage_teacher" ON pieces
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher')
  );

-- Methods: readable by all authenticated users
CREATE POLICY "methods_read_all" ON methods
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "methods_manage_teacher" ON methods
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher')
  );

-- Sessions: student CRUD own, teacher reads assigned
CREATE POLICY "sessions_student_all" ON sessions
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

CREATE POLICY "sessions_teacher_read" ON sessions
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE teacher_id = auth.uid())
  );

-- Audio recordings: student CRUD own, teacher reads assigned
CREATE POLICY "audio_student_all" ON audio_recordings
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

CREATE POLICY "audio_teacher_read" ON audio_recordings
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE teacher_id = auth.uid())
  );

-- Goals: teacher CRUD for assigned students, student reads own
CREATE POLICY "goals_teacher_all" ON goals
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "goals_student_read" ON goals
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

-- Milestones: follow goal access
CREATE POLICY "milestones_teacher_all" ON milestones
  FOR ALL USING (
    goal_id IN (SELECT id FROM goals WHERE teacher_id = auth.uid())
  );

CREATE POLICY "milestones_student_read" ON milestones
  FOR SELECT USING (
    goal_id IN (SELECT id FROM goals WHERE student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "milestones_student_update" ON milestones
  FOR UPDATE USING (
    goal_id IN (SELECT id FROM goals WHERE student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    ))
  );

-- Instructions: teacher CRUD, student reads own
CREATE POLICY "instructions_teacher_all" ON instructions
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "instructions_student_read" ON instructions
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

-- Check-ins: student CRUD own, teacher reads assigned
CREATE POLICY "checkins_student_all" ON check_ins
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

CREATE POLICY "checkins_teacher_read" ON check_ins
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE teacher_id = auth.uid())
  );

-- Schedules: student CRUD own, teacher reads/writes assigned
CREATE POLICY "schedules_student_all" ON schedules
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  );

CREATE POLICY "schedules_teacher_all" ON schedules
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE teacher_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate session duration on end
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
    NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_calc_duration
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION calculate_session_duration();
