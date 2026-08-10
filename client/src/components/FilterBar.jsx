import React from 'react';
import { useTask } from '../context/TaskContext';
import { Search, Plus, Kanban, ListFilter, SlidersHorizontal } from 'lucide-react';

export const FilterBar = () => {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    openCreateTaskModal
  } = useTask();

  const categories = ['all', 'Work', 'Personal', 'Ideas', 'Urgent', 'Project'];
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left Side: Search & Select Dropdowns */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search tasks..."
              style={{ paddingLeft: '2.4rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Selector */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                Category: {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Priority Selector */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            {priorities.map(prio => (
              <option key={prio} value={prio}>
                Priority: {prio.charAt(0).toUpperCase() + prio.slice(1)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '130px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statuses.map(st => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side: View Toggles & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : ''}`}
              style={{
                background: viewMode === 'kanban' ? 'var(--accent-primary)' : 'transparent',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Kanban Board View"
            >
              <Kanban size={16} /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
              style={{
                background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Table List View"
            >
              <ListFilter size={16} /> List
            </button>
          </div>

          {/* New Task Button */}
          <button
            onClick={openCreateTaskModal}
            className="btn btn-primary"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>
    </div>
  );
};
