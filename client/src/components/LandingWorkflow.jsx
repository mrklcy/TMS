import React from 'react';
import { UserCheck, PlusCircle, Kanban, TrendingUp } from 'lucide-react';

export const LandingWorkflow = () => {
  const steps = [
    {
      step: '01',
      icon: <UserCheck size={24} color="#6d28d9" />,
      title: 'Create Your Account',
      description: 'Sign up in seconds to unlock your secure personal workspace.'
    },
    {
      step: '02',
      icon: <PlusCircle size={24} color="#0284c7" />,
      title: 'Add Tasks & Subtasks',
      description: 'Create tasks with priority levels, category tags, due dates, and checklist items.'
    },
    {
      step: '03',
      icon: <Kanban size={24} color="#9333ea" />,
      title: 'Organize on Kanban Board',
      description: 'Drag and move tasks across To Do, In Progress, and Completed columns.'
    },
    {
      step: '04',
      icon: <TrendingUp size={24} color="#16a34a" />,
      title: 'Achieve & Track Growth',
      description: 'Monitor overall completion rates and celebrate completed goals.'
    }
  ];

  return (
    <section style={{
      padding: '4rem 1.25rem',
      background: '#f4f6f8',
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
          How <span style={{ color: '#6d28d9' }}>TaskFlow Pro Works</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
          A simple 4-step workflow designed to transform your daily task organization.
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        {steps.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e2e8f0'
              }}>
                {item.icon}
              </div>

              <span style={{
                fontSize: '1rem',
                fontWeight: '900',
                color: '#6d28d9',
                background: '#ede9fe',
                padding: '0.2rem 0.65rem',
                borderRadius: '10px'
              }}>
                {item.step}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
