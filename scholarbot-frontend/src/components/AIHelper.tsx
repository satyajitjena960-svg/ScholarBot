import React, { useState, useRef, useEffect } from 'react';
import { StudyNote, SyllabusTopic, UserProfile } from '../types';
import { 
  Sparkles, 
  Send, 
  Brain, 
  RefreshCw, 
  MessageSquare,
  Bookmark,
  GraduationCap
} from 'lucide-react';

interface AIHelperProps {
  user: UserProfile;
  notes: StudyNote[];
  topics: SyllabusTopic[];
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AIHelper({ user, notes, topics }: AIHelperProps) {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello ${user.name}! I am **ScholarBot**, your personal AI academic tutor. I have loaded context from your study notes and active syllabus topics. 

Ask me any complex academic queries, request textbook explanations, or ask me to draft study schedules! How can I assist you today?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    const currentPrompt = prompt;
    setPrompt('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          notesContext: notes.map(n => ({ title: n.title, content: n.content })),
          syllabusContext: topics.map(t => ({ subject: t.subject, chapter: t.chapter, topic: t.topic, status: t.status }))
        })
      });

      if (!response.ok) throw new Error("ScholarBot is temporarily offline. Check back shortly.");
      const data = await response.json();

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: data.text || "I was unable to structure an answer. Try rephrasing.",
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message);
      // Append fallback error response
      setChatHistory(prev => [...prev, {
        sender: 'ai',
        text: "🚨 *System Note:* ScholarBot experienced a temporary API timeout. Please verify your internet connection or Gemini Secrets Key configurations.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-14rem)]" id="scholarbot-aihelper">
      
      {/* Side Bar: Dynamic loaded Academic Context indicators */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-6 overflow-y-auto">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Brain className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-sm text-slate-800">Tutor AI Context</h3>
        </div>

        {/* Loaded Notes context info */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            Loaded Knowledge ({notes.length})
          </span>
          {notes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No study notes loaded. Save notes to feed the AI.</p>
          ) : (
            <div className="space-y-1.5">
              {notes.map(n => (
                <div key={n.id} className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs truncate font-medium text-slate-700">
                  {n.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loaded syllabus context info */}
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            Target Syllabus ({topics.length})
          </span>
          {topics.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No syllabus topics added yet.</p>
          ) : (
            <div className="space-y-1.5">
              {topics.map(t => (
                <div key={t.id} className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs flex justify-between items-center">
                  <span className="truncate font-medium text-slate-700">{t.topic}</span>
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    t.status === 'mastered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {t.status === 'mastered' ? 'Done' : 'Todo'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat viewport */}
      <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full">
        
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl shadow-md">
              <Sparkles className="w-5 h-5 fill-indigo-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">ScholarBot Interactive Classroom</h3>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Gemini 3.5 Personal Tutor Active
              </p>
            </div>
          </div>
        </div>

        {/* Messages list */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatHistory.map((msg, index) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={index} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  isAI 
                    ? 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none font-sans font-medium' 
                    : 'bg-indigo-600 text-white rounded-tr-none font-semibold'
                }`}>
                  {/* Simplistic formatting support for bold tags from AI */}
                  <span className="whitespace-pre-wrap">
                    {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="font-black text-indigo-950 underline">{chunk}</strong> : chunk)}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500 font-bold animate-pulse">ScholarBot is thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-xs font-bold text-red-500">
              {error}
            </div>
          )}
        </div>

        {/* Chat sender form input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <input 
            id="chat-query-input"
            type="text" 
            placeholder="Ask ScholarBot for algebra proof, summaries, interview advice..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10"
          >
            <Send className="w-4 h-4 fill-white" />
            <span className="text-xs font-bold hidden md:inline">Ask AI</span>
          </button>
        </form>

      </div>

    </div>
  );
}
