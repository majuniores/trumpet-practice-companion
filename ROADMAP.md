# Roadmap

## Phase 1: Foundation (Current) ✅
- [x] Project structure (monorepo: frontend + supabase)
- [x] Postgres schema with RLS policies
- [x] Dexie.js offline database setup
- [x] Background sync worker
- [x] Basic UI components (Button, Card, Timer)
- [x] Student dashboard (Start Practice, Check-in, Agenda)
- [x] Teacher dashboard with Recharts
- [x] Audio recording (local save + upload)
- [x] PWA manifest and service worker
- [x] Documentation

## Phase 2: Core Features
- [ ] Supabase Auth integration (email/magic link)
- [ ] Real-time sync with conflict resolution
- [ ] Push notifications for practice reminders
- [ ] Teacher-student assignment workflow
- [ ] Audio playback in teacher view
- [ ] Goal completion celebrations (confetti, gentle)

## Phase 3: Enhanced Experience
- [ ] Metronome integration
- [ ] Tuner (pitch detection via Web Audio API)
- [ ] Practice streak tracking & gentle gamification
- [ ] Custom practice routines (teacher-created templates)
- [ ] Export practice logs (PDF/CSV)
- [ ] Dark mode toggle

## Phase 4: Intelligence
- [ ] Practice pattern analysis (ML)
- [ ] Smart scheduling suggestions
- [ ] Progress predictions
- [ ] Automated practice reminders based on patterns
- [ ] Audio quality feedback (basic pitch/rhythm analysis)

## Phase 5: Community
- [ ] Multi-teacher support
- [ ] Studio management features
- [ ] Parent view (read-only progress)
- [ ] Shared piece library
- [ ] Practice group challenges

## Technical Debt & Improvements
- [ ] E2E tests (Playwright)
- [ ] Component storybook
- [ ] Performance monitoring (Web Vitals)
- [ ] Error tracking (Sentry)
- [ ] CI/CD pipeline
- [ ] Database backups strategy
- [ ] Rate limiting on audio uploads
