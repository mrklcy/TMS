import React, { useState } from 'react';
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
  X
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
    statusColor: '#10b981',
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
    statusColor: '#6366f1',
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
    statusColor: '#38bdf8',
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
    statusColor: '#10b981',
    completedTasks: 6,
    totalTasks: 6,
    progress: 100,
    description: 'Ultra-sleek dark mode and light theme CSS variable engine.'
  }
];

export const ProjectsView = () => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Engineering',
    lead: 'Mark Lester',
    deadline: '',
    description: ''
  });

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
      statusColor: '#10b981',
      completedTasks: 0,
      totalTasks: 5,
      progress: 0,
      description: newProject.description || 'New project milestone roadmap.'
    };

    setProjects([created, ...projects]);
    setIsModalOpen(false);
    setNewProject({ title: '', category: 'Engineering', lead: 'Mark Lester', deadline: '', description: '' });
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FolderKanban color="var(--accent-primary)" size={28} /> Project Roadmaps & Milestones
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Track high-level project initiatives, completion milestones, and team progress.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <PlusCircle size={18} /> New Project Roadmap
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.35rem' }}>
        {projects.map(proj => (
          <div key={proj.id} className="glass-panel" style={{ padding: '1.6rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="category-tag">{proj.category}</span>
              <span style={{
                fontSize: '0.725rem',
                fontWeight: '800',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                background: `${proj.statusColor}20`,
                color: proj.statusColor,
                border: `1px solid ${proj.statusColor}40`
              }}>
                ● {proj.status}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem', lineHeight: '1.35' }}>
              {proj.title}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.45' }}>
              {proj.description}
            </p>

            {/* Progress Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Progress Completion</span>
                <span style={{ color: 'var(--text-main)' }}>{proj.progress}% ({proj.completedTasks}/{proj.totalTasks})</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${proj.progress}%`,
                  background: proj.progress === 100 ? 'var(--accent-success)' : 'var(--gradient-primary)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Footer Details */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={proj.leadAvatar} alt={proj.lead} style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#1e293b' }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{proj.lead}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)' }}>
                <Clock size={14} /> Due {proj.deadline}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={20} color="var(--accent-primary)" /> Create Project Roadmap
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ padding: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. AI Workflow Integration"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category Tag</label>
                  <select
                    className="form-select"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Mobile & UX">Mobile & UX</option>
                    <option value="Security">Security</option>
                    <option value="Design System">Design System</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Project Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the milestone objectives and key deliverables..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} /> Create Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
