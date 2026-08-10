import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Rocket, ArrowRight } from 'lucide-react';

export const LandingCTA = ({ onExplore }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <section style={{ padding: '3rem 0 5rem 0' }}>
      <div className="glass-panel" style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Rocket size={28} color="#fff" />
        </div>
        <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
          Ready to supercharge your task management?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Join thousands of developers and teams organizing their projects with TaskFlow Pro.
        </p>

        <button
          onClick={isAuthenticated ? onExplore : () => openAuthModal('register')}
          className="btn btn-primary"
          style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }}
        >
          {isAuthenticated ? 'Go to Workspace' : 'Create Free Account'} <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};
