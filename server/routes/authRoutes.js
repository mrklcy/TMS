const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/authMiddleware');

// In-memory fallback store if MongoDB isn't connected
const inMemoryUsers = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      });

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '30d'
      });

      return res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        token
      });
    } else {
      // In-Memory Fallback
      const existing = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const newUser = {
        id: 'mem_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date()
      };
      inMemoryUsers.push(newUser);

      const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, {
        expiresIn: '30d'
      });

      return res.status(201).json({
        user: { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar },
        token
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '30d'
      });

      return res.json({
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        token
      });
    } else {
      // In-Memory Fallback
      const user = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: '30d'
      });

      return res.json({
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
        token
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile (name, email, avatar)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: trimmedEmail, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email address is already in use by another account' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.name = trimmedName;
      user.email = trimmedEmail;
      if (avatar !== undefined) user.avatar = avatar;

      await user.save();

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
    } else {
      const existingUser = inMemoryUsers.find(u => u.email === trimmedEmail && u.id !== req.user.id);
      if (existingUser) {
        return res.status(400).json({ message: 'Email address is already in use by another account' });
      }

      const userIndex = inMemoryUsers.findIndex(u => u.id === req.user.id);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      inMemoryUsers[userIndex].name = trimmedName;
      inMemoryUsers[userIndex].email = trimmedEmail;
      if (avatar !== undefined) inMemoryUsers[userIndex].avatar = avatar;

      const updatedUser = inMemoryUsers[userIndex];
      return res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
});

// @route   GET /api/auth/users
// @desc    Get list of all registered users
router.get('/users', async (req, res) => {
  try {
    if (isDbConnected()) {
      const users = await User.find().select('-password');
      return res.json({ count: users.length, mode: 'MongoDB Atlas', users });
    } else {
      const users = inMemoryUsers.map(u => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar, createdAt: u.createdAt }));
      return res.json({ count: users.length, mode: 'In-Memory Fallback Store', users });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
