import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const initialMockTasks = [
  {
    id: 'task_101',
    title: '🚀 Launch Marketing Campaign for TaskFlow',
    description: 'Prepare landing page graphics, social media announcements, and newsletter copy.',
    status: 'in-progress',
    priority: 'urgent',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    subtasks: [
      { id: 'st_1', title: 'Write launch blog post', completed: true },
      { id: 'st_2', title: 'Design Twitter/X promo banners', completed: true },
      { id: 'st_3', title: 'Setup email drip sequence', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_102',
    title: '⚡ Optimize MongoDB Aggregation Queries',
    description: 'Index user_id and status fields to improve task dashboard load times.',
    status: 'todo',
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    subtasks: [
      { id: 'st_4', title: 'Run database explain plan', completed: false },
      { id: 'st_5', title: 'Add composite compound indexes', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_103',
    title: '🎨 Rebrand UI Theme with Glassmorphism',
    description: 'Implement vibrant color palettes, dark mode blurs, and animated micro-interactions.',
    status: 'completed',
    priority: 'medium',
    category: 'Ideas',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'st_6', title: 'Define HSL CSS token variables', completed: true },
      { id: 'st_7', title: 'Build responsive modal components', completed: true }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_104',
    title: '📑 Weekly Team Sync & Backlog Refinement',
    description: 'Discuss sprint velocity, unblock dependencies, and assign tickets.',
    status: 'todo',
    priority: 'low',
    category: 'Project',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    subtasks: [],
    createdAt: new Date().toISOString()
  }
];

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Security Delete Confirmation Modal State
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const serverTasks = await api.getTasks({
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
        priority: priorityFilter
      });
      if (Array.isArray(serverTasks)) {
        setTasks(serverTasks);
      }
    } catch (err) {
      console.warn('Using local tasks state');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calculated Statistics
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
    completionRate: tasks.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  // Filtered tasks logic for UI rendering
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Task CRUD operations
  const createTask = async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      const created = res || {
        ...taskData,
        id: 'task_' + Date.now(),
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [created, ...prev]);
    } catch (err) {
      const fallback = {
        ...taskData,
        id: 'task_' + Date.now(),
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [fallback, ...prev]);
    }
    closeTaskModal();
  };

  const bulkCreateTasks = async (tasksArray) => {
    try {
      const res = await api.bulkCreateTasks(tasksArray);
      if (Array.isArray(res)) {
        setTasks(prev => [...res, ...prev]);
      }
    } catch (err) {
      const createdFallback = tasksArray.map((t, idx) => ({
        ...t,
        id: 'task_' + (Date.now() + idx),
        createdAt: new Date().toISOString()
      }));
      setTasks(prev => [...createdFallback, ...prev]);
    }
    closeTaskModal();
  };

  const updateTask = async (id, updatedData) => {
    try {
      await api.updateTask(id, updatedData);
    } catch (err) {
      console.warn('API update failed, updating locally');
    }
    setTasks(prev =>
      prev.map(t => (t.id === id || t._id === id ? { ...t, ...updatedData } : t))
    );
    closeTaskModal();
  };

  const updateTaskStatus = async (id, newStatus) => {
    setTasks(prev =>
      prev.map(t => (t.id === id || t._id === id ? { ...t, status: newStatus } : t))
    );
    try {
      await api.updateTask(id, { status: newStatus });
    } catch (e) {}
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId || task._id === taskId) {
          const updatedSubtasks = (task.subtasks || []).map(st =>
            st.id === subtaskId || st._id === subtaskId
              ? { ...st, completed: !st.completed }
              : st
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  const requestDeleteTask = (task) => {
    setTaskToDelete(task);
    setConfirmDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete.id || taskToDelete._id;
    setTasks(prev => prev.filter(t => t.id !== id && t._id !== id));
    try {
      await api.deleteTask(id);
    } catch (e) {}
    setConfirmDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const cancelDeleteTask = () => {
    setConfirmDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id && t._id !== id));
    try {
      await api.deleteTask(id);
    } catch (e) {}
  };

  const openCreateTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        allTasks: tasks,
        stats,
        loading,
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
        isTaskModalOpen,
        editingTask,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        createTask,
        bulkCreateTasks,
        updateTask,
        updateTaskStatus,
        toggleSubtask,
        deleteTask,
        confirmDeleteModalOpen,
        taskToDelete,
        requestDeleteTask,
        confirmDeleteTask,
        cancelDeleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
