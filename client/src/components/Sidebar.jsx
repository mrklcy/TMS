import React, { useState } from 'react';
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
  Bell
} from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab, collapsed, setCollapsed }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { viewMode, setViewMode, openCreateTaskModal, stats } = useTask();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  if (!isAuthenticated) return null;

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
      id: 'kanban',
      label: 'Kanban Board',
      icon: <Kanban size={20} />,
      action: () => {
        setActiveNav('kanban');
        setCurrentTab('dashboard');
        setViewMode('kanban');
        setMobileOpen(false);
      }
    },
    {
      id: 'list',
      label: 'List View',
      icon: <ListFilter size={20} />,
      action: () => {
        setActiveNav('list');
        setCurrentTab('dashboard');
        setViewMode('list');
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
      {/* Mobile Top Header with Hamburger */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-hamburger-btn"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckSquare size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>
              TaskFlow<span className="gradient-text">Pro</span>
            </span>
          </div>
        </div>

        {/* Mobile right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => { openCreateTaskModal(); }}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.35rem 0.65rem' }}
          >
            <PlusCircle size={16} />
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
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1e293b' }}
            />
          </div>
          <button onClick={logout} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Backdrop */}
      {mobileOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Sidebar (Desktop + Mobile Drawer) */}
      <aside className={`sidebar-container ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {collapsed ? (
            <>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
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
            </>
          ) : (
            <>
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
                <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
                  TaskFlow<span className="gradient-text">Pro</span>
                </span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="sidebar-toggle-btn desktop-only"
                title="Collapse Sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          )}
        </div>

        {/* New Task Action Button */}
        <div style={{ padding: collapsed ? '0.6rem 0.75rem' : '0.75rem 1rem' }}>
          <button
            onClick={() => { openCreateTaskModal(); setMobileOpen(false); }}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: collapsed ? '0.65rem 0' : '0.7rem 1rem',
              justifyContent: 'center',
              fontSize: collapsed ? '0.8rem' : '0.9rem'
            }}
            title={collapsed ? 'New Task' : ''}
          >
            <PlusCircle size={collapsed ? 20 : 18} />
            {!collapsed && <span>New Task</span>}
          </button>
        </div>

        {/* Search (expanded only) */}
        {!collapsed && (
          <div style={{ padding: '0 1rem 0.5rem 1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-dim)',
              fontSize: '0.85rem'
            }}>
              <Search size={15} />
              <span>Quick search...</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {/* Main Navigation */}
          <div className="sidebar-section-title">
            {!collapsed ? <span>MAIN MENU</span> : <div style={{ borderBottom: '1px solid var(--border-subtle)', margin: '0.25rem 0.5rem' }} />}
          </div>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <div className="sidebar-icon">{item.icon}</div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}

          {/* Tools & Quick Actions */}
          <div className="sidebar-section-title" style={{ marginTop: '0.75rem' }}>
            {!collapsed ? <span>TOOLS</span> : <div style={{ borderBottom: '1px solid var(--border-subtle)', margin: '0.25rem 0.5rem' }} />}
          </div>

          {quickActions.map(item => (
            <button
              key={item.id}
              onClick={item.action}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <div className="sidebar-icon">{item.icon}</div>
              {!collapsed && (
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
              {collapsed && item.badge > 0 && (
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
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
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
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e293b' }}
              />
            </div>

            {!collapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ● Online
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.4rem 0.6rem', marginTop: '0.65rem', width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
              title="Logout"
            >
              <LogOut size={14} /> Sign Out
            </button>
          )}

          {collapsed && (
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.35rem', marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
