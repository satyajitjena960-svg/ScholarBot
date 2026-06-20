import React, { useState } from 'react';

export default function ExamPlanner({ syllabus }) {
  const [examDates, setExamDates] = useState({});
  const [priorities, setPriorities] = useState({});

  // 💡 Placeholder backup data if the database array comes back empty or loading
  const activeSyllabus = syllabus && syllabus.length > 0 ? syllabus : [
    { name: "Cloud Computing Assignment & Viva Prep", progress: 60 },
    { name: "Information Security Concepts", progress: 45 },
    { name: "Data Structures & Algorithms (Trees/Stacks)", progress: 75 }
  ];

  return (
    <div style={{ color: '#fff' }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#fff' }}>📅 Dynamic Exam Target Progress Coverage Planner</h1>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select target deadlines and critical urgency parameters below to generate active daily workloads.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activeSyllabus.map((s, idx) => {
          const targetDate = examDates[idx] || '';
          const priority = priorities[idx] || 'Medium';
          let metricsString = "Select targeted calendar deadline above.";
          let urgencyBadge = "Awaiting input date";

          if (targetDate) {
            const diffDays = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
              urgencyBadge = `${diffDays} Days Left`;
              const dailyRate = ((100 - s.progress) / diffDays).toFixed(1);
              metricsString = `To achieve 100% mastery before deadline at [Priority: ${priority}], you must cover exactly ${dailyRate}% of contents per day.`;
            } else {
              urgencyBadge = "Active Session Cycle";
            }
          }

          return (
            <div key={idx} style={{ background: '#111318', borderRadius: '12px', border: '1px solid #1c1f26', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>Subject: {s.name}</h4>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '0.15rem 0.5rem', borderRadius: '4px', background: priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#eab308' : '#22c55e', color: '#fff' }}>{priority} Priority</span>
                </div>
                
                {/* Progress Tracking Bar Integration */}
                <div style={{ width: '300px', background: '#07080a', height: '6px', borderRadius: '10px', margin: '0.5rem 0', overflow: 'hidden' }}>
                  <div style={{ width: `${s.progress}%`, background: 'linear-gradient(90deg, #a855f7, #3b82f6)', height: '100%' }}></div>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Current Database Mastery Tracker level: {s.progress}%</span>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#c084fc', fontStyle: 'italic' }}>⚡ Analysis: {metricsString}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                <input type="date" style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', fontSize: '0.85rem' }} value={targetDate} onChange={(e) => setExamDates({ ...examDates, [idx]: e.target.value })} />
                <select style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', fontSize: '0.85rem', width: '100%' }} value={priority} onChange={(e) => setPriorities({ ...priorities, [idx]: e.target.value })}>
                  <option value="Low">Low Importance</option>
                  <option value="Medium">Medium Importance</option>
                  <option value="High">High Importance</option>
                </select>
                <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold' }}>{urgencyBadge}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}