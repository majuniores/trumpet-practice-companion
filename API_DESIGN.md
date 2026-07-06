# API Design

## Overview

The app uses Supabase client SDK directly (no custom REST API). All data access goes through the Supabase JS client with RLS enforcing authorization.

## Authentication

- **Provider**: Supabase Auth (email/password, magic link)
- **Token**: JWT stored in httpOnly cookie (web) or secure storage
- **Session**: Auto-refresh via Supabase client

## Data Access Patterns

### Student Operations

```typescript
// Start a practice session
supabase.from('sessions').insert({
  student_id, started_at: new Date().toISOString(),
  mood_before
})

// End a session
supabase.from('sessions').update({
  ended_at: new Date().toISOString(),
  duration_minutes, mood_after, focus_rating, notes
}).eq('id', sessionId)

// Submit a check-in
supabase.from('check_ins').insert({
  student_id, mood, energy, notes
})

// Get today's agenda
supabase.from('schedules').select('*')
  .eq('student_id', studentId)
  .eq('day_of_week', new Date().getDay())
  .eq('active', true)

// Get active goals
supabase.from('goals').select('*, milestones(*)')
  .eq('student_id', studentId)
  .eq('status', 'active')
  .order('priority')
```

### Teacher Operations

```typescript
// Get student practice stats
supabase.from('sessions').select('*')
  .eq('student_id', studentId)
  .gte('started_at', startDate)
  .order('started_at', { ascending: false })

// CRUD goals
supabase.from('goals').insert({ student_id, teacher_id, title, description, target_date })
supabase.from('goals').update({ status }).eq('id', goalId)
supabase.from('goals').delete().eq('id', goalId)

// Add instruction
supabase.from('instructions').insert({
  student_id, teacher_id, content, category, priority
})

// Get all assigned students
supabase.from('students').select('*, user:users(*)')
  .eq('teacher_id', teacherId)
```

### Audio Upload

```typescript
// Upload to Supabase Storage
const path = `audio/${userId}/${sessionId}/${filename}`;
supabase.storage.from('recordings').upload(path, blob, {
  contentType: 'audio/webm'
})

// Get signed URL for playback
supabase.storage.from('recordings').createSignedUrl(path, 3600)
```

## Offline Sync API

### Sync Queue Operations

```typescript
// Queue a mutation (runs locally first)
db.syncQueue.add({
  table: 'sessions',
  operation: 'INSERT',
  payload: { ... },
  created_at: Date.now(),
  synced: false,
  retry_count: 0
})

// Process queue (background worker)
const pending = await db.syncQueue
  .where('synced').equals(false)
  .sortBy('created_at');

for (const item of pending) {
  await processSync(item);
}
```

## Real-time Subscriptions

```typescript
// Teacher: listen for new sessions from students
supabase.channel('student-sessions')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'sessions',
    filter: `student_id=in.(${studentIds.join(',')})`
  }, handleNewSession)
  .subscribe()
```

## Error Handling

- **Network errors**: Queue for retry, show offline indicator
- **Auth errors**: Redirect to login
- **RLS violations**: Show permission error
- **Validation errors**: Show prototype errors
