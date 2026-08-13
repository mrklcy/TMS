import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  PlusCircle,
  Tag,
  Search,
  Bell,
  Menu,
  ChevronDown
} from 'lucide-react';

export const CalendarView = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { tasks, openCreateTaskModal, searchQuery, setSearchQuery } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now.getDate());
  };

  // Group tasks by day
  const getTasksForDay = (day) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const selectedDayTasks = getTasksForDay(selectedDate);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return { bg: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', label: 'High' };
      case 'medium':
        return { bg: '#e0f2fe', color: '#0284c7', border: '1px solid #7dd3fc', label: 'Medium' };
      case 'low':
      default:
        return { bg: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', label: 'Low' };
    }
  };

  const userName = user?.name || 'Lester';
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-light-theme" style={{
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f4f6f8',
      padding: isMobileScreen ? '1rem 0.85rem' : '1.5rem 1.8rem',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Header Bar - Fixed Sticky Position (Matching Dashboard) */}
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

      {/* Hero Title Card (Matching Dashboard Light Banner) */}
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
            <CalendarIcon size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
              Interactive Calendar Schedule
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Track task due dates, upcoming milestones, and delivery deadlines across the month.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={today}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Today
          </button>

          <button
            onClick={() => openCreateTaskModal()}
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
            <PlusCircle size={16} /> Schedule Task
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobileScreen ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* LEFT COLUMN: Main Calendar Viewport */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          {/* Calendar Header Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {monthNames[month]} {year}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={prevMonth}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextMonth}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontWeight: '700',
            fontSize: '0.78rem',
            letterSpacing: '0.05em',
            color: '#64748b',
            marginBottom: '0.85rem'
          }}>
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.45rem'
          }}>
            {/* Empty slots for month start */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '62px', opacity: 0.15 }} />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayTasks = getTasksForDay(day);
              const isSelected = selectedDate === day;
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(day)}
                  style={{
                    height: '62px',
                    borderRadius: '12px',
                    background: isSelected
                      ? '#ede9fe'
                      : isToday
                      ? '#f0fdf4'
                      : '#ffffff',
                    border: isSelected
                      ? '2px solid #6d28d9'
                      : isToday
                      ? '1px solid #22c55e'
                      : '1px solid #f1f5f9',
                    padding: '0.4rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 2px 8px rgba(109, 40, 217, 0.15)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: isSelected || isToday ? '800' : '600',
                      color: isSelected ? '#6d28d9' : isToday ? '#16a34a' : '#1e293b'
                    }}>
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '10px',
                        background: '#6d28d9',
                        color: '#ffffff'
                      }}>
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Indicator Lines */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {dayTasks.slice(0, 3).map((t, tIdx) => (
                      <div
                        key={t.id || t._id || tIdx}
                        style={{
                          height: '4px',
                          flex: 1,
                          borderRadius: '2px',
                          background: t.priority === 'urgent' || t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#0284c7' : '#16a34a'
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Day Tasks Detail Panel */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#6d28d9" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Tasks Due on {monthNames[month]} {selectedDate}, {year}
              </h3>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              background: '#ede9fe',
              color: '#6d28d9'
            }}>
              {selectedDayTasks.length} task{selectedDayTasks.length === 1 ? '' : 's'}
            </span>
          </div>

          {selectedDayTasks.length === 0 ? (
            <div style={{
              flex: 1,
              minHeight: '240px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2rem 1rem',
              color: '#94a3b8',
              background: '#f8fafc',
              borderRadius: '14px',
              border: '1px dashed #e2e8f0'
            }}>
              <CheckCircle2 size={42} color="#16a34a" style={{ opacity: 0.8, marginBottom: '0.75rem' }} />
              <h4 style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>
                No Tasks Scheduled
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.35rem', margin: 0 }}>
                You're all clear for {monthNames[month]} {selectedDate}.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {selectedDayTasks.map(task => {
                const prio = getPriorityStyle(task.priority);
                return (
                  <div
                    key={task.id || task._id}
                    style={{
                      padding: '1rem 1.15rem',
                      background: '#f8fafc',
                      borderRadius: '14px',
                      border: '1px solid #f1f5f9',
                      borderLeft: `4px solid ${prio.color}`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '8px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        background: prio.bg,
                        color: prio.color
                      }}>
                        {prio.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Tag size={12} color="#6d28d9" /> {task.category || 'Work'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0, lineHeight: '1.3' }}>
                      {task.title}
                    </h4>

                    {task.description && (
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem', margin: 0, lineHeight: '1.4' }}>
                        {task.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
