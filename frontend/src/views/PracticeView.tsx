import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Timer } from '../components/Timer';
import { MoodSelector } from '../components/MoodSelector';
import { AudioRecorder } from '../components/AudioRecorder';
import { useSession } from '../hooks/useSession';
import { generateId } from '../lib/utils';

interface PracticeViewProps {
  onBack: () => void;
}

type Step = 'mood-before' | 'practicing' | 'mood-after' | 'done';

export function PracticeView({ onBack }: PracticeViewProps) {
  const [step, setStep] = useState<Step>('mood-before');
  const [moodBefore, setMoodBefore] = useState<number>();
  const [moodAfter, setMoodAfter] = useState<number>();
  const [focusRating, setFocusRating] = useState<number>();
  const [notes, setNotes] = useState('');

  const { activeSession, startSession, endSession, elapsedMinutes } = useSession();
  const studentId = 'demo-student-id';

  const handleStartPractice = async () => {
    await startSession(studentId, moodBefore);
    setStep('practicing');
  };

  const handleEndPractice = () => {
    setStep('mood-after');
  };

  const handleSubmitEnd = async () => {
    await endSession({ moodAfter, focusRating, notes });
    setStep('done');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary-800 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-primary-700" aria-label="Go back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Practice Session</h1>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {step === 'mood-before' && (
          <Card padding="lg" className="space-y-6">
            <h2 className="text-xl font-bold text-center">How are you feeling?</h2>
            <MoodSelector value={moodBefore} onChange={setMoodBefore} label="Before practice" />
            <Button
              size="xl"
              variant="success"
              className="w-full"
              onClick={handleStartPractice}
              disabled={!moodBefore}
            >
              Let's Play! 🎺
            </Button>
          </Card>
        )}

        {step === 'practicing' && activeSession && (
          <div className="space-y-6">
            <Card padding="lg" className="text-center">
              <Timer minutes={elapsedMinutes} isActive={true} />
            </Card>

            <Card padding="lg">
              <AudioRecorder sessionId={activeSession.id} studentId={studentId} />
            </Card>

            <Button
              size="xl"
              variant="danger"
              className="w-full"
              onClick={handleEndPractice}
            >
              <Check className="w-6 h-6 mr-2" />
              Done Practicing
            </Button>
          </div>
        )}

        {step === 'mood-after' && (
          <Card padding="lg" className="space-y-6">
            <h2 className="text-xl font-bold text-center">Great job! 🎉</h2>

            <MoodSelector value={moodAfter} onChange={setMoodAfter} label="How do you feel now?" />

            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-800">
                How focused were you?
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setFocusRating(val)}
                    className={`w-12 h-12 rounded-xl border-2 text-lg font-bold transition-all ${
                      focusRating === val
                        ? 'border-primary-500 bg-primary-100 text-primary-700'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-slate-800">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border-2 border-slate-200 rounded-xl resize-none h-24 text-base"
                placeholder="What did you work on?"
              />
            </div>

            <Button size="xl" variant="success" className="w-full" onClick={handleSubmitEnd}>
              Save Session
            </Button>
          </Card>
        )}

        {step === 'done' && (
          <Card padding="lg" className="text-center space-y-4">
            <div className="text-5xl">🎺✨</div>
            <h2 className="text-2xl font-bold text-green-700">Session Saved!</h2>
            <p className="text-slate-600">
              You practiced for <strong>{elapsedMinutes || 1} minutes</strong> today.
            </p>
            <Button size="lg" variant="primary" className="w-full" onClick={onBack}>
              Back to Dashboard
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
