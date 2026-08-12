import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  Search,
  LayoutDashboard,
  Calendar,
  FolderKanban,
  Users,
  BarChart3,
  Clock,
  Bell,
  Settings,
  PlusCircle,
  Sun,
  Moon,
  Bot,
  Timer,
  Download,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CommandPaletteModal = ({ isOpen, onClose, onSelectNav, onOpenAICopilot, onOpenFocusTimer, onOpenExport }) => {
  const { isDarkMode, toggleDarkMode, isCompactView, toggleCompactView } = useAuth();
  const { tasks, openCreateTaskModal } = useTask();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'create_task',
      title: 'Create New Task',
      category: 'Actions',
      icon: <PlusCircle size={18} color="var(--accent-primary)" />,
      action: () => { openCreateTaskModal(); onClose(); }
    },
    {
      id: 'ai_copilot',
      title: 'Open AI Task Copilot',
      category: 'AI & Tools',
      icon: <Bot size={18} color="#fbbf24" />,
      action: () => { onOpenAICopilot(); onClose(); }
    },
    {
      id: 'focus_timer',
      title: 'Start Focus Pomodoro Timer',
      category: 'AI & Tools',
      icon: <Timer size={18} color="#ec4899" />,
      action: () => { onOpenFocusTimer(); onClose(); }
    },
    {
      id: 'toggle_theme',
      title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      category: 'Preferences',
      icon: isDarkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />,
      action: () => { toggleDarkMode(); onClose(); }
    },
    {
      id: 'export_csv',
      title: 'Export Workspace Data (CSV)',
      category: 'Actions',
      icon: <Download size={18} color="var(--accent-success)" />,
      action: () => { onOpenExport(); onClose(); }
    },
    {
      id: 'nav_dashboard',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: <LayoutDashboard size={18} />,
      action: () => { onSelectNav('overview'); onClose(); }
    },
    {
      id: 'nav_calendar',
      title: 'Go to Calendar & Schedule',
      category: 'Navigation',
      icon: <Calendar size={18} />,
      action: () => { onSelectNav('calendar'); onClose(); }
    },
    {
      id: 'nav_projects',
      title: 'Go to Project Roadmaps',
      category: 'Navigation',
      icon: <FolderKanban size={18} />,
      action: () => { onSelectNav('projects'); onClose(); }
    },
    {
      id: 'nav_team',
      title: 'Go to Team & Members',
      category: 'Navigation',
      icon: <Users size={18} />,
      action: () => { onSelectNav('team'); onClose(); }
    },
    {
      id: 'nav_analytics',
      title: 'Go to Analytics & Metrics',
      category: 'Navigation',
      icon: <BarChart3 size={18} />,
      action: () => { onSelectNav('analytics'); onClose(); }
    },
    {
      id: 'nav_settings',
      title: 'Go to Settings',
      category: 'Navigation',
      icon: <Settings size={18} />,
      action: () => { onSelectNav('settings'); onClose(); }
    }
  ];

  // Add tasks to command palette results
  const taskActions = tasks.map(t => ({
    id: `task_${t.id || t._id}`,
    title: t.title,
    category: 'Tasks',
    icon: <Sparkles size={16} color="var(--accent-primary)" />,
    action: () => { onSelectNav('overview'); onClose(); }
  }));

  const allItems = [...actions, ...taskActions];

  const filteredItems = allItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDownNav = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 8, 16, 0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '8vh',
      zIndex: 1200,
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '600px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), var(--shadow-glow)',
        border: '1px solid var(--border-glow)'
      }}>
        {/* Search Header Input */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <Search size={20} color="var(--accent-primary)" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, search tasks, or jump to view... (Ctrl + K)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDownNav}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'inherit',
              fontSize: '1rem',
              width: '100%',
              fontWeight: '600'
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Items List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No matching commands or tasks found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? '700' : '600', color: isSelected ? '#fff' : 'var(--text-main)' }}>
                      {item.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-muted)'
                    }}>
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={14} color="var(--accent-primary)" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Instructions */}
        <div style={{
          padding: '0.65rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <span>Use <strong>↑</strong> <strong>↓</strong> to navigate, <strong>Enter</strong> to select</span>
          <span><strong>Esc</strong> to close</span>
        </div>
      </div>
    </div>
  );
};
