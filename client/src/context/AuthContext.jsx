import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tms_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('tms_token');
      const savedUser = localStorage.getItem('tms_user');

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error('Error parsing user data');
          }
        }
        // Try fetching fresh profile from backend
        const profile = await api.getMe();
        if (profile) {
          setUser(profile);
          localStorage.setItem('tms_user', JSON.stringify(profile));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('tms_token', data.token);
    localStorage.setItem('tms_user', JSON.stringify(data.user));
    setIsAuthModalOpen(false);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await api.register(name, email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('tms_token', data.token);
    localStorage.setItem('tms_user', JSON.stringify(data.user));
    setIsAuthModalOpen(false);
    return data.user;
  };

  const logout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tms_token');
    localStorage.removeItem('tms_user');
    setIsLogoutConfirmOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const updateUser = async (updatedData) => {
    const updated = await api.updateProfile(updatedData);
    const newUserData = { ...user, ...updated };
    setUser(newUserData);
    localStorage.setItem('tms_user', JSON.stringify(newUserData));
    return newUserData;
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tms_theme');
    return saved ? saved === 'dark' : true;
  });

  const [isCompactView, setIsCompactView] = useState(() => {
    const saved = localStorage.getItem('tms_compact');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tms_theme', theme);
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-compact', isCompactView ? 'true' : 'false');
    localStorage.setItem('tms_compact', isCompactView ? 'true' : 'false');
  }, [isCompactView]);

  const toggleDarkMode = (val) => {
    setIsDarkMode(prev => (typeof val === 'boolean' ? val : !prev));
  };

  const toggleCompactView = (val) => {
    setIsCompactView(prev => (typeof val === 'boolean' ? val : !prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        isLogoutConfirmOpen,
        isDarkMode,
        isCompactView,
        toggleDarkMode,
        toggleCompactView,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
        logout,
        confirmLogout,
        cancelLogout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
