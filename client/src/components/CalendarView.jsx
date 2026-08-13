import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  PlusCircle,
  Tag,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CalendarView = () => {
  const { tasks, openCreateTaskModal } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

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
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', label: 'HIGH' };
      case 'medium':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', label: 'MEDIUM' };
      case 'low':
      default:
        return { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', label: 'LOW' };
    }
  };

  return (
    <div style={{
      padding: '1.75rem 2rem',
      color: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'rgba(21, 10, 48, 0.65)',
        backdropFilter: 'blur(16px)',
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#ffffff', margin: 0 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)'
            }}>
              <CalendarIcon color="#ffffff" size={20} />
            </div>
            Interactive Calendar Schedule
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem', margin: 0 }}>
            Track task due dates, upcoming milestones, and delivery deadlines across the month.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={today}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
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
              background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(109, 40, 217, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <PlusCircle size={16} /> Schedule Task
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        
        {/* LEFT COLUMN: Main Calendar Viewport */}
        <div style={{
          background: 'rgba(21, 10, 48, 0.65)',
          backdropFilter: 'blur(16px)',
          padding: '1.5rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Calendar Header Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              {monthNames[month]} {year}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={prevMonth}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
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
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
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
            color: '#a78bfa',
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
                      ? 'linear-gradient(135deg, rgba(109, 40, 217, 0.35), rgba(124, 58, 237, 0.25))'
                      : isToday
                      ? 'rgba(139, 92, 246, 0.12)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected
                      ? '2px solid #8b5cf6'
                      : isToday
                      ? '1px solid rgba(139, 92, 246, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '0.4rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: isSelected || isToday ? '800' : '600',
                      color: isSelected ? '#ffffff' : isToday ? '#a78bfa' : '#cbd5e1'
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
                        color: '#ffffff',
                        boxShadow: '0 2px 6px rgba(109, 40, 217, 0.4)'
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
                          background: t.priority === 'urgent' || t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#3b82f6' : '#22c55e'
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
          background: 'rgba(21, 10, 48, 0.65)',
          backdropFilter: 'blur(16px)',
          padding: '1.5rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#a78bfa" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Tasks Due on {monthNames[month]} {selectedDate}, {year}
              </h3>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#c4b5fd',
              border: '1px solid rgba(139, 92, 246, 0.3)'
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
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '14px',
              border: '1px dashed rgba(255, 255, 255, 0.08)'
            }}>
              <CheckCircle2 size={42} color="#4ade80" style={{ opacity: 0.8, marginBottom: '0.75rem' }} />
              <h4 style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                No Tasks Scheduled
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '0.35rem', margin: 0 }}>
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
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderLeft: `4px solid ${prio.color}`,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '8px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        letterSpacing: '0.04em',
                        background: prio.bg,
                        color: prio.color,
                        border: prio.border
                      }}>
                        {prio.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Tag size={12} color="#a78bfa" /> {task.category || 'Work'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', margin: 0, lineHeight: '1.3' }}>
                      {task.title}
                    </h4>

                    {task.description && (
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.4rem', margin: 0, lineHeight: '1.4' }}>
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
