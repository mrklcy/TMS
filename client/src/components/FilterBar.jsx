import React from 'react';
import { useTask } from '../context/TaskContext';
import { Search, Plus, Kanban, ListFilter, Download, Filter, RotateCcw, X } from 'lucide-react';
import { exportTasksToCSV } from '../utils/exportUtils';

export const FilterBar = () => {
  const {
    tasks,
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

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
      {/* ROW 1: Main Search & Action Controls */}
      <div className="filter-bar-row1">
        {/* Search Input Box */}
        <div className="filter-bar-search">
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            maxLength={100}
            placeholder="Search workspace tasks..."
            style={{ paddingLeft: '2.6rem', paddingRight: searchQuery ? '2.2rem' : '1rem' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Action Controls Group */}
        <div className="filter-bar-actions">
          {/* Export CSV button */}
          <button
            onClick={() => exportTasksToCSV(tasks)}
            className="btn btn-secondary btn-sm btn-export-csv"
            style={{ gap: '0.4rem', padding: '0.55rem 0.9rem', fontSize: '0.825rem' }}
            title="Export Tasks to CSV Spreadsheet"
          >
            <Download size={15} color="var(--accent-success)" /> Export CSV
          </button>

          {/* View Mode Switcher */}
          <div className="view-mode-toggle" style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('kanban')}
              className={`btn btn-sm ${viewMode === 'kanban' ? 'btn-primary' : ''}`}
              style={{
                background: viewMode === 'kanban' ? 'var(--accent-primary)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                gap: '0.35rem'
              }}
              title="Kanban Board View"
            >
              <Kanban size={15} /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
              style={{
                background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                gap: '0.35rem'
              }}
              title="Table List View"
            >
              <ListFilter size={15} /> List
            </button>
          </div>

          {/* New Task Button */}
          <button
            onClick={openCreateTaskModal}
            className="btn btn-primary btn-new-task"
            style={{ gap: '0.45rem', padding: '0.55rem 1.15rem', fontSize: '0.875rem', fontWeight: '700' }}
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* ROW 2: Filter Toolbar Dropdowns */}
      <div className="filter-bar-row2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.825rem', fontWeight: '700', flexShrink: 0 }}>
          <Filter size={15} color="var(--accent-primary)" /> Filter By:
        </div>

        <div className="filter-bar-dropdowns">
          {/* Category Selector */}
          <select
            className="form-select select-category"
            style={{ width: 'auto', minWidth: '135px', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
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
            className="form-select select-priority"
            style={{ width: 'auto', minWidth: '135px', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            {priorities.map(prio => (
              <option key={prio} value={prio}>
                Priority: {prio.charAt(0).toUpperCase() + prio.slice(1)}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            className="form-select select-status"
            style={{ width: 'auto', minWidth: '135px', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
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

        {/* Reset Filters Link */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="btn btn-reset-filters"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--accent-danger)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-sm)',
              gap: '0.35rem',
              marginLeft: 'auto'
            }}
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
