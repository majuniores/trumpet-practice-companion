# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                   Client (PWA)                        │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  React  │  │ Dexie.js │  │  Service Worker   │  │
│  │   UI    │◄─┤ (IndexDB)├──┤  (Background Sync)│  │
│  └────┬────┘  └────┬─────┘  └────────┬──────────┘  │
│       │             │                  │             │
└───────┼─────────────┼──────────────────┼─────────────┘
        │             │                  │
        ▼             ▼                  ▼
┌─────────────────────────────────────────────────────┐
│                  Supabase                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Auth    │  │ Postgres │  │  Storage (Audio)  │  │
│  │  (JWT)   │  │  + RLS   │  │                   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Layers

1. **Views** - Page-level components (StudentDashboard, TeacherDashboard)
2. **Components** - Reusable UI blocks (Button, Card, Timer, AudioRecorder)
3. **Hooks** - Business logic (useSession, useGoals, useSync)
4. **DB Layer** - Dexie.js tables mirroring Supabase schema
5. **Sync Worker** - Background sync queue for offline mutations

### Data Flow

1. User interacts with UI
2. Mutation written to Dexie.js (IndexedDB) immediately
3. Mutation queued in sync table
4. Background worker processes queue when online
5. Supabase confirms → mark synced in IndexedDB

### PWA Strategy

- **Cache-First** for static assets (shell, images, fonts)
- **Network-First** for API calls with fallback to IndexedDB
- **Background Sync** for offline mutations

## Backend (Supabase)

### Security Model

- Row Level Security (RLS) enforces data isolation
- Students see only their own data
- Teachers see data for their assigned students
- Audio files stored in private buckets with signed URLs

### Storage

- Audio recordings: `audio/{user_id}/{session_id}/{filename}`
- Max file size: 50MB per recording
- Supported formats: WebM (Opus), WAV

## Offline-First Strategy

### Conflict Resolution

- Last-write-wins for simple fields
- Server timestamp is authoritative
- Sync errors are queued for retry with exponential backoff

### Sync Queue

Each mutation is stored as:
```typescript
{
  id: string;
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: Record<string, any>;
  created_at: number;
  synced: boolean;
  retry_count: number;
}
```
