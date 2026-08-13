import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  BarChart3,
  TrendingUp,
  Target,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  Menu,
  ChevronDown
} from 'lucide-react';

export const AnalyticsView = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { allTasks, stats, searchQuery, setSearchQuery } = useTask();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Category breakdown
  const categories = {};
  allTasks.forEach(t => {
    const cat = t.category || 'General';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  // Priority breakdown
  const priorities = { urgent: 0, high: 0, medium: 0, low: 0 };
  allTasks.forEach(t => {
    const p = t.priority || 'low';
    if (priorities[p] !== undefined) priorities[p]++;
  });

  const now = new Date();
  const weekAgo = new Date(now - 7 * 86400000);
  const completedThisWeek = allTasks.filter(t =>
    t.status === 'completed' && new Date(t.updatedAt || t.createdAt) >= weekAgo
  ).length;

  const threeDaysAhead = new Date(now.getTime() + 3 * 86400000);
  const dueSoon = allTasks.filter(t =>
    t.status !== 'completed' && t.dueDate && new Date(t.dueDate) <= threeDaysAhead && new Date(t.dueDate) >= now
  ).length;

  const overdue = allTasks.filter(t =>
    t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now
  ).length;

  const userName = user?.name || 'Lester';
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

  return (
    <div className="dashboard-light-theme" style={{
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f4f6f8',
      padding: '1.5rem 1.8rem',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Header Bar - Fixed Sticky Position */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        marginBottom: '1.25rem',
        gap: '1rem',
        boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <button
            onClick={onToggleSidebar}
            className="header-hamburger-toggle"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Menu size={20} />
          </button>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px'
          }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.2rem',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.85rem',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Right Action Icons & User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={18} color="#64748b" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8b5cf6'
            }} />
          </div>

          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer'
              }}
            >
              <img
                src={userAvatar}
                alt={userName}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#1e1b4b'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.1 }}>
                  {userName}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '600' }}>
                  ● Online
                </span>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #f1f5f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: '#ede9fe',
          color: '#6d28d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(109, 40, 217, 0.15)'
        }}>
          <BarChart3 size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
            Analytics & Productivity Metrics
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Comprehensive performance analytics, velocity breakdown, and completion velocity.
          </p>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>Completion Rate</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {stats.completionRate || 0}%
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={16} /> +12%
            </span>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>Completed This Week</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {completedThisWeek}
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={16} /> +4
            </span>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>Due Soon (3 Days)</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {dueSoon}
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7' }}>
              Pending
            </span>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>Overdue Tasks</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {overdue}
            </h2>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
              <ArrowDownRight size={16} /> -2
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Category Breakdown */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} color="#6d28d9" /> Category Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(categories).map(([cat, count]) => {
              const pct = allTasks.length > 0 ? Math.round((count / allTasks.length) * 100) : 0;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#0f172a' }}>{cat}</span>
                    <span style={{ color: '#6d28d9' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#6d28d9', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} color="#6d28d9" /> Priority Matrix
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { key: 'urgent', label: 'Urgent', color: '#ef4444', bg: '#fee2e2' },
              { key: 'high', label: 'High', color: '#f59e0b', bg: '#fef3c7' },
              { key: 'medium', label: 'Medium', color: '#0284c7', bg: '#e0f2fe' },
              { key: 'low', label: 'Low', color: '#16a34a', bg: '#dcfce7' }
            ].map(p => {
              const count = priorities[p.key] || 0;
              const pct = allTasks.length > 0 ? Math.round((count / allTasks.length) * 100) : 0;
              return (
                <div key={p.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    <span style={{ color: p.color }}>{p.label}</span>
                    <span style={{ color: '#0f172a' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: p.color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
