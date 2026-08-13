import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Rocket, ArrowRight } from 'lucide-react';

export const LandingCTA = ({ onExplore }) => {
  const { isAuthenticated, demoLogin } = useAuth();

  const handleClick = async () => {
    if (isAuthenticated) {
      onExplore();
    } else {
      await demoLogin();
      onExplore();
    }
  };

  return (
    <section style={{
      padding: '4rem 1.25rem 5rem 1.25rem',
      background: '#ffffff',
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%)',
        borderRadius: '24px',
        border: '1px solid #ddd6fe',
        boxShadow: '0 10px 30px rgba(109, 40, 217, 0.08)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#6d28d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          boxShadow: '0 4px 14px rgba(109, 40, 217, 0.3)'
        }}>
          <Rocket size={26} color="#ffffff" />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.85rem' }}>
          Ready to supercharge your task management?
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          Join thousands of developers and teams organizing their projects with TaskFlow Pro.
        </p>

        <button
          onClick={handleClick}
          style={{
            padding: '0.85rem 2.2rem',
            fontSize: '1rem',
            fontWeight: '700',
            borderRadius: '12px',
            background: '#6d28d9',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(109, 40, 217, 0.3)'
          }}
        >
          {isAuthenticated ? 'Go to Workspace' : 'Create Free Account'} <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};
