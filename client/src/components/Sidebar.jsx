import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  CheckSquare,
  LayoutDashboard,
  Calendar,
  FolderKanban,
  BarChart3,
  Settings,
  ListFilter,
  Clock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab, collapsed, setCollapsed, activeNav, setActiveNav }) => {
  const { user, isAuthenticated } = useAuth();
  const { stats } = useTask();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) return null;

  const isCollapsedEffective = collapsed && !isMobile;

  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: <LayoutDashboard size={19} />,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'mytasks',
      label: 'My Tasks',
      icon: <CheckSquare size={19} />,
      badge: stats?.total || 6,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar size={19} />,
      action: () => {
        setActiveNav('calendar');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderKanban size={19} />,
      action: () => {
        setActiveNav('projects');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckSquare size={19} />,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={19} />,
      action: () => {
        setActiveNav('analytics');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={19} />,
      action: () => {
        setActiveNav('settings');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    }
  ];

  const quickFilters = [
    {
      id: 'alltasks',
      label: 'All Tasks',
      icon: <ListFilter size={18} />,
      badge: stats?.total || 6,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'today',
      label: 'Today',
      icon: <Calendar size={18} />,
      badge: 2,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'thisweek',
      label: 'This Week',
      icon: <Calendar size={18} />,
      badge: 4,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: <Clock size={18} />,
      badge: stats?.urgent || 1,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Mobile Sticky Nav Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#6d28d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckSquare size={18} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
              TaskFlow
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Sidebar */}
      <aside className={`sidebar-container ${isCollapsedEffective ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header Logo */}
        <div className="sidebar-header" style={{ padding: isCollapsedEffective ? '1rem 0.5rem' : '1.25rem 1.15rem', borderBottom: 'none' }}>
          {isCollapsedEffective ? (
            <div
              onClick={() => setCollapsed(false)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                margin: '0 auto'
              }}
            >
              <CheckSquare size={20} color="#ffffff" />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#6d28d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckSquare size={22} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
                    TaskFlow
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: '500' }}>
                    Task Management System
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCollapsed(true)}
                className="sidebar-toggle-btn desktop-only"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                title="Collapse Sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav" style={{ padding: isCollapsedEffective ? '0.5rem 0.4rem' : '0.5rem 0.85rem' }}>
          {navItems.map(item => {
            const isActive = activeNav === item.id || (item.id === 'overview' && activeNav === 'overview');
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? '#6d28d9' : 'transparent',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  borderRadius: '12px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="sidebar-icon">{item.icon}</div>
                  {!isCollapsedEffective && <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{item.label}</span>}
                </div>
                {!isCollapsedEffective && item.badge > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#6d28d9',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Divider Line */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', margin: '1rem 0.5rem' }} />

          {/* Quick Filters */}
          {!isCollapsedEffective && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', padding: '0 0.85rem 0.5rem 0.85rem' }}>
              Quick Filters
            </div>
          )}

          {quickFilters.map(item => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? '#6d28d9' : 'transparent',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  borderRadius: '12px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="sidebar-icon">{item.icon}</div>
                  {!isCollapsedEffective && <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{item.label}</span>}
                </div>
                {!isCollapsedEffective && item.badge > 0 && (
                  <span style={{
                    background: item.id === 'alltasks' ? '#6d28d9' : '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
