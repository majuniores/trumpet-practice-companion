import React from 'react';
import { Clock, Target, BookOpen } from 'lucide-react';
import { Card } from '../components/Card';

const mockSchedule = [
  { id: '1', time: '16:00', label: 'Warm-up & Long Tones', duration: 10 },
  { id: '2', time: '16:10', label: 'Clarke Studies #3', duration: 15 },
  { id: '3', time: '16:25', label: 'Repertoire - Concert Piece', duration: 20 },
  { id: '4', time: '16:45', label: 'Cool Down', duration: 5 },
];

const mockGoals = [
  { id: '1', title: 'Play Clarke #3 at 120bpm', progress: 60 },
  { id: '2', title: 'High C with good tone', progress: 30 },
  { id: '3', title: 'Memorize concert piece', progress: 80 },
];

const mockInstructions = [
  { id: '1', content: 'Focus on breath support during long tones', category: 'warmup' },
  { id: '2', content: 'Use metronome for Clarke studies - start slow!', category: 'technique' },
];

export function AgendaView() {
  return (
    <div className="space-y-4">
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold">Today's Schedule</h2>
        </div>
        <div className="space-y-3">
          {mockSchedule.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-mono text-slate-500 w-12">{item.time}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{item.label}</p>
                <p className="text-sm text-slate-500">{item.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold">Active Goals</h2>
        </div>
        <div className="space-y-3">
          {mockGoals.map((goal) => (
            <div key={goal.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{goal.title}</span>
                <span className="text-slate-500">{goal.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold">Teacher Instructions</h2>
        </div>
        <div className="space-y-3">
          {mockInstructions.map((instr) => (
            <div key={instr.id} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
              <p className="text-slate-700">{instr.content}</p>
              <span className="text-xs text-blue-600 font-medium uppercase mt-1 inline-block">
                {instr.category}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
