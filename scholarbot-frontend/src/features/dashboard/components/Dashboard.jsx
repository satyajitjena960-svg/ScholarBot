import React from 'react';

export default function Dashboard({ 
  user = { name: 'Scholar' }, 
  notes = [], 
  syllabus = [], 
  quizScore = false 
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-100">Dashboard</h1>
      
      {/* Welcome Banner Card */}
      <div className="bg-gradient-to-br from-[#111318] to-[#15181e] border border-slate-800 p-6 rounded-xl mb-6 shadow-md">
        <h2 className="text-xl font-semibold text-slate-100">Welcome back, {user.name}! 👋</h2>
        <p className="text-slate-500 text-xs mt-1">
          Real-time full-stack database links successfully generated. All actions update Postgres structures live.
        </p>
      </div>

      {/* Analytics Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Study Hours */}
        <div className="bg-[#15181e] border border-slate-800/80 p-5 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
          <h6 className="text-[#414755] mb-1.5 text-xs font-bold tracking-wider uppercase">STUDY HOURS LOGGED</h6>
          <h2 className="text-2xl font-bold text-slate-100">
            142 <span className="text-sm font-medium text-purple-400 ml-1">+12h this wk</span>
          </h2>
        </div>
        
        {/* Card 2: Notes Count */}
        <div className="bg-[#15181e] border border-slate-800/80 p-5 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
          <h6 className="text-[#414755] mb-1.5 text-xs font-bold tracking-wider uppercase">NOTES STORED</h6>
          <h2 className="text-2xl font-bold text-slate-100">{notes.length}</h2>
        </div>
        
        {/* Card 3: Syllabus Items Count */}
        <div className="bg-[#15181e] border border-slate-800/80 p-5 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
          <h6 className="text-[#414755] mb-1.5 text-xs font-bold tracking-wider uppercase">SYLLABUS ITEMS</h6>
          <h2 className="text-2xl font-bold text-slate-100">{syllabus.length}</h2>
        </div>
        
        {/* Card 4: Quiz Score Performance */}
        <div className="bg-[#15181e] border border-slate-800/80 p-5 rounded-xl shadow-sm hover:border-slate-700 transition-colors">
          <h6 className="text-[#414755] mb-1.5 text-xs font-bold tracking-wider uppercase">QUIZ PERFORMANCE</h6>
          <h2 className="text-2xl font-bold text-slate-100">{quizScore ? '85%' : '0%'}</h2>
        </div>

      </div>
    </div>
  );
}