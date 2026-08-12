import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Filter,
  Tag
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
            <CalendarIcon color="var(--accent-primary)" size={28} /> Interactive Calendar Schedule
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Track task due dates, upcoming milestones, and delivery deadlines across the month.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={today} className="btn btn-secondary btn-sm">
            Today
          </button>
          <button onClick={() => openCreateTaskModal()} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            <PlusCircle size={16} /> Schedule Task
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Main Calendar Viewport */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          {/* Calendar Header Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              {monthNames[month]} {year}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={prevMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem' }}>
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
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            marginBottom: '0.75rem'
          }}>
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.4rem'
          }}>
            {/* Empty slots for month start */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '56px', opacity: 0.2 }} />
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
                    height: '58px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.22)' : 'rgba(255,255,255,0.03)',
                    border: isSelected ? '2px solid var(--accent-primary)' : isToday ? '1px solid var(--accent-secondary)' : '1px solid rgba(255,255,255,0.05)',
                    padding: '0.35rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.825rem',
                      fontWeight: isSelected || isToday ? '800' : '600',
                      color: isToday ? 'var(--accent-secondary)' : isSelected ? '#fff' : 'var(--text-muted)'
                    }}>
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '8px',
                        background: 'var(--accent-primary)',
                        color: '#fff'
                      }}>
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Indicator Pills */}
                  <div style={{ display: 'flex', gap: '2px', overflow: 'hidden' }}>
                    {dayTasks.slice(0, 3).map(t => (
                      <div
                        key={t.id || t._id}
                        style={{
                          height: '4px',
                          flex: 1,
                          borderRadius: '2px',
                          background: t.priority === 'urgent' ? '#ef4444' : t.priority === 'high' ? '#f59e0b' : 'var(--accent-primary)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Tasks Sidebar Details */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--accent-primary)" /> Tasks Due on {monthNames[month]} {selectedDate}, {year}
          </h3>

          {selectedDayTasks.length === 0 ? (
            <div style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              color: 'var(--text-dim)',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 'var(--radius-md)'
            }}>
              <CheckCircle2 size={36} color="var(--accent-success)" style={{ opacity: 0.6, marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>No Tasks Scheduled</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>You're all clear for this date.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedDayTasks.map(task => (
                <div
                  key={task.id || task._id}
                  className="task-card-item"
                  style={{ padding: '0.9rem 1.1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span className={`badge badge-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Tag size={12} /> {task.category}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.35rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{task.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
