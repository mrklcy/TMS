const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// In-memory fallback tasks store (empty by default for new users)
let inMemoryTasks = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Protect all task endpoints
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for current user with optional search & filtering
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, status, category, priority, sortBy } = req.query;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      let query = { user: userId };

      if (status && status !== 'all') {
        query.status = status;
      }
      if (category && category !== 'all') {
        query.category = category;
      }
      if (priority && priority !== 'all') {
        query.priority = priority;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sortBy === 'dueDate') sortOption = { dueDate: 1 };
      if (sortBy === 'priority') sortOption = { priority: -1 };
      if (sortBy === 'title') sortOption = { title: 1 };

      const tasks = await Task.find(query).sort(sortOption);
      return res.json(tasks);
    } else {
      // In-memory fallback: return tasks belonging to current user ID
      let userTasks = inMemoryTasks.filter(t => String(t.user) === String(userId));

      if (status && status !== 'all') {
        userTasks = userTasks.filter(t => t.status === status);
      }
      if (category && category !== 'all') {
        userTasks = userTasks.filter(t => t.category === category);
      }
      if (priority && priority !== 'all') {
        userTasks = userTasks.filter(t => t.priority === priority);
      }
      if (search) {
        const q = search.toLowerCase();
        userTasks = userTasks.filter(
          t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
        );
      }

      return res.json(userTasks);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get metrics summary (total, todo, in-progress, completed)
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const tasks = await Task.find({ user: userId });
      const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
      };
      return res.json(stats);
    } else {
      const tasks = inMemoryTasks.filter(t => String(t.user) === String(userId));
      const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
      };
      return res.json(stats);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error calculating task statistics' });
  }
});

// @route   POST /api/tasks/bulk
// @desc    Bulk create multiple tasks at once
router.post('/bulk', async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: 'No tasks provided for bulk import' });
    }

    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const tasksToCreate = tasks.map(t => ({
        user: userId,
        title: t.title,
        description: t.description || '',
        status: t.status || 'todo',
        priority: t.priority || 'medium',
        category: t.category || 'Work',
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        subtasks: t.subtasks || []
      }));
      const created = await Task.insertMany(tasksToCreate);
      return res.status(201).json(created);
    } else {
      const created = tasks.map((t, idx) => ({
        ...t,
        id: 'mem_task_' + (Date.now() + idx),
        user: userId,
        createdAt: new Date().toISOString()
      }));
      inMemoryTasks.unshift(...created);
      return res.status(201).json(created);
    }
  } catch (error) {
    console.error('Bulk task creation error:', error);
    res.status(500).json({ message: 'Failed bulk task creation', error: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, subtasks } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const task = await Task.create({
        user: userId,
        title,
        description: description || '',
        status: status || 'todo',
        priority: priority || 'medium',
        category: category || 'Work',
        dueDate: dueDate ? new Date(dueDate) : null,
        subtasks: subtasks || []
      });
      return res.status(201).json(task);
    } else {
      const newTask = {
        id: 'mem_task_' + Date.now(),
        user: userId,
        title,
        description: description || '',
        status: status || 'todo',
        priority: priority || 'medium',
        category: category || 'Work',
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        subtasks: subtasks || [],
        createdAt: new Date().toISOString()
      };
      inMemoryTasks.unshift(newTask);
      return res.status(201).json(newTask);
    }
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(id)) {
      let task = await Task.findOne({ _id: id, user: userId });
      if (!task) return res.status(404).json({ message: 'Task not found' });

      task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      return res.json(task);
    } else {
      const index = inMemoryTasks.findIndex(t => t.id === id);
      if (index === -1) return res.status(404).json({ message: 'Task not found' });

      inMemoryTasks[index] = {
        ...inMemoryTasks[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      return res.json(inMemoryTasks[index]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Quick toggle status (e.g. todo/in-progress <-> completed)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(id)) {
      const task = await Task.findOne({ _id: id, user: userId });
      if (!task) return res.status(404).json({ message: 'Task not found' });

      task.status = task.status === 'completed' ? 'todo' : 'completed';
      await task.save();
      return res.json(task);
    } else {
      const index = inMemoryTasks.findIndex(t => t.id === id);
      if (index === -1) return res.status(404).json({ message: 'Task not found' });

      const currentStatus = inMemoryTasks[index].status;
      inMemoryTasks[index].status = currentStatus === 'completed' ? 'todo' : 'completed';
      return res.json(inMemoryTasks[index]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling task status' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(id)) {
      const task = await Task.findOneAndDelete({ _id: id, user: userId });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      return res.json({ message: 'Task removed successfully', id });
    } else {
      const index = inMemoryTasks.findIndex(t => t.id === id);
      if (index === -1) return res.status(404).json({ message: 'Task not found' });

      inMemoryTasks = inMemoryTasks.filter(t => t.id !== id);
      return res.json({ message: 'Task removed successfully', id });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
