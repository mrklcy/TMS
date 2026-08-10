import React from 'react';
import { useTask } from '../context/TaskContext';
import { Bell, AlertTriangle, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const NotificationsView = () => {
  const { allTasks, updateTaskStatus } = useTask();

  const now = new Date();

  // Urgent pending tasks
  const urgentTasks = allTasks.filter(t => t.priority === 'urgent' && t.status !== 'completed');

  // Overdue tasks
  const overdueTasks = allTasks.filter(t =>
    t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now
  );

  // Due today
  const today = now.toISOString().split('T')[0];
  const dueTodayTasks = allTasks.filter(t =>
    t.status !== 'completed' && t.dueDate && t.dueDate.split('T')[0] === today
  );

  // Due tomorrow
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
  const dueTomorrowTasks = allTasks.filter(t =>
    t.status !== 'completed' && t.dueDate && t.dueDate.split('T')[0] === tomorrow
  );

  const notifications = [
    ...urgentTasks.map(t => ({
      id: `urgent-${t._id || t.id}`,
      task: t,
      type: 'urgent',
      icon: <AlertTriangle size={16} color="#f87171" />,
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.3)',
      label: '🔴 URGENT',
      message: t.title
    })),
    ...overdueTasks.map(t => ({
      id: `overdue-${t._id || t.id}`,
      task: t,
      type: 'overdue',
      icon: <Clock size={16} color="#fb923c" />,
      bg: 'rgba(251, 146, 60, 0.12)',
      border: 'rgba(251, 146, 60, 0.3)',
      label: '⏰ OVERDUE',
      message: t.title
    })),
    ...dueTodayTasks.map(t => ({
      id: `today-${t._id || t.id}`,
      task: t,
      type: 'today',
      icon: <Calendar size={16} color="#fbbf24" />,
      bg: 'rgba(251, 191, 36, 0.12)',
      border: 'rgba(251, 191, 36, 0.3)',
      label: '📅 DUE TODAY',
      message: t.title
    })),
    ...dueTomorrowTasks.map(t => ({
      id: `tomorrow-${t._id || t.id}`,
      task: t,
      type: 'tomorrow',
      icon: <Calendar size={16} color="#38bdf8" />,
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.3)',
      label: '📋 DUE TOMORROW',
      message: t.title
    }))
  ];

  // Deduplicate by task id (a task could be both urgent and overdue)
  const seen = new Set();
  const uniqueNotifications = notifications.filter(n => {
    const taskId = n.task._id || n.task.id;
    const key = `${n.type}-${taskId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Notifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tasks that need your attention right now.
          </p>
        </div>
        {uniqueNotifications.length > 0 && (
          <span className="badge badge-urgent">{uniqueNotifications.length} alerts</span>
        )}
      </div>

      {uniqueNotifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <CheckCircle2 size={52} color="#34d399" style={{ marginBottom: '1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem' }}>All Clear!</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No urgent or overdue tasks. You're on track! 🎉</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {uniqueNotifications.map(notif => {
            const taskId = notif.task._id || notif.task.id;
            return (
              <div
                key={notif.id}
                className="glass-panel"
                style={{
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderLeft: `3px solid ${notif.border}`,
                  background: notif.bg
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: notif.bg,
                  border: `1px solid ${notif.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {notif.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    letterSpacing: '0.06em',
                    color: 'var(--text-dim)'
                  }}>
                    {notif.label}
                  </span>
                  <p style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginTop: '0.1rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {notif.message}
                  </p>
                  {notif.task.dueDate && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Due: {new Date(notif.task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => updateTaskStatus(taskId, 'completed')}
                  className="btn btn-sm"
                  style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', flexShrink: 0 }}
                >
                  <CheckCircle2 size={14} /> Done
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
