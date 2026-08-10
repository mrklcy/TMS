import React from 'react';
import { useTask } from '../context/TaskContext';
import { BarChart3, TrendingUp, Target, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AnalyticsView = () => {
  const { allTasks, stats } = useTask();

  // Category breakdown
  const categories = {};
  allTasks.forEach(t => {
    const cat = t.category || 'General';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  // Priority breakdown
  const priorities = { urgent: 0, high: 0, medium: 0, low: 0 };
  allTasks.forEach(t => {
    const p = t.priority || 'low';
    if (priorities[p] !== undefined) priorities[p]++;
  });

  // Tasks completed this week
  const now = new Date();
  const weekAgo = new Date(now - 7 * 86400000);
  const completedThisWeek = allTasks.filter(t =>
    t.status === 'completed' && new Date(t.updatedAt || t.createdAt) >= weekAgo
  ).length;

  // Tasks due soon (next 3 days)
  const threeDaysAhead = new Date(now.getTime() + 3 * 86400000);
  const dueSoon = allTasks.filter(t =>
    t.status !== 'completed' && t.dueDate && new Date(t.dueDate) <= threeDaysAhead && new Date(t.dueDate) >= now
  ).length;

  // Overdue
  const overdue = allTasks.filter(t =>
    t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now
  ).length;

  const priorityColors = {
    urgent: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.4)' },
    high: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
    medium: { bg: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', border: 'rgba(6, 182, 212, 0.4)' },
    low: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.4)' }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Analytics & Insights</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Track your productivity trends and task distribution.
        </p>
      </div>

      {/* Key Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completion Rate</span>
            <TrendingUp size={18} color="#34d399" />
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{stats.completionRate}%</h2>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '0.75rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${stats.completionRate}%`, background: 'var(--gradient-primary)', borderRadius: '3px', transition: 'width 0.5s' }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed This Week</span>
            <ArrowUpRight size={18} color="#34d399" />
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{completedThisWeek}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>out of {stats.total} total tasks</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Soon</span>
            <Target size={18} color="#fbbf24" />
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: dueSoon > 0 ? '#fbbf24' : '#fff' }}>{dueSoon}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>within next 3 days</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overdue</span>
            <ArrowDownRight size={18} color="#f87171" />
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: overdue > 0 ? '#f87171' : '#fff' }}>{overdue}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>need attention</p>
        </div>
      </div>

      {/* Priority Distribution + Category Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Priority Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--accent-primary)" /> Priority Distribution
          </h3>
          {Object.entries(priorities).map(([key, count]) => {
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const colors = priorityColors[key];
            return (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'capitalize', color: colors.color }}>{key}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{count} tasks ({pct}%)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: colors.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s',
                    boxShadow: `0 0 8px ${colors.border}`
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} color="var(--accent-secondary)" /> Category Breakdown
          </h3>
          {Object.entries(categories).length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No tasks yet.</p>
          ) : (
            Object.entries(categories).map(([cat, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{cat}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} tasks</span>
                    <span className="badge badge-medium">{pct}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Task Status Overview</h3>
        <div style={{ display: 'flex', gap: '0', height: '14px', borderRadius: '7px', overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
          {stats.completed > 0 && (
            <div style={{ width: `${(stats.completed / stats.total) * 100}%`, background: '#34d399', transition: 'width 0.5s' }}
              title={`Completed: ${stats.completed}`} />
          )}
          {stats.inProgress > 0 && (
            <div style={{ width: `${(stats.inProgress / stats.total) * 100}%`, background: '#fbbf24', transition: 'width 0.5s' }}
              title={`In Progress: ${stats.inProgress}`} />
          )}
          {stats.todo > 0 && (
            <div style={{ width: `${(stats.todo / stats.total) * 100}%`, background: '#60a5fa', transition: 'width 0.5s' }}
              title={`To Do: ${stats.todo}`} />
          )}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399' }} /> Completed ({stats.completed})
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} /> In Progress ({stats.inProgress})
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#60a5fa' }} /> To Do ({stats.todo})
          </span>
        </div>
      </div>
    </div>
  );
};
