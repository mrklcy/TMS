import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User, Sparkles, LayoutDashboard } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab(isAuthenticated ? 'dashboard' : 'landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <CheckSquare size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
              TaskFlow<span className="gradient-text">Pro</span>
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {!isAuthenticated && (
            <button
              onClick={() => setCurrentTab('landing')}
              className={`btn ${currentTab === 'landing' ? 'btn-secondary' : ''}`}
              style={{
                background: currentTab === 'landing' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: currentTab === 'landing' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Sparkles size={16} /> Home
            </button>
          )}

          {/* User Auth state buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)'
              }}>
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name}</span>
              </div>

              <button
                onClick={logout}
                className="btn btn-danger btn-sm"
                title="Logout"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="btn btn-primary"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
