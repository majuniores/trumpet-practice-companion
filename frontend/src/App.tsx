import React, { useState } from 'react';
import { StudentDashboard } from './views/StudentDashboard';
import { TeacherDashboard } from './views/TeacherDashboard';

type ViewMode = 'student' | 'teacher';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('student');

  return (
    <div className="min-h-screen">
      {/* View mode toggle (for demo purposes) */}
      <div className="fixed top-2 right-2 z-[100] bg-white/90 backdrop-blur rounded-xl border-2 border-slate-200 shadow-lg p-1 flex gap-1">
        <button
          onClick={() => setViewMode('student')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'student'
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setViewMode('teacher')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'teacher'
              ? 'bg-primary-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Teacher
        </button>
      </div>

      {viewMode === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
    </div>
  );
}
