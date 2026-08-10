import React from 'react';
import { useTask } from '../context/TaskContext';
import { Clock, CheckCircle2, PlusCircle, Edit3, Trash2, ArrowRight } from 'lucide-react';

export const RecentActivityView = () => {
  const { allTasks } = useTask();

  // Build activity feed from task data
  const activities = allTasks
    .map(task => {
      const taskId = task._id || task.id;
      const items = [];

      // Task creation
      if (task.createdAt) {
        items.push({
          id: `${taskId}-created`,
          type: 'created',
          title: task.title,
          timestamp: new Date(task.createdAt),
          icon: <PlusCircle size={16} color="#818cf8" />,
          color: 'rgba(99, 102, 241, 0.15)',
          label: 'Task Created'
        });
      }

      // Task completion
      if (task.status === 'completed' && task.updatedAt) {
        items.push({
          id: `${taskId}-completed`,
          type: 'completed',
          title: task.title,
          timestamp: new Date(task.updatedAt),
          icon: <CheckCircle2 size={16} color="#34d399" />,
          color: 'rgba(16, 185, 129, 0.15)',
          label: 'Task Completed'
        });
      }

      // Task in progress
      if (task.status === 'in-progress' && task.updatedAt) {
        items.push({
          id: `${taskId}-progress`,
          type: 'progress',
          title: task.title,
          timestamp: new Date(task.updatedAt),
          icon: <ArrowRight size={16} color="#fbbf24" />,
          color: 'rgba(251, 191, 36, 0.15)',
          label: 'Moved to In Progress'
        });
      }

      return items;
    })
    .flat()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 25);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Recent Activity</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Track all recent changes and updates to your tasks.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
            <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', fontWeight: '600' }}>No recent activity</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Start creating tasks to see your activity feed here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activities.map((activity, idx) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: idx < activities.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}
              >
                {/* Timeline icon */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: activity.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {activity.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {activity.label}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginTop: '0.2rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {activity.title}
                  </p>
                </div>

                {/* Timestamp */}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', flexShrink: 0, marginTop: '0.15rem' }}>
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
