import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, Sparkles, Sun, Moon, LogIn } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, isAuthenticated, logout, openAuthModal, isDarkMode, toggleDarkMode } = useAuth();

  return (
    <nav style={{
      background: 'rgba(9, 13, 22, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '0.5rem'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab(isAuthenticated ? 'dashboard' : 'landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(109, 40, 217, 0.3)',
            flexShrink: 0
          }}>
            <CheckSquare size={18} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              TaskFlow<span style={{ color: '#a78bfa' }}>Pro</span>
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => toggleDarkMode()}
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('login')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                background: '#6d28d9',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.825rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 10px rgba(109, 40, 217, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              <LogIn size={14} /> Log In
            </button>
          )}

          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => logout()}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
