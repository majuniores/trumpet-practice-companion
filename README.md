# Trumpet Practice Companion

A full-stack Progressive Web App designed to support trumpet students (especially neurodivergent learners) with structured, distraction-free practice sessions, and provide teachers with insights into student progress.

## Architecture

- **Frontend**: Vite + React + TypeScript + Tailwind CSS (PWA-enabled)
- **Backend**: Supabase (Postgres + Auth + Storage + Realtime)
- **Offline**: Dexie.js (IndexedDB) with background sync worker
- **Charts**: Recharts for teacher analytics

## Quick Start

```bash
# Install frontend dependencies
cd frontend
npm install

# Start dev server
npm run dev
```

## Project Structure

```
/
├── frontend/          # Vite React TypeScript app
│   ├── src/
│   │   ├── components/   # Shared UI components
│   │   ├── views/        # Page-level views (student/teacher)
│   │   ├── db/           # Dexie.js offline database
│   │   ├── workers/      # Background sync worker
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Supabase client, utils
│   │   └── types/        # TypeScript type definitions
│   ├── public/
│   └── vite.config.ts
├── supabase/
│   └── migrations/       # Postgres schema + RLS policies
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── API_DESIGN.md
├── UX_FLOW.md
└── ROADMAP.md
```

## Key Features

- **Student View**: Mobile-first, large buttons, high-contrast, low-distraction UI
- **Teacher View**: Desktop dashboard with practice analytics (Recharts)
- **Offline-First**: All data available offline via IndexedDB, syncs when online
- **Audio Recording**: Record practice sessions locally, upload to Supabase Storage
- **Structured Practice**: Goals, milestones, schedules, and check-ins

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## License

MIT
