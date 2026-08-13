import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  FolderKanban,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  Sparkles,
  Layers,
  Search,
  Bell,
  Menu,
  ChevronDown,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    title: 'TaskFlow Pro v2.0 Architecture',
    category: 'Engineering',
    lead: 'Mark Lester',
    leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    deadline: '2026-09-15',
    status: 'On Track',
    completedTasks: 12,
    totalTasks: 15,
    progress: 80,
    description: 'Full stack OWASP-hardened architecture with MongoDB Atlas backend.'
  },
  {
    id: 'proj_2',
    title: 'Mobile App & Off-Canvas Drawer',
    category: 'Mobile & UX',
    lead: 'Sophia Chen',
    leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    deadline: '2026-08-30',
    status: 'Milestone Reached',
    completedTasks: 9,
    totalTasks: 10,
    progress: 90,
    description: 'Responsive mobile drawer navigation and touch cropper controls.'
  },
  {
    id: 'proj_3',
    title: 'OWASP Security Audit & Rate Limiting',
    category: 'Security',
    lead: 'Maria Santos',
    leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    deadline: '2026-10-01',
    status: 'In Progress',
    completedTasks: 5,
    totalTasks: 8,
    progress: 62,
    description: 'NoSQL query sanitization, parameter pollution, and JWT encryption.'
  },
  {
    id: 'proj_4',
    title: 'Design System & Dark Theme Engine',
    category: 'Design System',
    lead: 'Felix Muller',
    leadAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    deadline: '2026-08-20',
    status: 'Completed',
    completedTasks: 6,
    totalTasks: 6,
    progress: 100,
    description: 'Ultra-sleek dark mode and light theme CSS variable engine.'
  }
];

export const ProjectsView = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useTask();
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Engineering',
    lead: 'Mark Lester',
    deadline: '',
    description: ''
  });

  const userName = user?.name || 'Lester';
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const created = {
      id: 'proj_' + Date.now(),
      title: newProject.title.trim(),
      category: newProject.category,
      lead: newProject.lead,
      leadAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newProject.lead)}`,
      deadline: newProject.deadline || '2026-10-15',
      status: 'On Track',
      completedTasks: 0,
      totalTasks: 5,
      progress: 0,
      description: newProject.description.trim() || 'New strategic project initiative.'
    };

    setProjects([created, ...projects]);
    setNewProject({ title: '', category: 'Engineering', lead: 'Mark Lester', deadline: '', description: '' });
    setIsModalOpen(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
      case 'On Track':
        return { bg: '#dcfce7', color: '#16a34a', label: status };
      case 'Milestone Reached':
        return { bg: '#f3e8ff', color: '#9333ea', label: status };
      case 'In Progress':
      default:
        return { bg: '#e0f2fe', color: '#0284c7', label: status };
    }
  };

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

      {/* Hero Title Banner Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #f1f5f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <FolderKanban size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
              Project Roadmaps & Milestones
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Track high-level project initiatives, completion milestones, and team progress.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.5rem 1.15rem',
            borderRadius: '10px',
            background: '#6d28d9',
            border: 'none',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 4px 12px rgba(109, 40, 217, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <PlusCircle size={16} /> New Project Roadmap
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {projects.map(proj => {
          const st = getStatusStyle(proj.status);
          return (
            <div
              key={proj.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    background: '#ede9fe',
                    color: '#6d28d9'
                  }}>
                    {proj.category}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: st.bg,
                    color: st.color
                  }}>
                    ● {st.label}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.4rem 0', lineHeight: 1.25 }}>
                  {proj.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  {proj.description}
                </p>
              </div>

              {/* Progress Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Progress Completion</span>
                  <span style={{ color: '#0f172a', fontWeight: '800' }}>
                    {proj.progress}% <span style={{ color: '#94a3b8', fontWeight: '500' }}>({proj.completedTasks}/{proj.totalTasks})</span>
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${proj.progress}%`,
                    height: '100%',
                    background: proj.progress === 100 ? '#16a34a' : 'linear-gradient(90deg, #6d28d9, #8b5cf6)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {/* Footer Lead & Deadline */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={proj.leadAvatar}
                    alt={proj.lead}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ede9fe' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>
                    {proj.lead}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                  <CalendarIcon size={12} color="#94a3b8" /> Due {proj.deadline}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '480px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                New Project Roadmap
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microservices Auth Migration"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Mobile & UX">Mobile & UX</option>
                    <option value="Security">Security</option>
                    <option value="Design System">Design System</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Short Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the main objectives and scope..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.3rem',
                    borderRadius: '10px',
                    background: '#6d28d9',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(109, 40, 217, 0.25)'
                  }}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
