import { useState, useRef, useCallback } from 'react';
import { db, queueSync } from '../db';
import { generateId } from '../lib/utils';
import type { AudioRecording } from '../types';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<AudioRecording | null>;
  error: string | null;
}

export function useAudioRecorder(sessionId: string, studentId: string): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<AudioRecording | null> => {
    if (!mediaRecorderRef.current) return null;

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

        const recordingId = generateId();
        const filePath = `audio/${studentId}/${sessionId}/${recordingId}.webm`;

        const recording: AudioRecording = {
          id: recordingId,
          session_id: sessionId,
          student_id: studentId,
          file_path: filePath,
          file_size: blob.size,
          duration_seconds: durationSeconds,
          mime_type: mediaRecorder.mimeType,
          uploaded: false,
          created_at: new Date().toISOString(),
          blob
        };

        await db.audioRecordings.add(recording);
        await queueSync('audio_recordings', 'INSERT', {
          id: recordingId,
          session_id: sessionId,
          student_id: studentId,
          file_path: filePath,
          file_size: blob.size,
          duration_seconds: durationSeconds,
          mime_type: mediaRecorder.mimeType,
          uploaded: false
        }, recordingId);

        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        resolve(recording);
      };

      mediaRecorder.stop();
      setIsRecording(false);
      setDuration(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });
  }, [sessionId, studentId]);

  return { isRecording, duration, startRecording, stopRecording, error };
}
