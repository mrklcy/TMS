import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Calendar as CalendarIcon,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Check,
  Trophy,
  Search,
  Bell,
  Menu,
  ChevronDown
} from 'lucide-react';

export const DashboardView = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const {
    tasks,
    allTasks,
    stats,
    updateTaskStatus,
    openCreateTaskModal,
    openEditTaskModal,
    requestDeleteTask,
    searchQuery,
    setSearchQuery
  } = useTask();

  // All hooks at top
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'todo', 'in-progress', 'completed'
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Filter tasks for the "My Tasks" section
  const displayTasks = allTasks.filter(task => {
    if (highPriorityOnly && task.priority !== 'high' && task.priority !== 'urgent') return false;
    if (taskFilter === 'todo') return task.status === 'todo';
    if (taskFilter === 'in-progress') return task.status === 'in-progress';
    if (taskFilter === 'completed') return task.status === 'completed';
    return true;
  });

  // Smart Sort: In Progress -> To Do -> Completed (matching reference dashboard)
  const sortedDisplayTasks = [...displayTasks].sort((a, b) => {
    const ORDER = { 'in-progress': 1, 'todo': 2, 'completed': 3 };
    const aVal = ORDER[a.status] || 2;
    const bVal = ORDER[b.status] || 2;
    return aVal - bVal;
  });

  const todoTasks = allTasks.filter(t => t.status === 'todo');
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');
  const completedTasks = allTasks.filter(t => t.status === 'completed');

  // Filter completed tasks out of Upcoming Deadlines
  const pendingUpcomingDeadlines = allTasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      const dA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dA - dB;
    });

  // Dynamic Calendar Calculation
  const currentMonthLabel = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayDateObj = new Date();

  // Get week array for calendarDate
  const calendarDayOfWeek = calendarDate.getDay();
  const calendarSunday = new Date(calendarDate);
  calendarSunday.setDate(calendarDate.getDate() - calendarDayOfWeek);

  const currentWeekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(calendarSunday);
    d.setDate(calendarSunday.getDate() + i);
    return d;
  });

  const weekStart = new Date(calendarSunday);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(calendarSunday);
  weekEnd.setDate(calendarSunday.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const tasksDueThisWeekCount = allTasks.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate).getTime();
    return d >= weekStart.getTime() && d <= weekEnd.getTime();
  }).length;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return { bg: '#fee2e2', color: '#ef4444', label: 'High' };
      case 'medium':
        return { bg: '#e0f2fe', color: '#0284c7', label: 'Medium' };
      case 'low':
      default:
        return { bg: '#dcfce7', color: '#16a34a', label: 'Low' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return { bg: '#dcfce7', color: '#16a34a', label: 'Completed' };
      case 'in-progress':
        return { bg: '#f3e8ff', color: '#9333ea', label: 'In Progress' };
      case 'todo':
      default:
        return { bg: '#f1f5f9', color: '#64748b', label: 'To Do' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'May 29';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

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
            maxWidth: '480px'
          }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.4rem',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.875rem',
                color: '#1e293b',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Header Right Tools & User Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b'
          }}>
            <Bell size={20} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8b5cf6'
            }} />
          </button>

          {/* User Profile Pill */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                padding: '0.2rem 0.5rem',
                borderRadius: '20px'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#312e81',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.2' }}>
                  {userName}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                  Online
                </span>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </div>

            {userDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '160px',
                zIndex: 50,
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => { setUserDropdownOpen(false); logout(); }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: '#ef4444',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Title & Greeting Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#ede9fe',
            color: '#6d28d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ClipboardList size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Task Management System
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Stay organized. Get things done.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              Welcome back, {userName}! 👋
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              You have {inProgressTasks.length} task{inProgressTasks.length === 1 ? '' : 's'} in progress
            </p>
          </div>

          <button
            onClick={openCreateTaskModal}
            style={{
              background: '#6d28d9',
              color: '#ffffff',
              border: 'none',
              padding: '0.7rem 1.4rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(109, 40, 217, 0.35)'
            }}
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.2rem',
        marginBottom: '1.75rem'
      }}>
        {/* Total Tasks */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ede9fe',
              color: '#6d28d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ClipboardList size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>Total Tasks</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
                {allTasks.length}
              </h2>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
            ↑ 20% <span style={{ fontWeight: '400', color: '#94a3b8' }}>vs. last week</span>
          </span>
        </div>

        {/* Completed */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>Completed</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
                {completedTasks.length}
              </h2>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
            ↑ 50% <span style={{ fontWeight: '400', color: '#94a3b8' }}>vs. last week</span>
          </span>
        </div>

        {/* In Progress */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ede9fe',
              color: '#6d28d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>In Progress</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
                {inProgressTasks.length}
              </h2>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
            ↓ 20% <span style={{ fontWeight: '400', color: '#94a3b8' }}>vs. last week</span>
          </span>
        </div>

        {/* Overdue */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b' }}>Overdue</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
                {allTasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length}
              </h2>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
            ↓ 50% <span style={{ fontWeight: '400', color: '#94a3b8' }}>vs. last week</span>
          </span>
        </div>
      </div>

      {/* Main Grid Section: 2 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 300px',
        gap: '1.5rem'
      }}>

        {/* LEFT COLUMN: My Tasks & Task Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* 1. MY TASKS CARD PANEL */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            {/* My Tasks Section Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: '2px solid #6d28d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6d28d9'
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  My Tasks
                </h3>
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: `All (${allTasks.length})` },
                  { id: 'todo', label: `To Do (${todoTasks.length})` },
                  { id: 'in-progress', label: `In Progress (${inProgressTasks.length})` },
                  { id: 'completed', label: `Completed (${completedTasks.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setTaskFilter(tab.id)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      background: taskFilter === tab.id ? '#6d28d9' : '#f1f5f9',
                      color: taskFilter === tab.id ? '#ffffff' : '#64748b',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* High Priority Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  onClick={() => setHighPriorityOnly(!highPriorityOnly)}
                  style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    background: highPriorityOnly ? '#6d28d9' : '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                    cursor: 'pointer',
                    justifyContent: highPriorityOnly ? 'flex-end' : 'flex-start',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ffffff'
                  }} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>High Priority</span>
              </div>
            </div>

            {/* Task List Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sortedDisplayTasks.map(task => {
                const taskId = task.id || task._id;
                const isCompleted = task.status === 'completed';
                const prio = getPriorityStyle(task.priority);
                const stat = getStatusStyle(task.status);

                return (
                  <div
                    key={taskId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      background: isCompleted ? '#f8fafc' : '#ffffff',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                      {/* Checkbox */}
                      <button
                        onClick={() => updateTaskStatus(taskId, isCompleted ? 'todo' : 'completed')}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: isCompleted ? '2px solid #6d28d9' : '2px solid #cbd5e1',
                          background: isCompleted ? '#6d28d9' : 'transparent',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        {isCompleted && <Check size={14} strokeWidth={3} />}
                      </button>

                      {/* Title & Category Subtitle */}
                      <div>
                        <h4 style={{
                          fontSize: '0.925rem',
                          fontWeight: '700',
                          color: isCompleted ? '#94a3b8' : '#0f172a',
                          margin: 0,
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                          {task.category || 'General'}
                        </p>
                      </div>
                    </div>

                    {/* Tags & Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {/* Status Tag */}
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: stat.bg,
                        color: stat.color
                      }}>
                        {stat.label}
                      </span>

                      {/* Priority Tag */}
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: prio.bg,
                        color: prio.color
                      }}>
                        {prio.label}
                      </span>

                      {/* Due Date */}
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <CalendarIcon size={14} color="#94a3b8" />
                        {formatDate(task.dueDate)}
                      </span>

                      {/* Three dots Menu */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === taskId ? null : taskId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {activeMenuId === taskId && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            zIndex: 40,
                            minWidth: '120px',
                            overflow: 'hidden'
                          }}>
                            <button
                              onClick={() => { openEditTaskModal(task); setActiveMenuId(null); }}
                              style={{
                                width: '100%',
                                padding: '0.5rem 0.85rem',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                                color: '#1e293b',
                                cursor: 'pointer',
                                fontWeight: '600'
                              }}
                            >
                              Edit Task
                            </button>
                            <button
                              onClick={() => { requestDeleteTask(task); setActiveMenuId(null); }}
                              style={{
                                width: '100%',
                                padding: '0.5rem 0.85rem',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontWeight: '600'
                              }}
                            >
                              Delete Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. TASK BOARD SECTION (Mini Kanban) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ color: '#6d28d9', fontWeight: '800' }}>❖</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Task Board
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              {/* To Do Column */}
              <div style={{
                background: '#ede9fe',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#4c1d95' }}>To Do</span>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ddd6fe',
                    color: '#5b21b6',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {todoTasks.length}
                  </span>
                </div>

                {todoTasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {todoTasks.map(t => (
                      <div key={t.id || t._id} style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{t.title}</h5>
                          <MoreHorizontal size={16} color="#94a3b8" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '0.15rem 0.45rem', borderRadius: '6px', background: '#ede9fe', color: '#6d28d9' }}>
                            {t.category || 'Personal'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CalendarIcon size={12} /> {formatDate(t.dueDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center', color: '#6b21a8', fontSize: '0.8rem', fontWeight: '600' }}>
                    No tasks to do
                  </div>
                )}
              </div>

              {/* In Progress Column */}
              <div style={{
                background: '#ede9fe',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#4c1d95' }}>In Progress</span>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ddd6fe',
                    color: '#5b21b6',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {inProgressTasks.length}
                  </span>
                </div>

                {inProgressTasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {inProgressTasks.map(t => (
                      <div key={t.id || t._id} style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{t.title}</h5>
                          <MoreHorizontal size={16} color="#94a3b8" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '0.15rem 0.45rem', borderRadius: '6px', background: '#ede9fe', color: '#6d28d9' }}>
                            {t.category || 'Course'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CalendarIcon size={12} /> {formatDate(t.dueDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center', color: '#6b21a8', fontSize: '0.8rem', fontWeight: '600' }}>
                    No tasks in progress
                  </div>
                )}
              </div>

              {/* Completed Column */}
              <div style={{
                background: '#f1f5f9',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '800', color: '#475569' }}>Completed</span>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#e2e8f0',
                    color: '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {completedTasks.length || 0}
                  </span>
                </div>

                {completedTasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {completedTasks.map(t => (
                      <div key={t.id || t._id} style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        border: '1px solid #f1f5f9'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', textDecoration: 'line-through', margin: 0 }}>{t.title}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '1.5rem 0.5rem',
                    color: '#94a3b8'
                  }}>
                    <Trophy size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', margin: 0 }}>
                      No completed tasks yet
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Keep going!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>


        {/* RIGHT SIDEBAR WIDGET PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* 1. CALENDAR WIDGET */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.25rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarIcon size={18} color="#6d28d9" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Calendar</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem', display: 'flex' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{currentMonthLabel}</span>
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.2rem', display: 'flex' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem', textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            {/* Dynamic Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: '600' }}>
              {currentWeekDays.map((dateObj, idx) => {
                const isToday =
                  dateObj.getDate() === todayDateObj.getDate() &&
                  dateObj.getMonth() === todayDateObj.getMonth() &&
                  dateObj.getFullYear() === todayDateObj.getFullYear();

                const hasTask = allTasks.some(t => {
                  if (!t.dueDate) return false;
                  const d = new Date(t.dueDate);
                  return (
                    d.getDate() === dateObj.getDate() &&
                    d.getMonth() === dateObj.getMonth() &&
                    d.getFullYear() === dateObj.getFullYear()
                  );
                });

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{
                      background: isToday ? '#6d28d9' : 'transparent',
                      color: isToday ? '#ffffff' : '#475569',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: isToday ? '700' : '600'
                    }}>
                      {dateObj.getDate()}
                    </span>
                    {hasTask && !isToday && (
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6d28d9', marginTop: '2px' }} />
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: '1rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '12px',
              background: '#ede9fe',
              color: '#6d28d9',
              fontSize: '0.78rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CalendarIcon size={14} /> {tasksDueThisWeekCount} task{tasksDueThisWeekCount === 1 ? '' : 's'} due this week
            </div>
          </div>

          {/* 2. PRODUCTIVITY WIDGET */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.25rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <BarChart2 size={18} color="#6d28d9" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Productivity</h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
                {allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0}%
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a' }}>+12% vs. last week</span>
            </div>

            <div style={{
              width: '100%',
              height: '8px',
              background: '#f1f5f9',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0}%`,
                height: '100%',
                background: '#6d28d9',
                borderRadius: '4px'
              }} />
            </div>
          </div>

          {/* 3. UPCOMING DEADLINES WIDGET */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.25rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#6d28d9" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Upcoming Deadlines</h4>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6d28d9', cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingUpcomingDeadlines.length > 0 ? (
                pendingUpcomingDeadlines.slice(0, 3).map((t, idx) => (
                  <div key={t.id || t._id || idx} style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    borderLeft: t.priority === 'urgent' || t.priority === 'high' ? '4px solid #ef4444' : '4px solid #16a34a'
                  }}>
                    <h5 style={{ fontSize: '0.825rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                      {t.title}
                    </h5>
                    <span style={{ fontSize: '0.72rem', color: t.priority === 'urgent' || t.priority === 'high' ? '#ef4444' : '#16a34a', fontWeight: '700' }}>
                      {formatDate(t.dueDate)} • {t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium'} Priority
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '1rem 0.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>
                  No upcoming deadlines
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
