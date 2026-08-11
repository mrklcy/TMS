import React from 'react';
import { useTask } from '../context/TaskContext';
import { CheckCircle2, Circle, Edit3, Trash2, Calendar, Tag, AlertTriangle } from 'lucide-react';

export const TaskList = () => {
  const { tasks, updateTaskStatus, requestDeleteTask, openEditTaskModal } = useTask();

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return <span className="badge badge-urgent">Urgent</span>;
      case 'high': return <span className="badge badge-high">High</span>;
      case 'medium': return <span className="badge badge-medium">Medium</span>;
      default: return <span className="badge badge-low">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span style={{ color: '#34d399', fontWeight: '700', fontSize: '0.8rem' }}>● Completed</span>;
      case 'in-progress': return <span style={{ color: '#facc15', fontWeight: '700', fontSize: '0.8rem' }}>● In Progress</span>;
      default: return <span style={{ color: '#60a5fa', fontWeight: '700', fontSize: '0.8rem' }}>● To Do</span>;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No tasks matched your criteria.
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '1rem 1.25rem' }}>Status</th>
            <th style={{ padding: '1rem 1.25rem' }}>Task Details</th>
            <th style={{ padding: '1rem 1.25rem' }}>Category</th>
            <th style={{ padding: '1rem 1.25rem' }}>Priority</th>
            <th style={{ padding: '1rem 1.25rem' }}>Due Date</th>
            <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const taskId = task.id || task._id;
            const isDone = task.status === 'completed';

            return (
              <tr
                key={taskId}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {/* Status toggle & label */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button
                      onClick={() => updateTaskStatus(taskId, isDone ? 'todo' : 'completed')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Toggle completed"
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} color="var(--accent-success)" />
                      ) : (
                        <Circle size={20} color="var(--text-dim)" />
                      )}
                    </button>
                    {getStatusBadge(task.status)}
                  </div>
                </td>

                {/* Title & Description */}
                <td style={{ padding: '1rem 1.25rem', maxWidth: '350px' }}>
                  <div style={{
                    fontWeight: '600',
                    color: isDone ? 'var(--text-muted)' : '#ffffff',
                    textDecoration: isDone ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.description}
                    </div>
                  )}
                </td>

                {/* Category */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span className="category-tag">{task.category || 'General'}</span>
                </td>

                {/* Priority */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  {getPriorityBadge(task.priority)}
                </td>

                {/* Due Date */}
                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => openEditTaskModal(task)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.6rem' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => requestDeleteTask(task)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.3rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
