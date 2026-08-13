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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={closeAuthModal}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '1.75rem',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: 'border-box'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => { setAuthModalMode('login'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '800',
                color: authModalMode === 'login' ? '#6d28d9' : '#94a3b8',
                borderBottom: authModalMode === 'login' ? '3px solid #6d28d9' : '3px solid transparent',
                paddingBottom: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
                fontWeight: '800',
                color: authModalMode === 'register' ? '#6d28d9' : '#94a3b8',
                borderBottom: authModalMode === 'register' ? '3px solid #6d28d9' : '3px solid transparent',
                paddingBottom: '0.4rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={closeAuthModal}
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              fontSize: '0.825rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Mark Lester"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                placeholder="lester@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: '#6d28d9',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(109, 40, 217, 0.3)',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? (
              'Processing...'
            ) : authModalMode === 'login' ? (
              <> <LogIn size={18} /> Sign In to Workspace </>
            ) : (
              <> <UserPlus size={18} /> Register Account </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
