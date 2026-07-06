import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { Users, Target, FileText, Calendar, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const mockPracticeData = [
  { day: 'Mon', minutes: 25, focus: 4 },
  { day: 'Tue', minutes: 30, focus: 3 },
  { day: 'Wed', minutes: 0, focus: 0 },
  { day: 'Thu', minutes: 45, focus: 5 },
  { day: 'Fri', minutes: 20, focus: 3 },
  { day: 'Sat', minutes: 35, focus: 4 },
  { day: 'Sun', minutes: 40, focus: 4 },
];

const mockMoodData = [
  { date: 'Mon', before: 3, after: 4 },
  { date: 'Tue', before: 2, after: 4 },
  { date: 'Thu', before: 4, after: 5 },
  { date: 'Fri', before: 3, after: 3 },
  { date: 'Sat', before: 4, after: 5 },
  { date: 'Sun', before: 3, after: 4 },
];

const mockStudents = [
  { id: '1', name: 'Alex M.', level: 'Intermediate', lastPractice: '2 hours ago', streak: 3 },
  { id: '2', name: 'Jordan K.', level: 'Beginner', lastPractice: '1 day ago', streak: 7 },
  { id: '3', name: 'Sam T.', level: 'Advanced', lastPractice: '3 hours ago', streak: 12 },
];

const mockGoals = [
  { id: '1', title: 'Play Clarke #3 at 120bpm', student: 'Alex M.', status: 'active', targetDate: '2026-07-20' },
  { id: '2', title: 'High C with good tone', student: 'Alex M.', status: 'active', targetDate: '2026-08-01' },
  { id: '3', title: 'Memorize Haydn Concerto mvt 1', student: 'Jordan K.', status: 'active', targetDate: '2026-07-30' },
];

type Tab = 'dashboard' | 'students' | 'goals' | 'instructions' | 'schedules' | 'settings';

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const sidebarItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart as unknown as React.ElementType },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'instructions', label: 'Instructions', icon: FileText },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-2 border-slate-200 min-h-screen hidden lg:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary-800">🎺 Teacher View</h1>
        </div>
        <nav className="px-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 max-w-6xl">
            <h2 className="text-2xl font-bold text-slate-800">Practice Overview</h2>

            {/* Student selector */}
            <div className="flex gap-3 flex-wrap">
              {mockStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s.id)}
                  className={`px-4 py-2 rounded-xl border-2 font-medium transition-colors ${
                    selectedStudent === s.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card padding="lg">
                <h3 className="text-lg font-bold mb-4">Practice Time (minutes)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockPracticeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card padding="lg">
                <h3 className="text-lg font-bold mb-4">Mood Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockMoodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="before" stroke="#f59e0b" name="Before Practice" strokeWidth={2} />
                    <Line type="monotone" dataKey="after" stroke="#16a34a" name="After Practice" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <p className="text-3xl font-bold text-primary-700">195</p>
                <p className="text-sm text-slate-500">Minutes This Week</p>
              </Card>
              <Card className="text-center">
                <p className="text-3xl font-bold text-green-700">6</p>
                <p className="text-sm text-slate-500">Sessions</p>
              </Card>
              <Card className="text-center">
                <p className="text-3xl font-bold text-amber-600">3.8</p>
                <p className="text-sm text-slate-500">Avg Focus</p>
              </Card>
              <Card className="text-center">
                <p className="text-3xl font-bold text-purple-700">🔥 3</p>
                <p className="text-sm text-slate-500">Current Streak</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-800">My Students</h2>
            <div className="space-y-3">
              {mockStudents.map((student) => (
                <Card key={student.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{student.name}</h3>
                    <p className="text-sm text-slate-500">{student.level} • Last practice: {student.lastPractice}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-orange-600">🔥 {student.streak} day streak</span>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Goals</h2>
              <Button size="md" variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
            <div className="space-y-3">
              {mockGoals.map((goal) => (
                <Card key={goal.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{goal.title}</h3>
                    <p className="text-sm text-slate-500">
                      {goal.student} • Due: {goal.targetDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-slate-100">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Instructions</h2>
              <Button size="md" variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Instruction
              </Button>
            </div>
            <Card padding="lg">
              <p className="text-slate-500 text-center py-8">
                Select a student to manage their instructions.
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-800">Practice Schedules</h2>
            <Card padding="lg">
              <p className="text-slate-500 text-center py-8">
                Configure practice schedules for your students.
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
            <Card padding="lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                  <input type="text" className="w-full p-3 border-2 border-slate-200 rounded-xl" defaultValue="Mr. Johnson" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full p-3 border-2 border-slate-200 rounded-xl" defaultValue="johnson@school.edu" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
