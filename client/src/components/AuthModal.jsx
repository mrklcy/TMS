import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. user@example.com)');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long for security');
      return;
    }

    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header Tabs */}
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => { setAuthModalMode('login'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: authModalMode === 'login' ? '#ffffff' : 'var(--text-muted)',
                borderBottom: authModalMode === 'login' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                paddingBottom: '0.4rem',
                cursor: 'pointer'
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalMode('register'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '700',
                color: authModalMode === 'register' ? '#ffffff' : 'var(--text-muted)',
                borderBottom: authModalMode === 'register' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                paddingBottom: '0.4rem',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={closeAuthModal}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {authModalMode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  style={{ paddingLeft: '2.4rem' }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dim)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="name@company.com"
                style={{ paddingLeft: '2.4rem' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-dim)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '2.4rem' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {isSubmitting ? (
              'Processing...'
            ) : authModalMode === 'login' ? (
              <> <LogIn size={18} /> Log In to TaskFlow </>
            ) : (
              <> <UserPlus size={18} /> Register Account </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
