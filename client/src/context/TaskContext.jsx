import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const initialMockTasks = [
  {
    id: 'task_101',
    title: 'Finish HCI and Design Thinking Report',
    description: 'MotorPH Course • Design Prototype',
    status: 'in-progress',
    priority: 'high',
    category: 'MotorPH Course • Design Prototype',
    dueDate: '2025-05-29',
    subtasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_102',
    title: 'Study Task Management Best Practices',
    description: 'Personal • Learning',
    status: 'todo',
    priority: 'medium',
    category: 'Personal • Learning',
    dueDate: '2025-05-30',
    subtasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_103',
    title: 'LAB: Web Security Assessment',
    description: 'IT Security • Parrot OS',
    status: 'in-progress',
    priority: 'medium',
    category: 'IT Security • Parrot OS',
    dueDate: '2025-05-28',
    subtasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_104',
    title: 'Read Manga / Manhwa',
    description: 'Personal • Relaxation',
    status: 'todo',
    priority: 'low',
    category: 'Personal • Relaxation',
    dueDate: '2025-05-31',
    subtasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_105',
    title: 'Practice Guitar',
    description: 'Hobbies • Music',
    status: 'todo',
    priority: 'low',
    category: 'Hobbies • Music',
    dueDate: '2025-06-01',
    subtasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_106',
    title: 'Read UX Design Principles',
    description: 'Learning',
    status: 'todo',
    priority: 'low',
    category: 'Learning',
    dueDate: '2025-05-31',
    subtasks: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_107',
    title: 'Organize Study Notes',
    description: 'Personal',
    status: 'todo',
    priority: 'medium',
    category: 'Personal',
    dueDate: '2025-05-30',
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
