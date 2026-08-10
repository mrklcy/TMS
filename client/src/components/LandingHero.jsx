import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';

export const LandingHero = ({ onExplore }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <section style={{ padding: '4rem 0 3rem 0', textAlign: 'center' }}>
      {/* Main Title */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
        fontWeight: '800',
        lineHeight: 1.15,
        marginBottom: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto 1.5rem auto'
      }}>
        Organize work, boost focus, and <br />
        <span className="gradient-text">finish tasks effortlessly.</span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.15rem',
        color: 'var(--text-muted)',
        maxWidth: '650px',
        margin: '0 auto 2.5rem auto',
        lineHeight: 1.6
      }}>
        TaskFlow Pro combines intuitive Kanban boards, priority tagging, subtask checklists, and real-time MongoDB analytics into a sleek, lightning-fast workspace.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
        <button
          onClick={isAuthenticated ? onExplore : () => openAuthModal('register')}
          className="btn btn-primary"
          style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }}
        >
          {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'} <ArrowRight size={18} />
        </button>

        <button
          onClick={onExplore}
          className="btn btn-secondary"
          style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }}
        >
          View Live Demo
        </button>
      </div>

      {/* Interactive Mock Preview Card */}
      <div className="glass-panel" style={{
        maxWidth: '950px',
        margin: '0 auto',
        padding: '1.75rem',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              TaskFlow Pro Workspace — Sprint Overview
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-medium"><Zap size={12} /> Live Preview</span>
          </div>
        </div>

        {/* Floating preview columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {/* Column 1 */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#93c5fd' }}>📌 TO DO (2)</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', borderLeft: '3px solid #3b82f6' }}>
              <span className="badge badge-high" style={{ marginBottom: '0.4rem' }}>High</span>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Deploy Node.js microservice</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>DueDate: Tomorrow</div>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fde047' }}>⚙️ IN PROGRESS (1)</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #f59e0b' }}>
              <span className="badge badge-urgent" style={{ marginBottom: '0.4rem' }}>Urgent</span>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Build MongoDB Indexing Strategy</div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={12} /> 2 of 3 Subtasks Complete
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6ee7b7' }}>✅ COMPLETED (3)</span>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', opacity: 0.85, borderLeft: '3px solid #10b981' }}>
              <span className="badge badge-low" style={{ marginBottom: '0.4rem' }}>Done</span>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', textDecoration: 'line-through' }}>Design Auth JWT Architecture</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
