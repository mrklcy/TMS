import React from 'react';
import { useTask } from '../context/TaskContext';
import { CheckCircle2, Clock, Calendar, Edit3, Trash2, ChevronRight, ChevronLeft, Plus, CheckSquare } from 'lucide-react';

export const KanbanBoard = () => {
  const { tasks, updateTaskStatus, toggleSubtask, deleteTask, openEditTaskModal, openCreateTaskModal } = useTask();

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: '#60a5fa',
      borderTop: '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      items: tasks.filter(t => t.status === 'todo')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#facc15',
      borderTop: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      items: tasks.filter(t => t.status === 'in-progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      color: '#4ade80',
      borderTop: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      items: tasks.filter(t => t.status === 'completed')
    }
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return <span className="badge badge-urgent">Urgent 🔥</span>;
      case 'high': return <span className="badge badge-high">High</span>;
      case 'medium': return <span className="badge badge-medium">Medium</span>;
      default: return <span className="badge badge-low">Low</span>;
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.5rem',
      alignItems: 'start'
    }}>
      {columns.map(col => (
        <div
          key={col.id}
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderTop: `4px solid ${col.borderTop}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            maxHeight: 'calc(100vh - 280px)',
            minHeight: '450px',
            overflowY: 'auto'
          }}
        >
          {/* Sticky Column Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--border-subtle)',
            position: 'sticky',
            top: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
            paddingTop: '0.2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: col.color }}>{col.title}</span>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '800',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                background: col.badgeBg,
                color: col.color,
                border: `1px solid ${col.color}40`
              }}>
                {col.items.length}
              </span>
            </div>

            <button
              onClick={openCreateTaskModal}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.6rem' }}
              title="Add task to column"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>

          {/* Task Cards Container */}
          {col.items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3.5rem 1rem',
              color: 'var(--text-dim)',
              fontSize: '0.875rem',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              margin: 'auto 0'
            }}>
              No tasks in {col.title}
            </div>
          ) : (
            col.items.map(task => {
              const taskId = task.id || task._id;
              const subtasks = task.subtasks || [];
              const completedSubtasks = subtasks.filter(st => st.completed).length;
              const subtaskPercent = subtasks.length ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

              return (
                <div
                  key={taskId}
                  className="task-card-item animate-fade-in"
                >
                  {/* Badges & Category */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    {getPriorityBadge(task.priority)}
                    <span className="category-tag">{task.category || 'Work'}</span>
                  </div>

                  {/* Title & Description */}
                  <h4 style={{
                    fontSize: '1.02rem',
                    fontWeight: '700',
                    marginBottom: '0.45rem',
                    lineHeight: '1.35',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'var(--text-muted)' : '#ffffff'
                  }}>
                    {task.title}
                  </h4>

                  {task.description && (
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.85rem',
                      lineHeight: '1.45',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {task.description}
                    </p>
                  )}

                  {/* Subtasks Progress */}
                  {subtasks.length > 0 && (
                    <div style={{ marginBottom: '0.85rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: '600' }}>
                        <span>Subtasks Progress</span>
                        <span>{completedSubtasks}/{subtasks.length} ({subtaskPercent}%)</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div style={{ height: '100%', width: `${subtaskPercent}%`, background: 'var(--gradient-primary)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                      </div>

                      {/* Subtask Check Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {subtasks.map((st, idx) => {
                          const stId = st.id || st._id || idx;
                          return (
                            <div
                              key={stId}
                              onClick={() => toggleSubtask(taskId, stId)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                color: st.completed ? 'var(--text-dim)' : 'var(--text-main)',
                                textDecoration: st.completed ? 'line-through' : 'none'
                              }}
                            >
                              <div style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-subtle)',
                                background: st.completed ? 'var(--accent-success)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {st.completed && <CheckSquare size={11} color="#fff" />}
                              </div>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Due Date & Footer Controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                      <Calendar size={13} color="var(--accent-secondary)" />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}</span>
                    </div>

                    {/* Quick Move Status Buttons & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      {col.id !== 'todo' && (
                        <button
                          onClick={() => updateTaskStatus(taskId, col.id === 'completed' ? 'in-progress' : 'todo')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', background: 'rgba(99, 102, 241, 0.12)' }}
                          title="Move to left column"
                        >
                          <ChevronLeft size={14} color="#818cf8" />
                        </button>
                      )}

                      {col.id !== 'completed' && (
                        <button
                          onClick={() => updateTaskStatus(taskId, col.id === 'todo' ? 'in-progress' : 'completed')}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', background: 'rgba(99, 102, 241, 0.12)' }}
                          title="Move to right column"
                        >
                          <ChevronRight size={14} color="#818cf8" />
                        </button>
                      )}

                      <button
                        onClick={() => openEditTaskModal(task)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                        title="Edit task"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => deleteTask(taskId)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', color: '#f87171', cursor: 'pointer', padding: '4px', display: 'flex' }}
                        title="Delete task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ))}
    </div>
  );
};
