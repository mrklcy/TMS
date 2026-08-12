import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const STATUS_WEIGHT = {
  'in-progress': 1,
  'todo': 2,
  'completed': 3
};

const PRIORITY_WEIGHT = {
  'urgent': 1,
  'high': 2,
  'medium': 3,
  'low': 4
};

export const TaskList = () => {
  const { tasks, updateTaskStatus, requestDeleteTask, openEditTaskModal } = useTask();
  const [sortField, setSortField] = useState('default');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleHeaderClick = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let result = 0;

    if (sortField === 'status') {
      result = (STATUS_WEIGHT[a.status] || 2) - (STATUS_WEIGHT[b.status] || 2);
    } else if (sortField === 'title') {
      result = a.title.localeCompare(b.title);
    } else if (sortField === 'category') {
      result = (a.category || '').localeCompare(b.category || '');
    } else if (sortField === 'priority') {
      result = (PRIORITY_WEIGHT[a.priority] || 3) - (PRIORITY_WEIGHT[b.priority] || 3);
    } else if (sortField === 'dueDate') {
      const dA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      result = dA - dB;
    } else {
      // DEFAULT SMART SEQUENCE:
      // 1. In Progress first, then To Do, then Completed at the bottom!
      // 2. Urgent > High > Medium > Low
      // 3. Earliest due date
      const statusDiff = (STATUS_WEIGHT[a.status] || 2) - (STATUS_WEIGHT[b.status] || 2);
      if (statusDiff !== 0) return statusDiff;

      const prioDiff = (PRIORITY_WEIGHT[a.priority] || 3) - (PRIORITY_WEIGHT[b.priority] || 3);
      if (prioDiff !== 0) return prioDiff;

      const dA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dA - dB;
    }

    return sortDirection === 'asc' ? result : -result;
  });

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} style={{ opacity: 0.4, marginLeft: '4px' }} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--accent-primary)', marginLeft: '4px' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--accent-primary)', marginLeft: '4px' }} />
    );
  };

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
    <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th
              onClick={() => handleHeaderClick('status')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none' }}
              title="Click to sort by Status (In Progress -> To Do -> Completed)"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Status {renderSortIndicator('status')}
              </div>
            </th>

            <th
              onClick={() => handleHeaderClick('title')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none' }}
              title="Click to sort alphabetically by Task Name"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Task Details {renderSortIndicator('title')}
              </div>
            </th>

            <th
              onClick={() => handleHeaderClick('category')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none' }}
              title="Click to sort by Category"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Category {renderSortIndicator('category')}
              </div>
            </th>

            <th
              onClick={() => handleHeaderClick('priority')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none' }}
              title="Click to sort by Priority (Urgent -> High -> Medium -> Low)"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Priority {renderSortIndicator('priority')}
              </div>
            </th>

            <th
              onClick={() => handleHeaderClick('dueDate')}
              style={{ padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none' }}
              title="Click to sort by Due Date"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Due Date {renderSortIndicator('dueDate')}
              </div>
            </th>

            <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map(task => {
            const taskId = task.id || task._id;
            const isDone = task.status === 'completed';

            return (
              <tr
                key={taskId}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background var(--transition-fast)',
                  background: isDone ? 'rgba(0,0,0,0.12)' : 'transparent'
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
                    textDecoration: isDone ? 'line-through' : 'none',
                    opacity: isDone ? 0.75 : 1
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: isDone ? 0.6 : 0.9 }}>
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
