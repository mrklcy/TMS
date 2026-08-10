import React from 'react';
import { LayoutGrid, Shield, Tag, CheckSquare, BarChart3, Filter } from 'lucide-react';

export const LandingFeatures = () => {
  const features = [
    {
      icon: <LayoutGrid size={24} color="#818cf8" />,
      title: 'Kanban & List Boards',
      description: 'Organize tasks across To Do, In Progress, and Completed columns. Toggle seamlessly between interactive board and list views.'
    },
    {
      icon: <Shield size={24} color="#38bdf8" />,
      title: 'Secure User Accounts',
      description: 'Keep your personal workspace and task data completely private with protected user login accounts.'
    },
    {
      icon: <Tag size={24} color="#34d399" />,
      title: 'Priority & Category Tagging',
      description: 'Tag tasks into Work, Personal, or Urgent categories, and highlight high-priority items so you never miss a deadline.'
    },
    {
      icon: <CheckSquare size={24} color="#f472b6" />,
      title: 'Subtasks & Checklists',
      description: 'Break complex projects down into bite-sized actionable items with dynamic progress tracking bars.'
    },
    {
      icon: <BarChart3 size={24} color="#fbbf24" />,
      title: 'Real-Time Analytics',
      description: 'Monitor task completion rates, pending urgent items, and overall productivity metrics at a glance.'
    },
    {
      icon: <Filter size={24} color="#a78bfa" />,
      title: 'Smart Search & Filters',
      description: 'Instantly query tasks by keyword, filter by Category or Status, and sort by Priority levels.'
    }
  ];

  return (
    <section style={{ padding: '5rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
          Everything you need to <span className="gradient-text">master your workflow</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Designed to streamline daily productivity, organize personal goals, and manage projects effectively.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '1.75rem',
              transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              {feat.icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              {feat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
