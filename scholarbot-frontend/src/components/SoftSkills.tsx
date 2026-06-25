import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Smile, 
  Award, 
  Mic, 
  ShieldAlert, 
  ChevronRight,
  BookOpen,
  Compass,
  MessageCircleCode
} from 'lucide-react';

interface SoftSkillsProps {
  user: UserProfile;
}

interface CoachMessage {
  sender: 'user' | 'coach';
  text: string;
}

export default function SoftSkills({ user }: SoftSkillsProps) {
  // Scenarios list
  const scenarios = [
    {
      id: "speaking",
      title: "Public Speaking Coach",
      description: "Pitch study chapters or present concepts. Master timing, structure, and verbal hooks.",
      role: "Public Speaking Mentor",
      starter: "Hello! Pitch a key academic concept or draft your next speech introduction. I will evaluate your vocal structure, hook effectiveness, and layout."
    },
    {
      id: "time",
      title: "Time Management Master",
      description: "Conquer procrastination blocks, organize custom Pomodoro plans, and construct high-yield habits.",
      role: "Procrastination Buster Coach",
      starter: "Tell me what course block you are putting off today and why. We will construct a realistic 3-step action plan to break your paralysis!"
    },
    {
      id: "interview",
      title: "Admissions & Job Interview prep",
      description: "Practice high-level situational mock questions using the structured STAR framework.",
      role: "Polite Interviewer",
      starter: "Welcome to your admissions interview. Let's practice. 'Tell me about a time you failed to meet an academic milestone. How did you react, and what did you learn?'"
    },
    {
      id: "resilience",
      title: "Exam Resilience & Wellness Guide",
      description: "Calm active study overwhelm, exam panic, and framing test failures as learning steps.",
      role: "Empathy Counselor",
      starter: "Take a deep breath. Tell me what is weighing heavy on your mind or causing focus fatigue. We will map a gentle, healthy path forward."
    }
  ];

  const [activeScenario, setActiveScenario] = useState<typeof scenarios[0] | null>(null);
  const [chatHistory, setChatHistory] = useState<CoachMessage[]>([]);
  const [userMsg, setUserMsg] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const selectScenario = (id: string) => {
    const selected = scenarios.find(s => s.id === id)!;
    setActiveScenario(selected);
    setChatHistory([
      { sender: 'coach', text: selected.starter }
    ]);
    setError(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim() || !activeScenario || loading) return;

    const newHistory: CoachMessage[] = [...chatHistory, { sender: 'user', text: userMsg }];
    setChatHistory(newHistory);
    const sentText = userMsg;
    setUserMsg('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/softskills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          chatHistory: newHistory,
          userMessage: sentText
        })
      });

      if (!response.ok) throw new Error("Mentor connection interrupted.");
      const data = await response.json();

      setChatHistory(prev => [...prev, { sender: 'coach', text: data.text }]);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setChatHistory(prev => [...prev, {
        sender: 'coach',
        text: "My apologies, ScholarBot experienced an AI API block. Let's try your statement once more."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="scholarbot-softskills">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-500" />
            Soft Skill Development Coach
          </h2>
          <p className="text-xs text-slate-400">Interact with specialized ScholarBot models to master communications, stress management, and presentation techniques</p>
        </div>

        {activeScenario && (
          <button 
            id="back-scenarios-btn"
            onClick={() => setActiveScenario(null)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            ← Change Scenario
          </button>
        )}
      </div>

      {!activeScenario ? (
        /* Grid Selection */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((s) => (
            <div 
              key={s.id} 
              id={`scenario-card-${s.id}`}
              onClick={() => selectScenario(s.id)}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 hover:shadow-md hover:border-indigo-100 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                  <span>{s.role}</span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-950">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-indigo-500 text-xs font-bold">
                <span>Start Roleplay Simulation</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Chat Simulator Viewport */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-16rem)]">
          
          {/* Left panel: Info about active role */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 self-start">
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm pb-2 border-b border-slate-100">
              <Compass className="w-4.5 h-4.5 text-indigo-500" />
              <span>Active Coaching Session</span>
            </div>
            
            <div className="space-y-1">
              <h4 className="font-black text-slate-950 text-sm">{activeScenario.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{activeScenario.description}</p>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-xl space-y-1">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Active Model</span>
              <p className="text-[11px] text-indigo-950 leading-relaxed font-bold">ScholarBot Soft Skill Mentor</p>
            </div>
          </div>

          {/* Right chat logs container */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-extrabold text-slate-900">{activeScenario.role} Active</span>
              </div>
            </div>

            {/* Chats */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatHistory.map((msg, index) => {
                const isCoach = msg.sender === 'coach';
                return (
                  <div key={index} className={`flex ${isCoach ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                      isCoach 
                        ? 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none font-medium' 
                        : 'bg-indigo-600 text-white rounded-tr-none font-semibold'
                    }`}>
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                    <span className="text-xs text-slate-500 font-bold">Mentor is typing constructive feedback...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-center text-xs font-bold text-red-500">
                  {error}
                </div>
              )}
            </div>

            {/* Input sender */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              <textarea 
                id="coach-response-input"
                placeholder="Type your response or pitch here..." 
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                rows={2}
                disabled={loading}
                className="flex-1 bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
              />
              <button
                id="coach-send-btn"
                type="submit"
                disabled={loading || !userMsg.trim()}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10 self-end"
              >
                <Send className="w-4 h-4 fill-white" />
                <span className="text-xs font-bold hidden md:inline font-mono">PITCH</span>
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
