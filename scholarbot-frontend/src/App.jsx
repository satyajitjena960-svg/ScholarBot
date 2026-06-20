import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Components organized cleanly inside modular feature folders
import FocusTimer from './features/timer/components/FocusTimer';
import Dashboard from './features/dashboard/components/Dashboard';
import SoftSkills from "./features/dashboard/components/SoftSkills";
import SchedulerCalendar from "./features/planner/components/SchedulerCalendar";
import ExamPlanner from "./features/planner/components/ExamPlanner";

import './App.css';

const BASE_URL = 'http://localhost:8080/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [user, setUser] = useState({ id: 1, name: 'Amrita', email: 'Amrita@academic.edu' });
  
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', isRegister: false });
  const [authError, setAuthError] = useState('');

  const [notes, setNotes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [documentViewerText, setDocumentViewerText] = useState('');

  const [syllabus, setSyllabus] = useState([]);

  const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: 'Hello! I am ScholarBot. Your AI text processing models are operational. Ask me anything about your syllabus subjects!' }]);

  const [quizScore, setQuizScore] = useState(null);
  const [totalStudyMinutes, setTotalStudyMinutes] = useState(8520);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('scholarbot_user', JSON.stringify(user));
      
      axios.get(`${BASE_URL}/features/notes/user/${user.id}`).then(res => setNotes(res.data)).catch(err => console.error(err));
      axios.get(`${BASE_URL}/features/syllabus/user/${user.id}`).then(res => setSyllabus(res.data)).catch(err => console.error(err));
      
      setLeaderboardUsers([
        { id: 1, name: `${user.name} (You)`, streak: user.currentStreak || 5, score: 4890 },
        { id: 2, name: 'Amrita Swain', streak: 12, score: 5100 },
        { id: 3, name: 'Satyajit Jena', streak: 8, score: 3800 }
      ]);
    } else {
      localStorage.removeItem('scholarbot_user');
    }
  }, [user, currentTab]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authForm.isRegister) {
        await axios.post(`${BASE_URL}/auth/register`, {
          name: authForm.name, 
          email: authForm.email, 
          password: authForm.password
        });
        alert("Registration complete! Please sign in.");
        setAuthForm({ ...authForm, isRegister: false, password: '' });
      } else {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
          email: authForm.email, 
          password: authForm.password
        });
        setUser(res.data);
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || "Authentication link failure. Please check your backend.");
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('scholarbot_user');
    alert("Logged out cleanly.");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07080a] text-white p-4">
        <form onSubmit={handleAuthSubmit} className="bg-[#111318] p-8 rounded-xl w-full max-w-sm border border-slate-800 shadow-xl">
          <h2 className="text-center text-xl font-bold text-indigo-500 mb-6">ScholarBot Security Access</h2>
          {authError && <div className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs p-2.5 rounded mb-4 text-center">{authError}</div>}
          {authForm.isRegister && (
            <input type="text" className="w-full bg-[#07080a] border border-slate-800 text-white rounded p-2.5 mb-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="Your Name" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} required />
          )}
          <input type="email" className="w-full bg-[#07080a] border border-slate-800 text-white rounded p-2.5 mb-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="Academic Email Address" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} required />
          <input type="password" className="w-full bg-[#07080a] border border-slate-800 text-white rounded p-2.5 mb-4 text-sm focus:outline-none focus:border-indigo-500" placeholder="Security Token Key" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} required />
          <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded text-sm font-bold text-white shadow-md">
            {authForm.isRegister ? 'Execute Platform Registration' : 'Validate Security Credentials'}
          </button>
          <p onClick={() => setAuthForm({ ...authForm, isRegister: !authForm.isRegister })} className="text-center text-xs text-slate-500 mt-4 cursor-pointer hover:text-slate-400">
            {authForm.isRegister ? 'Already verified? Access Portal Login' : "Don't hold security records? Register Account"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="app flex h-screen overflow-hidden bg-[#0a0a0f] text-[#f0f0f5]">
      
      {/* SIDEBAR NAVIGATION PANELS */}
      <aside className="sidebar w-64 bg-[#111118] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          <div className="sidebar-logo p-6 border-b border-white/5 flex items-center gap-3">
            <div className="logo-icon w-9 h-9 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">SB</div>
            <span className="logo-text font-extrabold text-lg text-white">Scholar<span className="text-indigo-400">Bot</span></span>
          </div>

          <nav className="p-3 space-y-1">
            <div className="nav-label text-[10px] text-slate-500 tracking-widest uppercase font-bold px-3 mt-4 mb-2">MAIN CONSOLE</div>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'dashboard' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('dashboard')}>📊 Dashboard</button>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'focus-timer' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('focus-timer')}>⏱ Focus Timer</button>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'notes' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('notes')}>📖 Notes</button>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'syllabus' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('syllabus')}>🎓 Syllabus</button>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'schedule' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('schedule')}>🗓 Schedule</button>

            <div className="nav-label text-[10px] text-slate-500 tracking-widest uppercase font-bold px-3 mt-4 mb-2">ACTIVITIES</div>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'weekly-quiz' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('weekly-quiz')}>🏅 Weekly Quiz</button>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'soft-skills' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('soft-skills')}>🧩 Soft Skills</button>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'leaderboard' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('leaderboard')}>🏆 Leaderboard</button>

            <div className="nav-label text-[10px] text-slate-500 tracking-widest uppercase font-bold px-3 mt-4 mb-2">AI SPACE</div>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'ai-assistant' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('ai-assistant')}>💬 AI Assistant</button>
            <button className={`nav-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentTab === 'exam-planner' ? 'active bg-indigo-500/10 text-indigo-400 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`} onClick={() => setCurrentTab('exam-planner')}>📅 Exam Planner</button>
          </nav>
        </div>

        <div className="sidebar-user p-4 border-t border-white/5 bg-black/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="avatar w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm">{user.name.charAt(0)}</div>
            <div className="user-info min-w-0 flex-1">
              <h4 className="user-name text-xs font-semibold text-slate-200 truncate">{user.name}</h4>
              <p className="user-plan text-[11px] text-amber-400 truncate">{user.email}</p>
            </div>
          </div>
          <button className="w-full py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/20 transition-colors" onClick={handleSignOut}>Terminate Session</button>
        </div>
      </aside>

      {/* CORE ACTIVE RUNTIME PANEL VIEWPORT */}
      <main className="main flex-1 flex flex-col overflow-hidden bg-[#0a0a0f]">
        <div className="page-content flex-1 p-6 md:p-8 overflow-y-auto">
          
          {currentTab === 'dashboard' && (
            <Dashboard user={user} notes={notes} syllabus={syllabus} quizScore={quizScore} />
          )}

          {currentTab === 'focus-timer' && (
            <div className="max-w-2xl bg-[#111118] border border-white/5 rounded-xl p-6 mx-auto shadow-xl flex flex-col items-center justify-center">
              <FocusTimer onLogMinutes={(mins) => setTotalStudyMinutes(prev => prev + (mins * 60))} />
            </div>
          )}

          {currentTab === 'schedule' && (
            <SchedulerCalendar />
          )}

          {currentTab === 'soft-skills' && (
            <SoftSkills />
          )}

          {/* Active Exam Planner tracking component with current database syllabus passing dependency */}
          {currentTab === 'exam-planner' && (
            <ExamPlanner syllabus={syllabus} />
          )}

          {currentTab === 'notes' && (
            <div className="space-y-4">
              <input type="text" className="w-full bg-[#111118] border border-white/5 p-2 rounded text-sm text-white" placeholder="🔍 Filter notebook keys..." value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
              <div className="p-4 bg-[#111118] border border-white/5 rounded-xl">
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{documentViewerText || "No file active in lab."}</p>
              </div>
            </div>
          )}

          {currentTab === 'syllabus' && (
            <div className="grid grid-cols-1 gap-3 max-w-xl">
              {syllabus.map((s, idx) => (
                <div key={idx} className="p-4 bg-[#111118] border border-white/5 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-semibold">{s.name}</span>
                  <span className="text-sm text-indigo-400 font-bold">{s.progress}%</span>
                </div>
              ))}
            </div>
          )}

          {currentTab === 'weekly-quiz' && (
            <div className="p-6 bg-[#111118] border border-white/5 rounded-xl max-w-xl text-center">
              <p className="text-sm text-slate-400">AI Weekly Examination Suite ready for assembly.</p>
            </div>
          )}

          {currentTab === 'ai-assistant' && (
            <div className="chat-wrap flex flex-col bg-[#111118] border border-white/5 rounded-xl p-4 max-w-3xl mx-auto h-[70vh]">
              <div className="chat-messages flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-xl text-sm max-w-[75%] ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 border border-white/5'}`}>{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'leaderboard' && (
            <div className="space-y-2 max-w-2xl">
              {leaderboardUsers.map((u, i) => (
                <div key={u.id} className="p-4 bg-[#111118] border border-white/5 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-medium">#{i+1} {u.name}</span>
                  <span className="text-sm text-indigo-400 font-bold">{u.score} pts</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
//last update by Amrita
