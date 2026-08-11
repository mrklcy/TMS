import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, X, AlertCircle } from 'lucide-react';

export const LogoutConfirmModal = () => {
  const { isLogoutConfirmOpen, confirmLogout, cancelLogout } = useAuth();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="modal-overlay" onClick={cancelLogout}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-warning)' }}>
            <LogOut size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
              Confirm Logout
            </h3>
          </div>
          <button
            onClick={cancelLogout}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: '1.5' }}>
            Are you sure you want to log out of your session?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            You will need to sign in again to access your tasks and dashboard workspace.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={cancelLogout}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmLogout}
            className="btn btn-danger"
          >
            <LogOut size={16} /> Confirm Logout
          </button>
        </div>
      </div>
    </div>
  );
};
