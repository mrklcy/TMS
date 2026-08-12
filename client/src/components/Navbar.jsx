import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, Sparkles, Sun, Moon } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, isAuthenticated, logout, openAuthModal, isDarkMode, toggleDarkMode } = useAuth();

  return (
    <nav style={{
      background: 'rgba(9, 13, 22, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '0.5rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab(isAuthenticated ? 'dashboard' : 'landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
            flexShrink: 0
          }}>
            <CheckSquare size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
              TaskFlow<span className="gradient-text">Pro</span>
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          <button
            onClick={() => toggleDarkMode()}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem 0.65rem' }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => setCurrentTab('landing')}
              className={`btn ${currentTab === 'landing' ? 'btn-secondary' : ''}`}
              style={{
                background: currentTab === 'landing' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: currentTab === 'landing' ? '#fff' : 'var(--text-muted)',
                padding: '0.45rem 0.85rem'
              }}
            >
              <Sparkles size={15} /> Home
            </button>
          )}

          {/* User Auth state buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.7rem',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  padding: '2px',
                  background: 'var(--gradient-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                    alt={user?.name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1e293b' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap' }}>
                    {user?.name}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                title="Logout"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary btn-sm"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="btn btn-primary btn-sm"
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
