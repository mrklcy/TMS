import React from 'react';
import { UserCheck, PlusCircle, Kanban, TrendingUp, ArrowRight } from 'lucide-react';

export const LandingWorkflow = () => {
  const steps = [
    {
      step: '01',
      icon: <UserCheck size={26} color="#818cf8" />,
      title: 'Create Your Account',
      description: 'Sign up in seconds to unlock your secure personal workspace.'
    },
    {
      step: '02',
      icon: <PlusCircle size={26} color="#38bdf8" />,
      title: 'Add Tasks & Subtasks',
      description: 'Create tasks with priority levels, category tags, due dates, and checklist items.'
    },
    {
      step: '03',
      icon: <Kanban size={26} color="#f472b6" />,
      title: 'Organize on Kanban Board',
      description: 'Drag and move tasks across To Do, In Progress, and Completed columns.'
    },
    {
      step: '04',
      icon: <TrendingUp size={26} color="#34d399" />,
      title: 'Achieve & Track Growth',
      description: 'Monitor overall completion rates and celebrate completed goals.'
    }
  ];

  return (
    <section style={{ padding: '4rem 0 5rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
          How <span className="gradient-text">TaskFlow Pro Works</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          A simple 4-step workflow designed to transform your daily task organization.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        position: 'relative'
      }}>
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '1.75rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', opacity: 0.25, color: 'var(--text-muted)' }}>
                  {item.step}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '600' }}>
                <span>Next Step</span> <ArrowRight size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
