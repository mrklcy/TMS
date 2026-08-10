import React from 'react';
import { useTask } from '../context/TaskContext';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

export const DashboardStats = () => {
  const { stats } = useTask();

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <Layers size={22} color="#818cf8" />,
      bg: 'rgba(99, 102, 241, 0.1)'
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: <Clock size={22} color="#38bdf8" />,
      bg: 'rgba(56, 189, 248, 0.1)'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <TrendingUp size={22} color="#fbbf24" />,
      bg: 'rgba(251, 191, 36, 0.1)'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircle2 size={22} color="#34d399" />,
      bg: 'rgba(52, 211, 153, 0.1)'
    },
    {
      title: 'Urgent Pending',
      value: stats.urgent,
      icon: <AlertTriangle size={22} color="#f87171" />,
      bg: 'rgba(248, 113, 113, 0.1)'
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.2rem' }}>
                {card.value}
              </h3>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar Banner */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '200px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Overall Completion</span>
          <span className="badge badge-low">{stats.completionRate}%</span>
        </div>
        <div style={{ flex: 1, minWidth: '200px', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${stats.completionRate}%`,
              background: 'var(--gradient-primary)',
              transition: 'width 0.5s ease',
              borderRadius: '5px'
            }}
          />
        </div>
      </div>
    </div>
  );
};
