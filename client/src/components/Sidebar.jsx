import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  CheckSquare,
  LayoutDashboard,
  Kanban,
  ListFilter,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  BarChart3,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Calendar,
  FolderKanban,
  Users,
  Bot,
  Timer,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab, collapsed, setCollapsed, activeNav, setActiveNav, onOpenAICopilot, onOpenCmdPalette }) => {
  const { user, isAuthenticated, logout, isDarkMode, toggleDarkMode } = useAuth();
  const { viewMode, setViewMode, openCreateTaskModal, stats, searchQuery, setSearchQuery } = useTask();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
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
      icon: <LayoutDashboard size={20} />,
      action: () => {
        setActiveNav('overview');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'calendar',
      label: 'Calendar & Schedule',
      icon: <Calendar size={20} />,
      action: () => {
        setActiveNav('calendar');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'projects',
      label: 'Project Roadmaps',
      icon: <FolderKanban size={20} />,
      action: () => {
        setActiveNav('projects');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={20} />,
      action: () => {
        setActiveNav('analytics');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    }
  ];

  const quickActions = [
    {
      id: 'focustimer',
      label: 'Focus Pomodoro Timer',
      icon: <Timer size={20} color="#ec4899" />,
      action: () => {
        setActiveNav('focustimer');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'team',
      label: 'Team & Members',
      icon: <Users size={20} />,
      action: () => {
        setActiveNav('team');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'recent',
      label: 'Recent Activity',
      icon: <Clock size={20} />,
      action: () => {
        setActiveNav('recent');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={20} />,
      badge: stats?.urgent || 0,
      action: () => {
        setActiveNav('notifications');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      action: () => {
        setActiveNav('settings');
        setCurrentTab('dashboard');
        setMobileOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Mobile Top Sticky Navigation Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <CheckSquare size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              TaskFlow<span className="gradient-text">Pro</span>
            </span>
          </div>
        </div>

        {/* Mobile top right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => toggleDarkMode()}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
          </button>

          <button
            onClick={() => openCreateTaskModal()}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <PlusCircle size={16} /> Task
          </button>

          <div style={{
            padding: '2px',
            background: 'var(--gradient-primary)',
            borderRadius: '50%',
            display: 'flex'
          }}>
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
              alt={user?.name}
              style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1e293b' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Sidebar (Desktop Fixed + Mobile Off-Canvas Drawer) */}
      <aside className={`sidebar-container ${isCollapsedEffective ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header - Clean & Spacious Logo Header */}
        <div className="sidebar-header">
          {isCollapsedEffective ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                cursor: 'pointer'
              }}
                onClick={() => setCollapsed(false)}
                title="Expand Sidebar"
              >
                <ChevronRight size={20} color="#ffffff" />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-glow)',
                  flexShrink: 0
                }}>
                  <CheckSquare size={22} color="#ffffff" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
                  TaskFlow<span className="gradient-text">Pro</span>
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {/* Desktop collapse button */}
                <button
                  onClick={() => setCollapsed(true)}
                  className="sidebar-toggle-btn desktop-only"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Mobile drawer close button */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="mobile-only"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Task & AI Copilot Action Buttons */}
        <div style={{
          padding: isCollapsedEffective ? '0.6rem 0.65rem' : '0.85rem 1.15rem',
          display: 'flex',
          flexDirection: isCollapsedEffective ? 'column' : 'column',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => { openCreateTaskModal(); setMobileOpen(false); }}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: isCollapsedEffective ? '0.65rem 0' : '0.75rem 1rem',
              justifyContent: 'center',
              fontSize: isCollapsedEffective ? '0.8rem' : '0.9rem',
              borderRadius: 'var(--radius-md)'
            }}
            title={isCollapsedEffective ? 'New Task' : ''}
          >
            <PlusCircle size={isCollapsedEffective ? 20 : 18} />
            {!isCollapsedEffective && <span>New Task</span>}
          </button>

          <button
            onClick={() => { onOpenAICopilot?.(); setMobileOpen(false); }}
            className="btn"
            style={{
              width: '100%',
              padding: isCollapsedEffective ? '0.65rem 0' : '0.65rem 1rem',
              justifyContent: 'center',
              fontSize: isCollapsedEffective ? '0.8rem' : '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontWeight: '700',
              gap: '0.45rem'
            }}
            title={isCollapsedEffective ? 'AI Copilot' : ''}
          >
            <Bot size={isCollapsedEffective ? 20 : 16} color="#fbbf24" />
            {!isCollapsedEffective && <span>AI Copilot</span>}
          </button>
        </div>

        {/* Search Bar with Ctrl+K Trigger */}
        {!isCollapsedEffective && (
          <div style={{ padding: '0 1.15rem 0.6rem 1.15rem' }}>
            <div
              onClick={() => onOpenCmdPalette?.()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
                <Search size={16} color="var(--text-dim)" />
                <span style={{ fontSize: '0.825rem', color: 'var(--text-dim)' }}>Command palette...</span>
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--text-muted)'
              }}>
                Ctrl K
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="sidebar-nav" style={{ padding: isCollapsedEffective ? '0.5rem 0.4rem' : '0.5rem 0.85rem' }}>
          <div className="sidebar-section-title">
            {!isCollapsedEffective ? <span>MAIN MENU</span> : <div style={{ borderBottom: '1px solid var(--border-subtle)', margin: '0.25rem 0.5rem' }} />}
          </div>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              title={isCollapsedEffective ? item.label : ''}
            >
              <div className="sidebar-icon">{item.icon}</div>
              {!isCollapsedEffective && <span>{item.label}</span>}
            </button>
          ))}

          <div className="sidebar-section-title" style={{ marginTop: '0.75rem' }}>
            {!isCollapsedEffective ? <span>TOOLS & PREFERENCES</span> : <div style={{ borderBottom: '1px solid var(--border-subtle)', margin: '0.25rem 0.5rem' }} />}
          </div>

          {quickActions.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              title={isCollapsedEffective ? item.label : ''}
            >
              <div className="sidebar-icon">{item.icon}</div>
              {!isCollapsedEffective && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={{
                      background: 'var(--accent-danger)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '10px',
                      lineHeight: 1.2
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              {isCollapsedEffective && item.badge > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-danger)',
                  boxShadow: '0 0 6px var(--accent-danger)'
                }} />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="sidebar-footer" style={{ padding: isCollapsedEffective ? '0.75rem 0.5rem' : '1.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', flex: 1 }}>
              <div style={{
                padding: '2px',
                background: 'var(--gradient-primary)',
                borderRadius: '50%',
                display: 'flex',
                flexShrink: 0
              }}>
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                  alt={user?.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b' }}
                />
              </div>

              {!isCollapsedEffective && (
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ● Online
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button right beside user info */}
            {!isCollapsedEffective && (
              <button
                onClick={() => toggleDarkMode()}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: isDarkMode ? 'rgba(251, 191, 36, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                  border: isDarkMode ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
              </button>
            )}
          </div>

          {!isCollapsedEffective && (
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.45rem 0.75rem', marginTop: '0.75rem', width: '100%', justifyContent: 'center', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
              title="Logout"
            >
              <LogOut size={15} /> Sign Out
            </button>
          )}

          {isCollapsedEffective && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => toggleDarkMode()}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
              </button>
              <button
                onClick={logout}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.35rem', width: '100%', justifyContent: 'center' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
