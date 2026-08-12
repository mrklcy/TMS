const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('tms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth Services
  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        // Fallback for standalone frontend dev without backend running
        const mockUser = {
          id: 'mem_' + Date.now(),
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        return { user: mockUser, token: mockToken };
      }
      throw err;
    }
  },

  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        // Fallback demo account
        const name = email.split('@')[0] || 'Demo User';
        const mockUser = {
          id: 'mem_demo',
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
        };
        const mockToken = 'mock_jwt_token_demo';
        return { user: mockUser, token: mockToken };
      }
      throw err;
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Session expired');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      return data;
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        return {
          id: profileData.id || 'mem_user',
          name: profileData.name,
          email: profileData.email,
          avatar: profileData.avatar
        };
      }
      throw err;
    }
  },

  // Task Services
  async getTasks(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/tasks?${query}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
      return data;
    } catch (err) {
      console.warn('API getTasks fallback:', err.message);
      return null;
    }
  },

  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/tasks/stats`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
      return data;
    } catch (err) {
      return null;
    }
  },

  async createTask(taskData) {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create task');
      return data;
    } catch (err) {
      throw err;
    }
  },

  async bulkCreateTasks(tasksArray) {
    try {
      const res = await fetch(`${API_BASE}/tasks/bulk`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tasks: tasksArray })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to bulk create tasks');
      return data;
    } catch (err) {
      throw err;
    }
  },

  async updateTask(id, taskData) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update task');
      return data;
    } catch (err) {
      throw err;
    }
  },

  async toggleTaskStatus(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to toggle status');
      return data;
    } catch (err) {
      throw err;
    }
  },

  async deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete task');
      return data;
    } catch (err) {
      throw err;
    }
  }
};
