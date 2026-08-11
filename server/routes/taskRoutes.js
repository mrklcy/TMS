const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// In-memory fallback tasks store (empty by default for new users)
let inMemoryTasks = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Protect all task endpoints (OWASP A01: Broken Access Control Enforcement)
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
      if (search && typeof search === 'string') {
        // OWASP A03: Escape regex special characters to prevent regex Denial of Service (ReDoS)
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.$or = [
          { title: { $regex: escapedSearch, $options: 'i' } },
          { description: { $regex: escapedSearch, $options: 'i' } }
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
      if (search && typeof search === 'string') {
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

    if (tasks.length > 50) {
      return res.status(400).json({ message: 'Bulk creation limit exceeded (max 50 tasks)' });
    }

    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const tasksToCreate = tasks.map(t => ({
        user: userId,
        title: String(t.title || 'Untitled Task').substring(0, 200),
        description: String(t.description || '').substring(0, 2000),
        status: ['todo', 'in-progress', 'completed'].includes(t.status) ? t.status : 'todo',
        priority: ['low', 'medium', 'high', 'urgent'].includes(t.priority) ? t.priority : 'medium',
        category: String(t.category || 'Work').substring(0, 50),
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        subtasks: Array.isArray(t.subtasks) ? t.subtasks.slice(0, 20) : []
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

    if (!title || String(title).trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const sanitizedTitle = String(title).substring(0, 200);
    const sanitizedDescription = String(description || '').substring(0, 2000);
    const sanitizedCategory = String(category || 'Work').substring(0, 50);

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const task = await Task.create({
        user: userId,
        title: sanitizedTitle,
        description: sanitizedDescription,
        status: ['todo', 'in-progress', 'completed'].includes(status) ? status : 'todo',
        priority: ['low', 'medium', 'high', 'urgent'].includes(priority) ? priority : 'medium',
        category: sanitizedCategory,
        dueDate: dueDate ? new Date(dueDate) : null,
        subtasks: Array.isArray(subtasks) ? subtasks.slice(0, 20) : []
      });
      return res.status(201).json(task);
    } else {
      const newTask = {
        id: 'mem_task_' + Date.now(),
        user: userId,
        title: sanitizedTitle,
        description: sanitizedDescription,
        status: status || 'todo',
        priority: priority || 'medium',
        category: sanitizedCategory,
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
// @desc    Update task details (OWASP A01 & Mass Assignment Protection)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(id)) {
      const { title, description, status, priority, category, dueDate, subtasks } = req.body;
      
      const updatedFields = {};
      if (title !== undefined) updatedFields.title = String(title).substring(0, 200);
      if (description !== undefined) updatedFields.description = String(description).substring(0, 2000);
      if (status !== undefined && ['todo', 'in-progress', 'completed'].includes(status)) updatedFields.status = status;
      if (priority !== undefined && ['low', 'medium', 'high', 'urgent'].includes(priority)) updatedFields.priority = priority;
      if (category !== undefined) updatedFields.category = String(category).substring(0, 50);
      if (dueDate !== undefined) updatedFields.dueDate = dueDate ? new Date(dueDate) : null;
      if (subtasks !== undefined && Array.isArray(subtasks)) updatedFields.subtasks = subtasks.slice(0, 20);

      const task = await Task.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: updatedFields },
        { new: true, runValidators: true }
      );

      if (!task) return res.status(404).json({ message: 'Task not found or access denied' });
      return res.json(task);
    } else {
      const index = inMemoryTasks.findIndex(t => t.id === id && String(t.user) === String(userId));
      if (index === -1) return res.status(404).json({ message: 'Task not found or access denied' });

      const { title, description, status, priority, category, dueDate, subtasks } = req.body;
      const updatedFields = {};
      if (title !== undefined) updatedFields.title = String(title).substring(0, 200);
      if (description !== undefined) updatedFields.description = String(description).substring(0, 2000);
      if (status !== undefined && ['todo', 'in-progress', 'completed'].includes(status)) updatedFields.status = status;
      if (priority !== undefined && ['low', 'medium', 'high', 'urgent'].includes(priority)) updatedFields.priority = priority;
      if (category !== undefined) updatedFields.category = String(category).substring(0, 50);
      if (dueDate !== undefined) updatedFields.dueDate = dueDate ? new Date(dueDate).toISOString() : null;
      if (subtasks !== undefined && Array.isArray(subtasks)) updatedFields.subtasks = subtasks.slice(0, 20);

      inMemoryTasks[index] = {
        ...inMemoryTasks[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      return res.json(inMemoryTasks[index]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Quick toggle status
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
      const index = inMemoryTasks.findIndex(t => t.id === id && String(t.user) === String(userId));
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
// @desc    Delete a task (OWASP A01 Ownership Validation)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(id)) {
      const task = await Task.findOneAndDelete({ _id: id, user: userId });
      if (!task) return res.status(404).json({ message: 'Task not found or access denied' });
      return res.json({ message: 'Task removed successfully', id });
    } else {
      const index = inMemoryTasks.findIndex(t => t.id === id && String(t.user) === String(userId));
      if (index === -1) return res.status(404).json({ message: 'Task not found or access denied' });

      inMemoryTasks = inMemoryTasks.filter(t => t.id !== id);
      return res.json({ message: 'Task removed successfully', id });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
