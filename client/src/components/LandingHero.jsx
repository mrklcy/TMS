import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';

export const LandingHero = ({ onExplore }) => {
  const { isAuthenticated, openAuthModal, demoLogin } = useAuth();

  const handleDemoClick = async () => {
    if (isAuthenticated) {
      onExplore();
    } else {
      await demoLogin();
      onExplore();
    }
  };

  return (
    <section style={{
      padding: '3rem 1.25rem 3rem 1.25rem',
      textAlign: 'center',
      background: '#f4f6f8',
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Badge Pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        background: '#ede9fe',
        border: '1px solid #ddd6fe',
        color: '#6d28d9',
        fontSize: '0.85rem',
        fontWeight: '700',
        marginBottom: '1.5rem'
      }}>
        <Sparkles size={16} /> Next-Gen Workspace & Security Platform
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
        fontWeight: '800',
        lineHeight: 1.15,
        marginBottom: '1.25rem',
        maxWidth: '850px',
        margin: '0 auto 1.25rem auto',
        color: '#0f172a'
      }}>
        Organize work, boost focus, and <br />
        <span style={{
          background: 'linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          finish tasks effortlessly.
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.1rem',
        color: '#64748b',
        maxWidth: '640px',
        margin: '0 auto 2.25rem auto',
        lineHeight: 1.6
      }}>
        TaskFlow Pro combines intuitive Kanban boards, priority tagging, subtask checklists, and real-time MongoDB analytics into a sleek, lightning-fast workspace.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
        <button
          onClick={isAuthenticated ? onExplore : () => openAuthModal('register')}
          style={{
            padding: '0.8rem 1.8rem',
            fontSize: '1rem',
            fontWeight: '700',
            borderRadius: '12px',
            background: '#6d28d9',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(109, 40, 217, 0.3)'
          }}
        >
          {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'} <ArrowRight size={18} />
        </button>

        <button
          onClick={handleDemoClick}
          style={{
            padding: '0.8rem 1.8rem',
            fontSize: '1rem',
            fontWeight: '700',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#334155',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          View Live Demo
        </button>
      </div>

      {/* Interactive Mock Preview Card */}
      <div style={{
        maxWidth: '920px',
        margin: '0 auto',
        padding: '1.5rem',
        textAlign: 'left',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ marginLeft: '0.5rem', fontSize: '0.825rem', color: '#64748b', fontWeight: '600' }}>
              TaskFlow Pro Workspace — Sprint Overview
            </span>
          </div>

          <div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              background: '#ede9fe',
              color: '#6d28d9',
              padding: '0.2rem 0.6rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Zap size={12} /> Live Preview
            </span>
          </div>
        </div>

        {/* Floating preview columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {/* Column 1 */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: '800', color: '#0284c7' }}>📌 TO DO (2)</span>
            </div>
            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', borderLeft: '4px solid #0284c7', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#dc2626', background: '#fee2e2', padding: '0.1rem 0.4rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.35rem' }}>High Priority</span>
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a' }}>Deploy Node.js microservice</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>DueDate: Tomorrow</div>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: '800', color: '#d97706' }}>⚡ IN PROGRESS (1)</span>
            </div>
            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', borderLeft: '4px solid #d97706', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6d28d9', background: '#ede9fe', padding: '0.1rem 0.4rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.35rem' }}>Active</span>
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a' }}>Security Access Audit</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>Progress: 80%</div>
            </div>
          </div>

          {/* Column 3 */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: '800', color: '#16a34a' }}>✅ COMPLETED (10)</span>
            </div>
            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', borderLeft: '4px solid #16a34a', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#16a34a', background: '#dcfce7', padding: '0.1rem 0.4rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.35rem' }}>Done</span>
              <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a' }}>MongoDB Connection Engine</div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.3rem' }}>Completed Today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
