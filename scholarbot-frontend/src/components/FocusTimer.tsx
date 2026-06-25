import React, { useState, useEffect, useRef } from 'react';
import { FocusSession, UserProfile } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  CheckCircle2, 
  Flame, 
  AlertTriangle,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  History
} from 'lucide-react';

interface FocusTimerProps {
  user: UserProfile;
  onSessionComplete: (session: FocusSession, updatedUser: UserProfile) => void;
  refreshSessions: () => void;
  sessions: FocusSession[];
}

type TimerMode = 'work' | 'short_break' | 'long_break';

export default function FocusTimer({ user, onSessionComplete, refreshSessions, sessions }: FocusTimerProps) {
  // Config state
  const [mode, setMode] = useState<TimerMode>('work');
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  
  // Timer active variables
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Mathematics');
  const [notes, setNotes] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer when mode/settings change
  useEffect(() => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workMinutes * 60);
    } else if (mode === 'short_break') {
      setTimeLeft(shortBreakMinutes * 60);
    } else {
      setTimeLeft(longBreakMinutes * 60);
    }
  }, [mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

  // Audio simulation or true browser buzzer
  const playBeep = () => {
    if (isMuted) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio context not allowed by browser permissions.");
    }
  };

  // Counting logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playBeep();
            handleTimerFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerFinished = async () => {
    if (mode === 'work') {
      // Save focus block to database
      setSaving(true);
      setError(null);
      try {
        const response = await fetch('/api/focus/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            duration: workMinutes,
            category: selectedCategory,
            notes: notes || `Focus session completed (${workMinutes}m)`,
            completed: true
          })
        });

        if (!response.ok) {
          throw new Error("Failed to save study block to server.");
        }

        const data = await response.json();
        onSessionComplete(data.session, data.updatedUser);
        setNotes('');
        alert(`🏆 Fantastic! You completed a ${workMinutes} minute focus block! Claimed XP rewards.`);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setSaving(false);
      }
    } else {
      alert(`🌅 Break over! Ready to focus?`);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workMinutes * 60);
    } else if (mode === 'short_break') {
      setTimeLeft(shortBreakMinutes * 60);
    } else {
      setTimeLeft(longBreakMinutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = () => {
    let max = 25 * 60;
    if (mode === 'work') max = workMinutes * 60;
    else if (mode === 'short_break') max = shortBreakMinutes * 60;
    else max = longBreakMinutes * 60;

    return ((max - timeLeft) / max) * 100;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="scholarbot-focustimer">
      
      {/* Column 1 & 2: Interactive Timer */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Top bar control */}
        <div className="w-full flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex gap-2">
            <button 
              id="mode-btn-work"
              onClick={() => setMode('work')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${mode === 'work' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              📚 Focus Block
            </button>
            <button 
              id="mode-btn-short"
              onClick={() => setMode('short_break')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${mode === 'short_break' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              ☕ Short Break
            </button>
            <button 
              id="mode-btn-long"
              onClick={() => setMode('long_break')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${mode === 'long_break' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🌴 Long Break
            </button>
          </div>

          <button 
            id="toggle-mute-btn"
            onClick={() => setIsMuted(!isMuted)} 
            className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition"
            title={isMuted ? "Unmute Alarm" : "Mute Alarm"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>

        {/* Timer Visual Dial */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mt-4">
          {/* Circular progress track SVG */}
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle 
              cx="50%" 
              cy="50%" 
              r="44%" 
              stroke="#f1f5f9" 
              strokeWidth="10" 
              fill="transparent" 
            />
            <circle 
              cx="50%" 
              cy="50%" 
              r="44%" 
              stroke={mode === 'work' ? '#6366f1' : mode === 'short_break' ? '#10b981' : '#3b82f6'} 
              strokeWidth="10" 
              fill="transparent" 
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent()) / 100}
              className="transition-all duration-300"
              style={{
                strokeDasharray: '550',
                strokeDashoffset: `${550 - (550 * progressPercent()) / 100}`,
                strokeLinecap: 'round'
              }}
            />
          </svg>

          {/* Time text centered */}
          <div className="text-center z-10 space-y-1">
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight font-mono">
              {formatTime(timeLeft)}
            </h2>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
              {mode === 'work' ? 'Time to Focus' : 'Relaxing Break'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center justify-center pt-2">
          <button 
            id="btn-reset-timer"
            onClick={resetTimer}
            className="p-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all active:scale-95"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            id="btn-play-pause-timer"
            onClick={toggleTimer}
            className={`p-6 rounded-full text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 duration-200 ${
              mode === 'work' 
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-500/30' 
                : mode === 'short_break'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white translate-x-0.5" />}
          </button>
        </div>

        {/* Config and Category Selection during Focus */}
        {mode === 'work' && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Select Subject</label>
              <select 
                id="timer-category-select"
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Language">Language</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Focus Goals / Notes</label>
              <input 
                id="timer-notes-input"
                type="text" 
                placeholder="What are you working on?" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs font-bold text-red-500 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
      </div>

      {/* Column 3: Custom Durations Config & History log */}
      <div className="space-y-6">
        
        {/* Custom Duration Config Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4" id="timer-config-settings">
          <div className="flex items-center gap-2 text-slate-800 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-base">Adjust Timer Settings</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Focus Minutes</span>
              <div className="flex items-center gap-2">
                <input 
                  id="config-work"
                  type="number" 
                  min="5" 
                  max="120"
                  value={workMinutes} 
                  onChange={(e) => setWorkMinutes(Math.max(5, Number(e.target.value)))}
                  className="w-16 text-center text-slate-800 font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Short Break</span>
              <div className="flex items-center gap-2">
                <input 
                  id="config-short"
                  type="number" 
                  min="1" 
                  max="30"
                  value={shortBreakMinutes} 
                  onChange={(e) => setShortBreakMinutes(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-center text-slate-800 font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Long Break</span>
              <div className="flex items-center gap-2">
                <input 
                  id="config-long"
                  type="number" 
                  min="5" 
                  max="60"
                  value={longBreakMinutes} 
                  onChange={(e) => setLongBreakMinutes(Math.max(5, Number(e.target.value)))}
                  className="w-16 text-center text-slate-800 font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Focus History Logs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 flex-1 flex flex-col" id="timer-history-panel">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800">
              <History className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-base">Your Focus History</h3>
            </div>
            <button 
              onClick={refreshSessions}
              className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {sessions.length === 0 ? (
              <div className="text-xs text-slate-400 py-8 text-center">
                No focus logs detected. Start studying!
              </div>
            ) : (
              [...sessions].reverse().map((sess) => (
                <div key={sess.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-600">{sess.category}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sess.timestamp).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{sess.notes}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Completed • {sess.duration}m logged
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
