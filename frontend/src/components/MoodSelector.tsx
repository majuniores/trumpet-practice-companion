import React from 'react';
import { cn } from '../lib/utils';

interface MoodSelectorProps {
  value?: number;
  onChange: (value: number) => void;
  label: string;
}

const moods = [
  { value: 1, emoji: '😟', label: 'Very Low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

export function MoodSelector({ value, onChange, label }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-lg font-semibold text-slate-800">{label}</label>
      <div className="flex gap-3 justify-center">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={cn(
              'flex flex-col items-center p-3 rounded-xl border-2 min-w-[60px] transition-all',
              value === mood.value
                ? 'border-primary-500 bg-primary-50 scale-110'
                : 'border-slate-200 hover:border-slate-300'
            )}
            aria-label={mood.label}
          >
            <span className="text-3xl" role="img" aria-hidden="true">{mood.emoji}</span>
            <span className="text-xs mt-1 text-slate-600">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
