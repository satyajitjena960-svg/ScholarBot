import React, { useState, useEffect } from 'react';

export default function FocusTimer({ onLogMinutes }) {
  const [timerSeconds, setTimerSeconds] = useState(1500); // Default 25 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [customMins, setCustomMins] = useState('');

  useEffect(() => {
    let ticker = null;
    if (isTimerRunning && timerSeconds > 0) {
      ticker = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      const sessionMinutes = Math.round((1500 - timerSeconds) / 60) || 25;
      onLogMinutes(sessionMinutes);
      alert("🏆 Time session complete! Logged straight to your dashboard analytics.");
    }
    return () => clearInterval(ticker);
  }, [isTimerRunning, timerSeconds]);

  const changePreset = (mins) => {
    setIsTimerRunning(false);
    setTimerSeconds(mins * 60);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customMins || isNaN(customMins)) return;
    setIsTimerRunning(false);
    setTimerSeconds(parseInt(customMins) * 60);
    setCustomMins('');
  };

  return (
    <div style={{ background: '#111318', borderRadius: '12px', border: '1px solid #1c1f26', padding: '2rem' }}>
      <h2 style={{ color: '#c084fc', margin: '0 0 1rem 0' }}>⏱ Interactive Focus Engine Clock</h2>
      
      {/* Timer Presets Matrix */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button onClick={() => changePreset(5)} style={{ padding: '0.5rem 1rem', background: '#1c1f26', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>☕ Short Break (5m)</button>
        <button onClick={() => changePreset(15)} style={{ padding: '0.5rem 1rem', background: '#1c1f26', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🏝 Long Break (15m)</button>
        <button onClick={() => changePreset(25)} style={{ padding: '0.5rem 1rem', background: '#1c1f26', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>⏱ Pomodoro (25m)</button>
        <button onClick={() => changePreset(60)} style={{ padding: '0.5rem 1rem', background: '#1c1f26', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🚀 Deep Session (1h)</button>
      </div>

      {/* Custom Input Form */}
      <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input type="number" placeholder="Enter custom minutes..." style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #1c1f26', background: '#07080a', color: '#fff', width: '200px' }} value={customMins} onChange={e => setCustomMins(e.target.value)} min="1" max="300" />
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#a855f7', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Set Target</button>
      </form>

      <div style={{ fontSize: '5rem', fontFamily: 'monospace', fontWeight: 'bold', margin: '1.5rem 0', color: '#fff' }}>
        {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ padding: '0.7rem 2rem', border: 'none', background: isTimerRunning ? '#eab308' : '#22c55e', color: '#fff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isTimerRunning ? 'Pause Clock' : 'Start Focus Run'}
        </button>
        <button onClick={() => { setIsTimerRunning(false); setTimerSeconds(1500); }} style={{ padding: '0.7rem 1.5rem', border: 'none', background: '#1c1f26', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Reset</button>
      </div>
    </div>
  );
}