import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Mail,
  X,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';

const INITIAL_MEMBERS = [
  {
    id: 'mem_1',
    name: 'Mark Lester',
    email: 'lester@taskflow.dev',
    role: 'Lead Architect',
    category: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    status: 'online',
    assignedCount: 8,
    completedCount: 6,
    progress: 75
  },
  {
    id: 'mem_2',
    name: 'Sophia Chen',
    email: 'sophia@taskflow.dev',
    role: 'Frontend Developer',
    category: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    status: 'online',
    assignedCount: 6,
    completedCount: 5,
    progress: 83
  },
  {
    id: 'mem_3',
    name: 'Aiden Vance',
    email: 'aiden@taskflow.dev',
    role: 'Backend Specialist',
    category: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
    status: 'busy',
    assignedCount: 7,
    completedCount: 4,
    progress: 57
  },
  {
    id: 'mem_4',
    name: 'Maria Santos',
    email: 'maria@taskflow.dev',
    role: 'DevOps & Security',
    category: 'Security',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    status: 'online',
    assignedCount: 5,
    completedCount: 5,
    progress: 100
  },
  {
    id: 'mem_5',
    name: 'Felix Muller',
    email: 'felix@taskflow.dev',
    role: 'UI/UX Designer',
    category: 'Design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    status: 'offline',
    assignedCount: 4,
    completedCount: 3,
    progress: 75
  }
];

export const TeamView = () => {
  const { tasks } = useTask();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Frontend Developer',
    category: 'Engineering'
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || member.category === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    const created = {
      id: 'mem_' + Date.now(),
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      category: newMember.category,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newMember.name)}`,
      status: 'online',
      assignedCount: 0,
      completedCount: 0,
      progress: 100
    };

    setMembers([created, ...members]);
    setInviteSuccess(true);
    setNewMember({ name: '', email: '', role: 'Frontend Developer', category: 'Engineering' });
    setTimeout(() => {
      setInviteSuccess(false);
      setIsInviteModalOpen(false);
    }, 1500);
  };

  return (
    <div>
      {/* Page Header */}
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
            <Users color="var(--accent-primary)" size={28} /> Workspace Team & Members
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage team members, monitor workload distribution, and invite collaborators.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <UserPlus size={18} /> Invite Team Member
        </button>
      </div>

      {/* Metrics Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.1rem',
        marginBottom: '1.75rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-muted)' }}>TEAM MEMBERS</span>
            <Users size={18} color="var(--accent-primary)" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>{members.length}</p>
          <p style={{ fontSize: '0.775rem', color: 'var(--accent-success)' }}>Active Collaborators</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-muted)' }}>WORKLOAD INDEX</span>
            <Briefcase size={18} color="var(--accent-secondary)" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>
            {members.reduce((acc, m) => acc + m.assignedCount, 0)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>tasks</span>
          </p>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>Across all projects</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-muted)' }}>ON-TIME RATE</span>
            <Award size={18} color="#fbbf24" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: '800' }}>82%</p>
          <p style={{ fontSize: '0.775rem', color: 'var(--accent-success)' }}>+4.2% from last sprint</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.55rem 0.9rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-subtle)',
          flex: 1,
          minWidth: '240px'
        }}>
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search member by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'inherit',
              fontSize: '0.875rem',
              width: '100%'
            }}
          />
        </div>

        {/* Category Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          {['All', 'Engineering', 'Design', 'Security'].map(cat => (
            <button
              key={cat}
              onClick={() => setRoleFilter(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: roleFilter === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: roleFilter === cat ? '#fff' : 'var(--text-muted)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {filteredMembers.map(member => (
          <div key={member.id} className="glass-panel" style={{ padding: '1.4rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  padding: '2px',
                  background: 'var(--gradient-primary)',
                  borderRadius: '50%',
                  display: 'flex'
                }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#1e293b' }}
                  />
                </div>
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: member.status === 'online' ? 'var(--accent-success)' : member.status === 'busy' ? '#f59e0b' : '#64748b',
                  border: '2px solid var(--bg-main)'
                }} />
              </div>

              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '600' }}>{member.role}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.email}
                </p>
              </div>
            </div>

            {/* Workload Progress Bar */}
            <div style={{ marginBottom: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sprint Workload</span>
                <span style={{ color: 'var(--text-main)' }}>{member.completedCount} / {member.assignedCount} tasks</span>
              </div>
              <div style={{ height: '7px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${member.progress}%`,
                  background: member.progress === 100 ? 'var(--accent-success)' : 'var(--gradient-primary)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, padding: '0.45rem', fontSize: '0.775rem', justifyContent: 'center' }}
                onClick={() => alert(`Showing tasks assigned to ${member.name}`)}
              >
                View Tasks
              </button>
              <a
                href={`mailto:${member.email}`}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Send Email"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
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
            maxWidth: '480px',
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
                <UserPlus size={20} color="var(--accent-primary)" /> Invite Team Collaborator
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ padding: '1.5rem' }}>
              {inviteSuccess && (
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <CheckCircle2 size={18} /> Invitation sent successfully!
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="jordan@company.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={newMember.category}
                    onChange={(e) => setNewMember({ ...newMember, category: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Security">Security</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} /> Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
