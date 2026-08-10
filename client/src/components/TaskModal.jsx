import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { X, Plus, Trash2, CheckSquare, Layers, FileText, Zap } from 'lucide-react';

export const TaskModal = () => {
  const { isTaskModalOpen, editingTask, closeTaskModal, createTask, bulkCreateTasks, updateTask } = useTask();

  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'bulk'

  // Single task state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Bulk import state
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Work');
  const [bulkPriority, setBulkPriority] = useState('medium');

  useEffect(() => {
    if (editingTask) {
      setActiveTab('single');
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setStatus(editingTask.status || 'todo');
      setPriority(editingTask.priority || 'medium');
      setCategory(editingTask.category || 'Work');
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '');
      setSubtasks(editingTask.subtasks ? [...editingTask.subtasks] : []);
    } else {
      setActiveTab('single');
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setCategory('Work');
      setDueDate('');
      setSubtasks([]);
      setBulkText('');
    }
  }, [editingTask, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'st_' + Date.now(), title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(s => (s.id !== id && s._id !== id)));
  };

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskPayload = {
      title,
      description,
      status,
      priority,
      category,
      dueDate: dueDate || null,
      subtasks
    };

    if (editingTask) {
      const taskId = editingTask.id || editingTask._id;
      updateTask(taskId, taskPayload);
    } else {
      createTask(taskPayload);
    }
  };

  // Parse bulk text lines
  const parsedBulkTasks = bulkText
    .split('\n')
    .map(line => line.replace(/^[\s\-\*\•\d\.\)]+/, '').trim()) // remove bullet points like "- ", "* ", "1. "
    .filter(line => line.length > 0)
    .map(title => ({
      title,
      description: '',
      status: 'todo',
      priority: bulkPriority,
      category: bulkCategory,
      dueDate: null,
      subtasks: []
    }));

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (parsedBulkTasks.length === 0) return;
    bulkCreateTasks(parsedBulkTasks);
  };

  return (
    <div className="modal-overlay" onClick={closeTaskModal}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        {/* Header Tabs */}
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {editingTask ? (
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Edit Task</h3>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('single')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: activeTab === 'single' ? '#ffffff' : 'var(--text-muted)',
                    borderBottom: activeTab === 'single' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    paddingBottom: '0.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <FileText size={16} /> Single Task
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('bulk')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: activeTab === 'bulk' ? '#ffffff' : 'var(--text-muted)',
                    borderBottom: activeTab === 'bulk' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    paddingBottom: '0.4rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Zap size={16} color="#fbbf24" /> Paste Multi-Tasks
                </button>
              </>
            )}
          </div>

          <button onClick={closeTaskModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'single' ? (
            /* Single Task Form */
            <form onSubmit={handleSingleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Complete quarterly budget analysis"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Add details, notes, or instructions..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Ideas">Ideas</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>

              {/* Subtasks Section */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <label className="form-label">Subtask Checklist</label>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add subtask item..."
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(e); } }}
                  />
                  <button type="button" onClick={handleAddSubtask} className="btn btn-secondary">
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {subtasks.map((st, idx) => (
                    <div
                      key={st.id || st._id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckSquare size={16} color="var(--accent-secondary)" />
                        <span>{st.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id || st._id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="button" onClick={closeTaskModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          ) : (
            /* Bulk Import Mode */
            <form onSubmit={handleBulkSubmit}>
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#c7d2fe',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <Zap size={20} color="#fbbf24" />
                <span>
                  Paste your task list below (one task per line). The system will automatically parse and create all tasks instantly!
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Paste Tasks List (One per line)</label>
                <textarea
                  className="form-textarea"
                  rows={7}
                  placeholder={`Finish project report\nBuy groceries for the week\nSchedule team retrospective\nReview pull requests`}
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Default Category</label>
                  <select className="form-select" value={bulkCategory} onChange={e => setBulkCategory(e.target.value)}>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Ideas">Ideas</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Project">Project</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Priority</label>
                  <select className="form-select" value={bulkPriority} onChange={e => setBulkPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent 🔥</option>
                  </select>
                </div>
              </div>

              {parsedBulkTasks.length > 0 && (
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-success)', marginBottom: '1rem' }}>
                  ✓ {parsedBulkTasks.length} task(s) detected and ready to import.
                </div>
              )}

              <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none' }}>
                <button type="button" onClick={closeTaskModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={parsedBulkTasks.length === 0}
                >
                  <Zap size={18} /> Auto-Create {parsedBulkTasks.length || ''} Tasks
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
