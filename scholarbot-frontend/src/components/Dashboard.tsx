import React, { useState } from 'react';
import { UserProfile, FocusSession } from '../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine,
  Legend 
} from 'recharts';
import { 
  Award, 
  Flame, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  sessions: FocusSession[];
  onOpenTab: (tab: string) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function Dashboard({ user, sessions, onOpenTab }: DashboardProps) {
  // Toggle state for daily progress chart
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  // Aggregate data for reports/charts
  const completedSessions = sessions.filter(s => s.completed);
  
  const totalMinutes = completedSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const totalSessionsCount = completedSessions.length;

  // Pie chart data: focus per category
  const categoryDataMap: Record<string, number> = {};
  completedSessions.forEach(s => {
    categoryDataMap[s.category] = (categoryDataMap[s.category] || 0) + s.duration;
  });

  const categoryPieData = Object.entries(categoryDataMap).map(([name, value]) => ({
    name,
    value
  }));

  // Bar chart data: study minutes over the last 7 days
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const minutes = completedSessions
      .filter(s => s.timestamp.startsWith(dateStr))
      .reduce((acc, curr) => acc + curr.duration, 0);

    return {
      date: dateStr,
      day: dayName,
      minutes
    };
  }).reverse();

  // Progress stats over 7 days
  const sum7Days = last7DaysData.reduce((acc, curr) => acc + curr.minutes, 0);
  const avg7Days = Math.round(sum7Days / 7);
  const peak7Days = Math.max(...last7DaysData.map(d => d.minutes));
  const dailyTargetMinutes = user.targetHours ? Math.round((user.targetHours * 60) / 7) : 45;

  // Progress to next level (each level requires 1000 XP)
  const currentLevelXP = user.xp % 1000;
  const levelProgressPercent = Math.min(100, Math.floor((currentLevelXP / 1000) * 100));

  // Category goals vs actual
  const categoryGoalsList = Object.entries(user.categoryTargets).map(([category, targetMinutes]) => {
    const actualMinutes = categoryDataMap[category] || 0;
    const pct = Math.min(100, Math.floor((actualMinutes / targetMinutes) * 100));
    return {
      category,
      targetMinutes,
      actualMinutes,
      pct
    };
  });

  return (
    <div className="space-y-8" id="scholarbot-dashboard">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 animate-pulse text-indigo-400" />
        </div>
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-sm font-medium animate-bounce">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Powered Study Companion Active
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300 font-black">{user.name}</span>!
          </h1>
          <p className="text-indigo-200/80 text-base">
            Your study streak is going strong at <span className="font-bold text-amber-400">{user.streak} days</span>. Keep going to claim the top spot on the leaderboard! Use our customizable Pomodoro clocks, AI Syllabus guides, and interactive peer rooms.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              id="dash-btn-timer"
              onClick={() => onOpenTab('timer')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 font-semibold rounded-xl text-white transition shadow-lg shadow-indigo-500/20 text-sm"
            >
              🎯 Start Focus Timer
            </button>
            <button 
              id="dash-btn-ask-ai"
              onClick={() => onOpenTab('ai')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 font-semibold rounded-xl text-indigo-300 transition text-sm"
            >
              🤖 Ask ScholarBot AI
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition" id="stat-card-streak">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 font-medium">Daily Streak</p>
            <h4 className="text-3xl font-black text-slate-900">{user.streak} Days</h4>
            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Active learning block
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-500">
            <Flame className="w-8 h-8 fill-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition" id="stat-card-level">
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-1">
              <p className="text-sm text-slate-500 font-medium">Scholar Level</p>
              <h4 className="text-3xl font-black text-slate-900">Lvl {user.level}</h4>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <Award className="w-8 h-8" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>{currentLevelXP} / 1000 XP</span>
              <span>{levelProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Study Hours Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition" id="stat-card-hours">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 font-medium">Total Study Time</p>
            <h4 className="text-3xl font-black text-slate-900">{totalHours} hrs</h4>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {totalSessionsCount} completed blocks
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500">
            <Clock className="w-8 h-8" />
          </div>
        </div>

        {/* Study Points Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition" id="stat-card-points">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 font-medium">Sync Study Points</p>
            <h4 className="text-3xl font-black text-slate-900">{user.studyPoints} pts</h4>
            <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Spendable on avatars & themes
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
      </div>

      {/* Charts section: Focus report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly study duration Chart with toggle support */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-between space-y-4" id="chart-card-weekly">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-slate-50">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Focus Report (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-400">Total study duration tracked per day in minutes</p>
            </div>

            {/* Selector group */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                id="chart-toggle-area"
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  chartType === 'area' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Area
              </button>
              <button
                id="chart-toggle-bar"
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  chartType === 'bar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Bar
              </button>
              <button
                id="chart-toggle-line"
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  chartType === 'line' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Line
              </button>
            </div>
          </div>

          {/* Core Analytics Inline Telemetry */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">7-Day Avg</span>
              <p className="text-base font-black text-indigo-600">{avg7Days} mins</p>
            </div>
            <div className="space-y-0.5 border-x border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peak Focus</span>
              <p className="text-base font-black text-emerald-600">{peak7Days} mins</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Target</span>
              <p className="text-base font-black text-amber-500">{dailyTargetMinutes} mins</p>
            </div>
          </div>
          
          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'black', color: '#818cf8', marginBottom: '4px' }}
                  />
                  <ReferenceLine y={dailyTargetMinutes} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Target: ${dailyTargetMinutes}m`, fill: '#10b981', position: 'top', fontSize: 10, fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="minutes" name="Focus Duration" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMinutes)" />
                </AreaChart>
              ) : chartType === 'bar' ? (
                <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'black', color: '#818cf8', marginBottom: '4px' }}
                  />
                  <ReferenceLine y={dailyTargetMinutes} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Target: ${dailyTargetMinutes}m`, fill: '#10b981', position: 'top', fontSize: 10, fontWeight: 'bold' }} />
                  <Bar dataKey="minutes" name="Focus Duration" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              ) : (
                <LineChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'black', color: '#818cf8', marginBottom: '4px' }}
                  />
                  <ReferenceLine y={dailyTargetMinutes} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Target: ${dailyTargetMinutes}m`, fill: '#10b981', position: 'top', fontSize: 10, fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="minutes" name="Focus Duration" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 7 }} dot={{ r: 4, strokeWidth: 2, stroke: '#6366f1', fill: '#fff' }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {completedSessions.length === 0 && (
            <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-2.5 text-xs text-indigo-950 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              <span>🚀 Your focus records will appear here as soon as you complete your first study block in the <strong>Pomodoro Timer</strong> tab!</span>
            </div>
          )}
        </div>

        {/* Categories Pie chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4" id="chart-card-categories">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Topic Allocation</h3>
            <p className="text-xs text-slate-400">Distribution of subjects studied</p>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            {categoryPieData.length === 0 ? (
              <div className="text-slate-400 text-sm text-center">
                Start a focus session to see subject breakdown.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {categoryPieData.length > 0 && (
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">{totalSessionsCount}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Blocks</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {categoryPieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress towards study targets */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4" id="dashboard-targets">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Weekly Target Allocation tracker</h3>
          <p className="text-xs text-slate-400">Track study times compared to your configured targets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoryGoalsList.map((g, index) => (
            <div key={g.category} className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{g.category}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-black text-slate-800">{g.actualMinutes}</span>
                  <span className="text-xs text-slate-500">/ {g.targetMinutes}m</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${g.pct}%`, 
                      backgroundColor: COLORS[index % COLORS.length] 
                    }} 
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-bold block text-right">{g.pct}% target met</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
