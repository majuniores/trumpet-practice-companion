import React from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from './Button';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface AudioRecorderProps {
  sessionId: string;
  studentId: string;
}

export function AudioRecorder({ sessionId, studentId }: AudioRecorderProps) {
  const { isRecording, duration, startRecording, stopRecording, error } = useAudioRecorder(sessionId, studentId);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      {isRecording ? (
        <>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg font-mono font-bold text-red-700">
              {formatDuration(duration)}
            </span>
          </div>
          <Button variant="danger" size="lg" onClick={stopRecording}>
            <Square className="w-5 h-5 mr-2" />
            Stop Recording
          </Button>
        </>
      ) : (
        <Button variant="secondary" size="lg" onClick={startRecording}>
          <Mic className="w-5 h-5 mr-2" />
          Record Audio
        </Button>
      )}
    </div>
  );
}
