import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Target,
  Flame,
  Award
} from 'lucide-react';

export const FocusTimerView = () => {
  const { tasks } = useTask();
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || tasks[0]?._id || '');
  const [mode, setMode] = useState('work'); // 'work' (25m) | 'short' (5m) | 'long' (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedSessions(prev => prev + 1);
        setTotalFocusMinutes(prev => prev + 25);
        alert('🎉 Deep Work Session Completed! Take a 5-minute break.');
      } else {
        alert('🔔 Break session finished! Ready to focus again?');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'work') setTimeLeft(25 * 60);
    if (newMode === 'short') setTimeLeft(5 * 60);
    if (newMode === 'long') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedTask = tasks.find(t => (t.id || t._id) === selectedTaskId);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Timer color="var(--accent-primary)" size={28} /> Pomodoro & Deep Work Focus Timer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Eliminate distractions, focus on a single task, and log completed work sessions.
        </p>
      </div>

      {/* Metrics Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.1rem',
        marginBottom: '1.75rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>SESSIONS COMPLETED</span>
            <Award size={18} color="var(--accent-success)" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>{completedSessions} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>pomodoros</span></p>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>TOTAL DEEP WORK</span>
            <Flame size={18} color="#f59e0b" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>{totalFocusMinutes} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>mins</span></p>
        </div>
      </div>

      {/* Main Timer Display Panel */}
      <div className="glass-panel" style={{
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '1.75rem'
      }}>
        {/* Mode Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          marginBottom: '2rem',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'work', label: 'Deep Work (25m)' },
            { id: 'short', label: 'Short Break (5m)' },
            { id: 'long', label: 'Long Break (15m)' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => switchMode(item.id)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '700',
                cursor: 'pointer',
                background: mode === item.id ? 'var(--accent-primary)' : 'transparent',
                color: mode === item.id ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Big Circular Digital Timer */}
        <div style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '4px solid var(--border-glow)',
          boxShadow: isRunning ? '0 0 50px rgba(99, 102, 241, 0.45)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          background: 'rgba(15, 23, 42, 0.6)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontSize: '3.6rem', fontWeight: '800', letterSpacing: '-0.04em', fontFamily: 'monospace' }}>
            {formatTime(timeLeft)}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isRunning ? 'var(--accent-success)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
            {isRunning ? '⚡ Session Active' : 'Paused'}
          </span>
        </div>

        {/* Action Controls (Play/Pause & Reset) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn btn-primary"
            style={{
              padding: '0.9rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '800',
              borderRadius: 'var(--radius-lg)',
              gap: '0.6rem'
            }}
          >
            {isRunning ? <><Pause size={22} /> Pause</> : <><Play size={22} /> Start Session</>}
          </button>

          <button
            onClick={() => { setIsRunning(false); switchMode(mode); }}
            className="btn btn-secondary"
            style={{ padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-lg)' }}
            title="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Selected Task Target Dropdown */}
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Target size={15} color="var(--accent-primary)" /> Target Task for this Session
          </label>
          <select
            className="form-select"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            {tasks.map(t => (
              <option key={t.id || t._id} value={t.id || t._id}>
                [{t.priority.toUpperCase()}] {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
