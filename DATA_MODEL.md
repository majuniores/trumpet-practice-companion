# Data Model

## Entity Relationship Diagram

```
users ──┬── students (1:1)
        ├── sessions (1:N)
        ├── goals (1:N)
        ├── check_ins (1:N)
        └── schedules (1:N)

pieces ──── sessions (N:M via session)
methods ──── sessions (N:M via session)

sessions ──── audio_recordings (1:N)
goals ──── milestones (1:N)
students ──── instructions (1:N, from teacher)
```

## Tables

### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Supabase Auth UID |
| email | TEXT | User email |
| full_name | TEXT | Display name |
| role | TEXT | 'student' or 'teacher' |
| avatar_url | TEXT | Profile picture URL |
| created_at | TIMESTAMPTZ | Account creation |
| updated_at | TIMESTAMPTZ | Last profile update |

### students
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| user_id | UUID (FK→users) | Link to auth user |
| teacher_id | UUID (FK→users) | Assigned teacher |
| level | TEXT | Current skill level |
| preferences | JSONB | UI/practice preferences |
| created_at | TIMESTAMPTZ | |

### pieces
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| title | TEXT | Piece name |
| composer | TEXT | |
| difficulty | INT | 1-10 scale |
| genre | TEXT | |
| notes | TEXT | Teacher notes |
| created_at | TIMESTAMPTZ | |

### methods
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| name | TEXT | Method book name |
| author | TEXT | |
| description | TEXT | |
| created_at | TIMESTAMPTZ | |

### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| student_id | UUID (FK→students) | |
| piece_id | UUID (FK→pieces) | Nullable |
| method_id | UUID (FK→methods) | Nullable |
| started_at | TIMESTAMPTZ | Session start |
| ended_at | TIMESTAMPTZ | Session end |
| duration_minutes | INT | Calculated duration |
| notes | TEXT | Student notes |
| mood_before | INT | 1-5 scale |
| mood_after | INT | 1-5 scale |
| focus_rating | INT | 1-5 self-rating |
| created_at | TIMESTAMPTZ | |

### audio_recordings
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| session_id | UUID (FK→sessions) | |
| student_id | UUID (FK→students) | |
| file_path | TEXT | Storage path |
| file_size | INT | Bytes |
| duration_seconds | INT | Audio length |
| mime_type | TEXT | audio/webm, etc. |
| uploaded | BOOLEAN | Sync status |
| created_at | TIMESTAMPTZ | |

### goals
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| student_id | UUID (FK→students) | |
| teacher_id | UUID (FK→users) | Who set it |
| title | TEXT | Goal title |
| description | TEXT | Details |
| target_date | DATE | Due date |
| status | TEXT | 'active','completed','paused' |
| priority | INT | 1-5 |
| created_at | TIMESTAMPTZ | |

### milestones
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| goal_id | UUID (FK→goals) | |
| title | TEXT | Step description |
| completed | BOOLEAN | |
| completed_at | TIMESTAMPTZ | |
| order_index | INT | Display order |
| created_at | TIMESTAMPTZ | |

### instructions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| student_id | UUID (FK→students) | |
| teacher_id | UUID (FK→users) | |
| content | TEXT | Instruction text |
| category | TEXT | 'warmup','technique','repertoire' |
| priority | INT | |
| active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### check_ins
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| student_id | UUID (FK→students) | |
| mood | INT | 1-5 |
| energy | INT | 1-5 |
| notes | TEXT | Free text |
| created_at | TIMESTAMPTZ | |

### schedules
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| student_id | UUID (FK→students) | |
| day_of_week | INT | 0=Sunday, 6=Saturday |
| start_time | TIME | |
| duration_minutes | INT | |
| label | TEXT | e.g. "Morning Practice" |
| active | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

## RLS Policies

- **students**: Users can read/write their own record. Teachers can read assigned students.
- **sessions**: Students CRUD own sessions. Teachers can read assigned student sessions.
- **audio_recordings**: Students CRUD own. Teachers can read assigned students'.
- **goals**: Teachers CRUD for assigned students. Students can read own.
- **milestones**: Same as goals.
- **instructions**: Teachers CRUD for assigned students. Students can read own.
- **check_ins**: Students CRUD own. Teachers can read assigned students'.
- **schedules**: Students CRUD own. Teachers can read/write assigned students'.
