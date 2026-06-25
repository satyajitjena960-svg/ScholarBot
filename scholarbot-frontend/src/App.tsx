import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  FocusSession, 
  SyllabusTopic, 
  StudyNote, 
  ExamGoal 
} from './types';
import Dashboard from './components/Dashboard';
import FocusTimer from './components/FocusTimer';
import SyllabusTracker from './components/SyllabusTracker';
import NotesHub from './components/NotesHub';
import ExamPlanner from './components/ExamPlanner';
import AIHelper from './components/AIHelper';
import SoftSkills from './components/SoftSkills';
import StudyRooms from './components/StudyRooms';
import Leaderboard from './components/Leaderboard';
import { 
  Trophy, 
  Users, 
  BookOpen, 
  Clock, 
  FileText, 
  Calendar, 
  Sparkles, 
  Compass, 
  LayoutDashboard,
  LogOut,
  User,
  GraduationCap,
  Flame,
  Award,
  BookMarked,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Authentication & Session States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data lists
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [topics, setTopics] = useState<SyllabusTopic[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [exams, setExams] = useState<ExamGoal[]>([]);

  // Page loading & errors
  const [authLoading, setAuthLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is cached in local storage
  useEffect(() => {
    const cachedUser = localStorage.getItem('scholarbot_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse cached user", e);
      }
    }
  }, []);

  // Fetch full student database records when logged in
  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      setDataLoading(true);
      try {
        const [sessRes, syllRes, notesRes, examsRes] = await Promise.all([
          fetch(`/api/focus/sessions/${user.id}`),
          fetch(`/api/syllabus/${user.id}`),
          fetch(`/api/notes/${user.id}`),
          fetch(`/api/exams/${user.id}`)
        ]);

        if (sessRes.ok) setSessions(await sessRes.json());
        if (syllRes.ok) setTopics(await syllRes.json());
        if (notesRes.ok) setNotes(await notesRes.json());
        if (examsRes.ok) setExams(await examsRes.json());
      } catch (err) {
        console.error("Failed loading scholar database details:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchAllData();
  }, [user?.id]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setAuthLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      if (!response.ok) {
        throw new Error("Unable to authenticate. Please check the backend connection.");
      }

      const authenticatedUser = await response.json();
      setUser(authenticatedUser);
      localStorage.setItem('scholarbot_user', JSON.stringify(authenticatedUser));
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scholarbot_user');
    setSessions([]);
    setTopics([]);
    setNotes([]);
    setExams([]);
    setActiveTab('dashboard');
  };

  const handleSessionComplete = (newSession: FocusSession, updatedUser: UserProfile) => {
    setSessions(prev => [...prev, newSession]);
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('scholarbot_user', JSON.stringify(updatedUser));
    }
  };

  const refreshSessions = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/focus/sessions/${user.id}`);
      if (res.ok) setSessions(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  // Nav items helper
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timer', label: 'Pomodoro Timer', icon: Clock },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: BookMarked },
    { id: 'notes', label: 'Notes Hub', icon: FileText },
    { id: 'exams', label: 'Exam Planner', icon: Calendar },
    { id: 'ai', label: 'ScholarBot AI', icon: Sparkles },
    { id: 'softskills', label: 'Soft Skills Coach', icon: Compass },
    { id: 'rooms', label: 'Study Rooms', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-100" id="scholarbot-auth-view">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          <div className="inline-flex p-4 bg-indigo-500/10 border border-indigo-400/30 rounded-3xl text-indigo-400 animate-pulse">
            <Sparkles className="w-10 h-10 fill-indigo-400/20" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            SCHOLARBOT
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Your AI-Powered Personal Study Assistant with Gamified Progress, Syllabus Mapping, and Team Focus Rooms.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-800/80 border border-slate-700/50 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Your Full Name
                </label>
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="Anya Taylor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  placeholder="anya@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 font-semibold text-center leading-relaxed">
                  {error}
                </p>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30"
              >
                {authLoading ? 'Syncing Profile...' : 'Enter ScholarBot Vault'}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-700/60 text-center text-xs text-slate-500 leading-relaxed">
              We leverage cloud-sync to secure your Pomodoro durations, notes summaries, and leaderboard rankings.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased" id="scholarbot-main-layout">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 hidden md:flex">
        
        {/* Sidebar Header & Brand */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <Sparkles className="w-5 h-5 fill-indigo-200" />
            </div>
            <div>
              <h2 className="font-black text-white text-base tracking-wider">SCHOLARBOT</h2>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold px-1.5 py-0.5 rounded uppercase">
                AI STUDY LAB
              </span>
            </div>
          </div>

          {/* Quick Active Student Details */}
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-xl border border-slate-700/60"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h4 className="font-extrabold text-white text-xs truncate">{user.name}</h4>
                <p className="text-[10px] text-slate-400">Level {user.level} Scholar</p>
              </div>
            </div>

            {/* Exp progress tracker */}
            <div className="space-y-1">
              <div className="w-full bg-slate-700 rounded-full h-1">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${user.xp % 1000 / 10}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                <span>{user.xp % 1000} / 1000 XP</span>
                <span className="text-amber-500 flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-amber-500" />
                  {user.streak}d streak
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <IconComp className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer logout */}
        <div className="p-6 border-t border-slate-800">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>

      {/* CONTENT REGION CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP BAR / MOBILE NAVBAR */}
        <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-20 shadow-sm md:shadow-none">
          
          <div className="flex items-center gap-2 md:hidden">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h1 className="font-black text-slate-900 text-base">SCHOLARBOT</h1>
          </div>

          {/* Tab Display Header Title */}
          <div className="hidden md:block">
            <h2 className="font-extrabold text-slate-900 text-base uppercase tracking-wider">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            
            {/* Quick stats indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{user.streak} Days</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" />
                <span>{user.studyPoints} pts</span>
              </div>
            </div>

            {/* Small mobile sign out */}
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 transition md:hidden"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </header>

        {/* Dynamic Mobile Tab Switcher */}
        <div className="bg-white border-b border-slate-100 p-2 overflow-x-auto flex gap-1.5 md:hidden shrink-0">
          {navItems.map((item) => (
            <button
              id={`mobile-nav-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-wider whitespace-nowrap transition ${
                activeTab === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* MAIN BODY WINDOW */}
        <div className="p-6 md:p-8 flex-1">
          {dataLoading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500 animate-pulse">Syncing personal scholar profiles...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard 
                  user={user} 
                  sessions={sessions} 
                  onOpenTab={(tab) => setActiveTab(tab)} 
                />
              )}

              {activeTab === 'timer' && (
                <FocusTimer 
                  user={user} 
                  onSessionComplete={handleSessionComplete} 
                  refreshSessions={refreshSessions}
                  sessions={sessions}
                />
              )}

              {activeTab === 'syllabus' && (
                <SyllabusTracker 
                  user={user} 
                  topics={topics}
                  onAddTopic={(newT) => setTopics(prev => [...prev, newT])}
                  onUpdateTopic={(updT) => setTopics(prev => prev.map(t => t.id === updT.id ? updT : t))}
                  onDeleteTopic={(id) => setTopics(prev => prev.filter(t => t.id !== id))}
                />
              )}

              {activeTab === 'notes' && (
                <NotesHub 
                  user={user} 
                  notes={notes}
                  onAddNote={(newN) => setNotes(prev => [...prev, newN])}
                  onUpdateNote={(updN) => setNotes(prev => prev.map(n => n.id === updN.id ? updN : n))}
                  onDeleteNote={(id) => setNotes(prev => prev.filter(n => n.id !== id))}
                />
              )}

              {activeTab === 'exams' && (
                <ExamPlanner 
                  user={user} 
                  exams={exams}
                  onAddExam={(newE) => setExams(prev => [...prev, newE])}
                  onUpdateExam={(updE) => setExams(prev => prev.map(e => e.id === updE.id ? updE : e))}
                  onDeleteExam={(id) => setExams(prev => prev.filter(e => e.id !== id))}
                />
              )}

              {activeTab === 'ai' && (
                <AIHelper 
                  user={user} 
                  notes={notes} 
                  topics={topics} 
                />
              )}

              {activeTab === 'softskills' && (
                <SoftSkills 
                  user={user} 
                />
              )}

              {activeTab === 'rooms' && (
                <StudyRooms 
                  user={user} 
                />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard 
                  user={user} 
                />
              )}
            </>
          )}
        </div>

      </main>

    </div>
  );
}
