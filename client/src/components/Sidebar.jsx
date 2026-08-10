import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  CheckSquare,
  LayoutDashboard,
  Kanban,
  ListFilter,
  PlusCircle,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { viewMode, setViewMode, openCreateTaskModal } = useTask();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return null;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Workspace Overview',
      icon: <LayoutDashboard size={20} />,
      action: () => { setCurrentTab('dashboard'); setMobileOpen(false); }
    },
    {
      id: 'kanban',
      label: 'Kanban Board',
      icon: <Kanban size={20} />,
      action: () => { setCurrentTab('dashboard'); setViewMode('kanban'); setMobileOpen(false); }
    },
    {
      id: 'list',
      label: 'Table List View',
      icon: <ListFilter size={20} />,
      action: () => { setCurrentTab('dashboard'); setViewMode('list'); setMobileOpen(false); }
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

        {/* Compact User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            alt={user?.name}
            style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
          />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
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
            {!collapsed && (
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
                TaskFlow<span className="gradient-text">Pro</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-toggle-btn desktop-only"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Action Button */}
        <div style={{ padding: collapsed ? '1rem 0.5rem' : '1rem 1.25rem' }}>
          <button
            onClick={() => { openCreateTaskModal(); setMobileOpen(false); }}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: collapsed ? '0.75rem 0' : '0.75rem 1rem',
              justifyContent: 'center'
            }}
          >
            <PlusCircle size={20} />
            {!collapsed && <span>New Task</span>}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">
            {!collapsed && <span>NAVIGATION</span>}
          </div>

          {navItems.map(item => {
            const isActive =
              item.id === 'dashboard'
                ? currentTab === 'dashboard'
                : currentTab === 'dashboard' && viewMode === item.id;

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <div className="sidebar-icon">{item.icon}</div>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
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
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  ● Active Workspace
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={logout}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.4rem 0.6rem', marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
              title="Logout"
            >
              <LogOut size={15} /> Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
