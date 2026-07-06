# UX Flow

## Design Principles (Autism-Friendly)

1. **High Contrast**: Dark text on light backgrounds, clear borders
2. **Low Distraction**: Minimal animations, no auto-playing media
3. **Predictable**: Consistent layout, same navigation always visible
4. **Large Touch Targets**: Minimum 48px tap areas, generous spacing
5. **Clear Language**: Short labels, no ambiguity
6. **Visual Structure**: Cards, sections, clear hierarchy
7. **Sensory Considerations**: No sudden sounds, optional haptic feedback

## Student Flows

### Flow 1: Start Practice Session

```
Dashboard → "Start Practice" (large green button)
  → Select piece/method (optional, big cards)
  → Mood check (emoji scale 1-5)
  → Timer starts (large, centered display)
  → [Record Audio] button available
  → "Done" button → End session form
    → Mood after, focus rating, notes
    → Save → Back to dashboard
```

### Flow 2: Daily Check-in

```
Dashboard → "Check-in" (blue button)
  → How are you feeling? (emoji 1-5)
  → Energy level? (emoji 1-5)
  → Anything to share? (optional text)
  → Submit → Confirmation with encouragement
```

### Flow 3: View Agenda

```
Dashboard → "Agenda" (purple button)
  → Today's schedule (time blocks)
  → Active goals (progress bars)
  → Teacher instructions (cards)
```

### Flow 4: Review Progress

```
Dashboard → "My Progress" 
  → Weekly practice summary (simple bar chart)
  → Goals with milestones (checklist)
  → Streaks & achievements
```

## Teacher Flows

### Flow 1: View Student Dashboard

```
Teacher Home → Select Student
  → Overview: practice stats, recent sessions, mood trends
  → Charts: practice time per week, focus ratings
  → Quick actions: add goal, add instruction
```

### Flow 2: Manage Goals

```
Student Page → Goals Tab
  → List of goals (active/completed/paused)
  → "Add Goal" → Form (title, description, target date, milestones)
  → Edit/Delete existing goals
  → Reorder milestones
```

### Flow 3: Add Instructions

```
Student Page → Instructions Tab
  → Active instructions by category
  → "Add Instruction" → Form (content, category, priority)
  → Toggle active/inactive
```

### Flow 4: Listen to Recordings

```
Student Page → Sessions Tab → Select Session
  → Session details (duration, mood, focus)
  → Audio player for recordings
  → Add teacher notes
```

## Navigation Structure

### Student (Mobile)
```
Bottom Tab Bar:
  [🏠 Home] [🎵 Practice] [📋 Agenda] [👤 Profile]
```

### Teacher (Desktop)
```
Sidebar:
  📊 Dashboard
  👥 Students
  🎯 Goals
  📝 Instructions
  📅 Schedules
  ⚙️ Settings
```

## Accessibility

- All interactive elements have visible focus states
- Color is never the only indicator (icons + text + color)
- Font size minimum 16px body, 20px headings
- Spacing follows 8px grid
- Screen reader compatible (ARIA labels)
- Reduced motion respects `prefers-reduced-motion`
