import React from 'react';
import { LayoutGrid, Shield, Tag, CheckSquare, BarChart3, Filter } from 'lucide-react';

export const LandingFeatures = () => {
  const features = [
    {
      icon: <LayoutGrid size={22} color="#6d28d9" />,
      bg: '#ede9fe',
      title: 'Kanban & List Boards',
      description: 'Organize tasks across To Do, In Progress, and Completed columns. Toggle seamlessly between interactive board and list views.'
    },
    {
      icon: <Shield size={22} color="#0284c7" />,
      bg: '#e0f2fe',
      title: 'Secure MongoDB Data',
      description: 'Keep your personal workspace and task data completely private with protected user login accounts and JWT authorization.'
    },
    {
      icon: <Tag size={22} color="#16a34a" />,
      bg: '#dcfce7',
      title: 'Priority & Category Tagging',
      description: 'Tag tasks into Work, Personal, or Urgent categories, and highlight high-priority items so you never miss a deadline.'
    },
    {
      icon: <CheckSquare size={22} color="#9333ea" />,
      bg: '#f3e8ff',
      title: 'Subtasks & Checklists',
      description: 'Break complex projects down into bite-sized actionable items with dynamic progress tracking bars.'
    },
    {
      icon: <BarChart3 size={22} color="#d97706" />,
      bg: '#fef3c7',
      title: 'Real-Time Analytics',
      description: 'Monitor task completion rates, pending urgent items, and overall productivity metrics at a glance.'
    },
    {
      icon: <Filter size={22} color="#6d28d9" />,
      bg: '#ede9fe',
      title: 'Smart Search & Filters',
      description: 'Instantly query tasks by keyword, filter by Category or Status, and sort by Priority levels.'
    }
  ];

  return (
    <section style={{
      padding: '4rem 1.25rem',
      background: '#ffffff',
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
          Everything you need to <span style={{ color: '#6d28d9' }}>master your workflow</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
          Designed to streamline daily productivity, organize personal goals, and manage projects effectively.
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {features.map((f, idx) => (
          <div
            key={idx}
            style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: f.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.1rem'
            }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
