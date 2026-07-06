import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MoodSelector } from '../components/MoodSelector';
import { db, queueSync } from '../db';
import { generateId } from '../lib/utils';

interface CheckInViewProps {
  onBack: () => void;
}

export function CheckInView({ onBack }: CheckInViewProps) {
  const [mood, setMood] = useState<number>();
  const [energy, setEnergy] = useState<number>();
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!mood || !energy) return;

    const checkIn = {
      id: generateId(),
      student_id: 'demo-student-id',
      mood,
      energy,
      notes: notes || undefined,
      created_at: new Date().toISOString()
    };

    await db.checkIns.add(checkIn);
    await queueSync('check_ins', 'INSERT', checkIn as unknown as Record<string, unknown>, checkIn.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-primary-800 text-white px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-primary-700" aria-label="Go back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Check-in</h1>
        </header>
        <main className="px-4 py-6 max-w-lg mx-auto">
          <Card padding="lg" className="text-center space-y-4">
            <div className="text-5xl">💪</div>
            <h2 className="text-2xl font-bold text-primary-700">Thanks for checking in!</h2>
            <p className="text-slate-600">Your teacher can see how you're doing.</p>
            <Button size="lg" variant="primary" className="w-full" onClick={onBack}>
              Back to Dashboard
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary-800 text-white px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-primary-700" aria-label="Go back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Daily Check-in</h1>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <Card padding="lg" className="space-y-6">
          <MoodSelector value={mood} onChange={setMood} label="How are you feeling?" />

          <div className="space-y-3">
            <label className="block text-lg font-semibold text-slate-800">Energy Level</label>
            <div className="flex gap-3 justify-center">
              {[
                { value: 1, emoji: '🔋', label: 'Very Low' },
                { value: 2, emoji: '🪫', label: 'Low' },
                { value: 3, emoji: '⚡', label: 'Medium' },
                { value: 4, emoji: '💪', label: 'High' },
                { value: 5, emoji: '🚀', label: 'Very High' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setEnergy(item.value)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 min-w-[60px] transition-all ${
                    energy === item.value
                      ? 'border-primary-500 bg-primary-50 scale-110'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-label={item.label}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-xs mt-1 text-slate-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-slate-800">
              Anything to share? (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border-2 border-slate-200 rounded-xl resize-none h-24 text-base"
              placeholder="How's your day going?"
            />
          </div>

          <Button
            size="xl"
            variant="success"
            className="w-full"
            onClick={handleSubmit}
            disabled={!mood || !energy}
          >
            Submit Check-in
          </Button>
        </Card>
      </main>
    </div>
  );
}
