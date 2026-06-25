import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, UserProfile } from '../types';
import { 
  Award, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  UserPlus, 
  Medal,
  RefreshCw,
  Trophy
} from 'lucide-react';

interface LeaderboardProps {
  user: UserProfile;
}

export default function Leaderboard({ user }: LeaderboardProps) {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leaderboards');
      if (response.ok) {
        const data = await response.json();
        setRankings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();
  }, [user.xp, user.streak]);

  return (
    <div className="space-y-6" id="scholarbot-leaderboard">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500 fill-amber-500/20" />
            ScholarBot Global Leaderboards
          </h2>
          <p className="text-xs text-slate-400">Earn XP by completing focus sessions, mastering quiz questions, and staying consistent.</p>
        </div>
        <button 
          onClick={fetchLeaderboards}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition flex items-center gap-1 text-xs font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Grid: Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Rank 2 Podium */}
        {rankings[1] && (
          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm relative flex flex-col justify-between order-2 md:order-1">
            <div className="absolute top-4 left-4 text-xs font-extrabold text-slate-400">#2 RANK</div>
            <div className="space-y-3 pt-4 flex flex-col items-center">
              <div className="relative">
                <img 
                  src={rankings[1].avatar} 
                  alt={rankings[1].userName} 
                  className="w-20 h-20 rounded-full border-4 border-slate-200 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1.5 w-7 h-7 bg-slate-300 text-slate-800 border-2 border-white rounded-full flex items-center justify-center font-black text-xs">
                  2
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{rankings[1].userName}</h4>
                <p className="text-xs text-slate-500">{rankings[1].xp} XP</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center items-center gap-1 text-xs text-amber-600 font-bold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{rankings[1].streak} Day Streak</span>
            </div>
          </div>
        )}

        {/* Rank 1 Podium (Highlighted) */}
        {rankings[0] && (
          <div className="bg-gradient-to-b from-amber-50/50 to-white border border-amber-200/60 rounded-3xl p-8 text-center shadow-md relative flex flex-col justify-between order-1 md:order-2 ring-2 ring-amber-400 ring-offset-2 scale-105">
            <div className="absolute top-4 right-4 p-1.5 bg-amber-500 text-white rounded-lg">
              <Trophy className="w-4.5 h-4.5 fill-white" />
            </div>
            <div className="absolute top-4 left-4 text-xs font-extrabold text-amber-700 uppercase tracking-widest">👑 LEADER</div>
            <div className="space-y-4 pt-4 flex flex-col items-center">
              <div className="relative">
                <img 
                  src={rankings[0].avatar} 
                  alt={rankings[0].userName} 
                  className="w-24 h-24 rounded-full border-4 border-amber-400 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1.5 w-8 h-8 bg-amber-500 text-white border-2 border-white rounded-full flex items-center justify-center font-black text-sm">
                  1
                </span>
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">{rankings[0].userName}</h4>
                <p className="text-sm text-indigo-600 font-bold">{rankings[0].xp} Total XP</p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-amber-100 flex justify-center items-center gap-1 text-sm text-amber-600 font-black">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-bounce" />
              <span>{rankings[0].streak} Day Streak</span>
            </div>
          </div>
        )}

        {/* Rank 3 Podium */}
        {rankings[2] && (
          <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm relative flex flex-col justify-between order-3">
            <div className="absolute top-4 left-4 text-xs font-extrabold text-slate-400">#3 RANK</div>
            <div className="space-y-3 pt-4 flex flex-col items-center">
              <div className="relative">
                <img 
                  src={rankings[2].avatar} 
                  alt={rankings[2].userName} 
                  className="w-20 h-20 rounded-full border-4 border-amber-600/30 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 -right-1.5 w-7 h-7 bg-amber-700 text-white border-2 border-white rounded-full flex items-center justify-center font-black text-xs">
                  3
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{rankings[2].userName}</h4>
                <p className="text-xs text-slate-500">{rankings[2].xp} XP</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center items-center gap-1 text-xs text-amber-600 font-bold">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{rankings[2].streak} Day Streak</span>
            </div>
          </div>
        )}

      </div>

      {/* Rankings List */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm" id="leaderboard-full-list">
        <h3 className="font-extrabold text-base text-slate-800">Global Leaderboard Rankings</h3>

        <div className="divide-y divide-slate-100">
          {rankings.map((entry, index) => {
            const isYou = entry.userId === user.id;
            return (
              <div 
                key={entry.userId} 
                className={`py-4 flex items-center justify-between gap-4 ${isYou ? 'bg-indigo-50/30 -mx-6 px-6 rounded-xl border-y border-indigo-100/50' : ''}`}
                id={`leader-row-${entry.userId}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-black text-slate-400 w-6 text-center text-sm font-mono">
                    #{entry.rank || index + 1}
                  </span>
                  
                  <img 
                    src={entry.avatar} 
                    alt={entry.userName} 
                    className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 truncate">
                      {entry.userName}
                      {isYou && <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">YOU</span>}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{entry.xp} total experience XP</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{entry.streak} Days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
