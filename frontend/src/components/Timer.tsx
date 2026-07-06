import React from 'react';

interface TimerProps {
  minutes: number;
  isActive: boolean;
}

export function Timer({ minutes, isActive }: TimerProps) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-6xl font-mono font-bold tabular-nums ${
          isActive ? 'text-green-700' : 'text-slate-400'
        }`}
      >
        {hours > 0 && <span>{hours}:</span>}
        <span>{mins.toString().padStart(2, '0')}</span>
        <span className="text-3xl text-slate-400">m</span>
      </div>
      {isActive && (
        <div className="mt-2 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-700 font-medium">Recording session</span>
        </div>
      )}
    </div>
  );
}
