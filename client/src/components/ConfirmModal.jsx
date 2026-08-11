import React from 'react';
import { useTask } from '../context/TaskContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const ConfirmModal = () => {
  const { confirmDeleteModalOpen, taskToDelete, confirmDeleteTask, cancelDeleteTask } = useTask();

  if (!confirmDeleteModalOpen || !taskToDelete) return null;

  return (
    <div className="modal-overlay" onClick={cancelDeleteTask}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f87171' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#f87171' }}>
              Confirm Deletion
            </h3>
          </div>
          <button
            onClick={cancelDeleteTask}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
            Are you sure you want to delete this task?
          </p>
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid #f87171',
            fontWeight: '600',
            fontSize: '0.9rem',
            color: '#ffffff',
            wordBreak: 'break-word'
          }}>
            "{taskToDelete.title}"
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
            This security confirmation prevents accidental loss of data. This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={cancelDeleteTask}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDeleteTask}
            className="btn btn-danger"
          >
            <Trash2 size={16} /> Yes, Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
