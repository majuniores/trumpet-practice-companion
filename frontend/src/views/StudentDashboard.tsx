import React, { useState } from 'react';
import { Play, MessageCircle, Calendar, Trophy } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Navigation } from '../components/Navigation';
import { PracticeView } from './PracticeView';
import { CheckInView } from './CheckInView';
import { AgendaView } from './AgendaView';

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [showPractice, setShowPractice] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);

  if (showPractice) {
    return <PracticeView onBack={() => setShowPractice(false)} />;
  }

  if (showCheckIn) {
    return <CheckInView onBack={() => setShowCheckIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-primary-800 text-white px-6 py-8">
        <h1 className="text-2xl font-bold">🎺 Trumpet Practice</h1>
        <p className="text-primary-200 mt-1">Ready to play today?</p>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-4">
        {activeTab === 'home' && (
          <>
            <Button
              size="xl"
              variant="success"
              className="w-full"
              onClick={() => setShowPractice(true)}
            >
              <Play className="w-7 h-7 mr-3" />
              Start Practice
            </Button>

            <Button
              size="xl"
              variant="primary"
              className="w-full"
              onClick={() => setShowCheckIn(true)}
            >
              <MessageCircle className="w-7 h-7 mr-3" />
              Check-in
            </Button>

            <Button
              size="xl"
              variant="ghost"
              className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => setActiveTab('agenda')}
            >
              <Calendar className="w-7 h-7 mr-3" />
              Today's Agenda
            </Button>

            <Card className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-800">This Week</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary-700">3</p>
                  <p className="text-sm text-slate-500">Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">45m</p>
                  <p className="text-sm text-slate-500">Total Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">🔥 3</p>
                  <p className="text-sm text-slate-500">Day Streak</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'agenda' && <AgendaView />}

        {activeTab === 'practice' && (
          <div className="text-center py-8">
            <Button size="xl" variant="success" className="w-full" onClick={() => setShowPractice(true)}>
              <Play className="w-7 h-7 mr-3" />
              Start New Session
            </Button>
          </div>
        )}

        {activeTab === 'profile' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Name</span>
                <span className="font-medium">Student</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Level</span>
                <span className="font-medium">Intermediate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Teacher</span>
                <span className="font-medium">Mr. Johnson</span>
              </div>
            </div>
          </Card>
        )}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
