import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, X, AlertTriangle } from 'lucide-react';

export const LogoutConfirmModal = () => {
  const { isLogoutConfirmOpen, confirmLogout, cancelLogout } = useAuth();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={cancelLogout}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '1.75rem',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogOut size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#0f172a', lineHeight: 1.1 }}>
                Confirm Sign Out
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Account Session Termination</span>
            </div>
          </div>
          <button
            onClick={cancelLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem', lineHeight: '1.4' }}>
            Are you sure you want to log out of your session?
          </p>
          <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
            You will need to sign in again to access your tasks and workspace.
          </p>
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={confirmLogout}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: '#dc2626',
              border: 'none',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
            }}
          >
            <LogOut size={16} /> Confirm Sign Out
          </button>

          <button
            type="button"
            onClick={cancelLogout}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: '12px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
