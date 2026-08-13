import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  Settings,
  User,
  Palette,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Camera,
  X,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Crop,
  Check,
  Search,
  Menu,
  ChevronDown,
  Lock,
  KeyRound,
  Download,
  Database,
  Trash2,
  Globe,
  Layout,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    category: '🧑‍💻 Developers',
    avatars: [
      { name: 'Alex (Tech Lead)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { name: 'Sophia (Frontend)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
      { name: 'Aiden (Backend)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden' },
      { name: 'Maria (DevOps)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
      { name: 'Felix (Fullstack)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
      { name: 'Aneka (Architect)', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' }
    ]
  },
  {
    category: '🤖 Cyber Bots',
    avatars: [
      { name: 'Matrix Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Matrix' },
      { name: 'Cyber Nova', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber' },
      { name: 'AI Core', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Techie' },
      { name: 'Byte Master', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Byte' },
      { name: 'Nexus Prime', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus' }
    ]
  },
  {
    category: '🎨 Creative & Sleek',
    avatars: [
      { name: 'Vibe Lead', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Creative' },
      { name: 'Design Pro', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Design' },
      { name: 'Clean Modern', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Modern' },
      { name: 'Focus Mode', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Focus' }
    ]
  },
  {
    category: '🦊 Animals & Fun',
    avatars: [
      { name: 'Neon Panda', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Panda' },
      { name: 'Cyber Fox', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fox' },
      { name: 'Zen Bear', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bear' },
      { name: 'Swift Owl', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Owl' }
    ]
  }
];

export const SettingsView = ({ onToggleSidebar }) => {
  const { user, updateUser, isDarkMode, isCompactView, toggleDarkMode, toggleCompactView } = useAuth();
  const { allTasks, searchQuery, setSearchQuery } = useTask();
  const fileInputRef = useRef(null);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'preferences', 'security', 'data'

  // Cropper & Zoom Modal States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Password & Security States
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Settings Form State
  const [settings, setSettings] = useState({
    displayName: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`,
    role: 'Senior Security Analyst & Lead Architect',
    timezone: '(UTC+08:00) Manila, Beijing, Singapore',
    notifications: true,
    darkMode: isDarkMode,
    compactView: isCompactView,
    autoSave: true,
    defaultView: 'dashboard'
  });

  const [customUrlInput, setCustomUrlInput] = useState('');

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.name || '',
        email: user.email || '',
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`
      }));
    }
  }, [user]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setError('Selected image is too large. Please select an image under 12MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result;
      if (base64Url) {
        setTempImageSrc(base64Url);
        setZoomLevel(1);
        setRotation(0);
        setPanPosition({ x: 0, y: 0 });
        setCropModalOpen(true);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCroppedAvatar = () => {
    if (tempImageSrc) {
      setSettings(prev => ({ ...prev, avatar: tempImageSrc }));
      setCropModalOpen(false);
      setTempImageSrc(null);
    }
  };

  const handleSave = async () => {
    setError('');

    if (!settings.displayName.trim()) {
      setError('Display name cannot be empty.');
      return;
    }

    if (!settings.email.trim() || !settings.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await updateUser({
        name: settings.displayName.trim(),
        email: settings.email.trim(),
        avatar: settings.avatar
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!passwordData.currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordMessage({ type: 'success', text: 'Password successfully updated and encrypted!' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Due Date', 'Created At'];
    const rows = allTasks.map(t => [
      t.id || t._id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.category,
      t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '',
      t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taskflow_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(allTasks, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const userName = user?.name || 'Lester';
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

  return (
    <div className="dashboard-light-theme" style={{
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#f4f6f8',
      padding: '1.5rem 1.8rem',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Top Header Bar - Fixed Sticky Position */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        marginBottom: '1.25rem',
        gap: '1rem',
        boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <button
            onClick={onToggleSidebar}
            className="header-hamburger-toggle"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Menu size={20} />
          </button>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px'
          }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.2rem',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.85rem',
                color: '#1e293b',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Right Action Icons & User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={18} color="#64748b" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#8b5cf6'
            }} />
          </div>

          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer'
              }}
            >
              <img
                src={userAvatar}
                alt={userName}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#1e1b4b'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.1 }}>
                  {userName}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '600' }}>
                  ● Online
                </span>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Title Banner Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: '1px solid #f1f5f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#ede9fe',
            color: '#6d28d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(109, 40, 217, 0.15)'
          }}>
            <Settings size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.1 }}>
              Workspace & Profile Settings
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Customize your user profile, avatar, workspace preferences, account security, and data backups.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '0.6rem 1.3rem',
            borderRadius: '10px',
            background: '#6d28d9',
            border: 'none',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(109, 40, 217, 0.25)',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save All Changes
        </button>
      </div>

      {/* Notifications / Alerts */}
      {error && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#dc2626',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {saved && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          background: '#dcfce7',
          border: '1px solid #86efac',
          color: '#16a34a',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={18} /> Settings successfully saved across your workspace!
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'profile', label: 'User Profile & Avatar', icon: User },
          { id: 'preferences', label: 'Workspace Preferences', icon: Palette },
          { id: 'security', label: 'Security & Auth', icon: Shield },
          { id: 'data', label: 'Data Export & Backup', icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: isActive ? '#6d28d9' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: USER PROFILE & AVATAR */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Avatar Management Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={18} color="#6d28d9" /> Profile Photo & Avatar
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={settings.avatar}
                  alt="Avatar Preview"
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    border: '4px solid #ede9fe',
                    boxShadow: '0 4px 14px rgba(109, 40, 217, 0.15)',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#6d28d9',
                    border: '2px solid #ffffff',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Upload Image"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{settings.displayName || userName}</h4>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{settings.email || user?.email}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '10px',
                    background: '#6d28d9',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Upload size={14} /> Upload & Crop
                </button>

                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Sparkles size={14} color="#6d28d9" /> Preset Avatars
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form Details */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#6d28d9" /> Personal Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Primary Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Professional Role / Bio
                </label>
                <input
                  type="text"
                  value={settings.role}
                  onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Workspace Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                >
                  <option value="(UTC+08:00) Manila, Beijing, Singapore">(UTC+08:00) Manila, Beijing, Singapore</option>
                  <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option value="(UTC+00:00) London, Dublin, Lisbon">(UTC+00:00) London, Dublin, Lisbon</option>
                  <option value="(UTC+09:00) Tokyo, Osaka, Seoul">(UTC+09:00) Tokyo, Osaka, Seoul</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: WORKSPACE PREFERENCES */}
      {activeTab === 'preferences' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={18} color="#6d28d9" /> Interface Customization
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Dark Theme Interface</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Enable high-contrast dark theme mode</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => toggleDarkMode(!isDarkMode)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6d28d9' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Compact Dashboard Layout</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Optimize card padding for wide screens</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.compactView}
                  onChange={() => toggleCompactView(!isCompactView)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6d28d9' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Push & Email Alerts</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Receive instant notifications for high priority tasks</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6d28d9' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Auto-Save Task Drafts</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Automatically save task edits every 30 seconds</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6d28d9' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SECURITY & AUTH */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Change Password Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={18} color="#6d28d9" /> Change Account Password
            </h3>

            {passwordMessage.text && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: passwordMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
                border: passwordMessage.type === 'error' ? '1px solid #fca5a5' : '1px solid #86efac',
                color: passwordMessage.type === 'error' ? '#dc2626' : '#16a34a',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.2rem 0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.2rem 0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '10px',
                  background: '#6d28d9',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Active Sessions & 2FA */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#6d28d9" /> Security & Session Audit
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Two-Factor Auth (2FA)</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Protect your account with Google Authenticator</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6d28d9' }}
                />
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.65rem' }}>Active Sessions</h4>
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Smartphone size={18} color="#6d28d9" />
                    <div>
                      <h5 style={{ fontSize: '0.825rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Chrome on Windows 11</h5>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>IP: 127.0.0.1 • Manila, PH</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '6px', background: '#dcfce7', color: '#16a34a' }}>
                    Active Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: DATA EXPORT & BACKUP */}
      {activeTab === 'data' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="#6d28d9" /> Export & Backup Data
            </h3>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Export your task lists, roadmap milestones, and workspace records into portable file formats.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Export Tasks to CSV</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Download spreadsheet compatible CSV spreadsheet</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '10px',
                    background: '#6d28d9',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={14} /> Download CSV
                </button>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>JSON Database Backup</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Full JSON raw dump of all task schemas</p>
                </div>
                <button
                  onClick={handleExportJSON}
                  style={{
                    padding: '0.5rem 0.95rem',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={14} /> Download JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRESET AVATARS MODAL */}
      {isAvatarModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '560px',
            border: '1px solid #e2e8f0',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Select Preset Avatar
              </h3>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            {PRESET_AVATARS.map(group => (
              <div key={group.category} style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#64748b', marginBottom: '0.65rem' }}>
                  {group.category}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: '0.65rem' }}>
                  {group.avatars.map(av => (
                    <div
                      key={av.name}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, avatar: av.url }));
                        setIsAvatarModalOpen(false);
                      }}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '12px',
                        border: settings.avatar === av.url ? '2px solid #6d28d9' : '1px solid #f1f5f9',
                        background: settings.avatar === av.url ? '#ede9fe' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <img src={av.url} alt={av.name} style={{ width: '42px', height: '42px', borderRadius: '50%' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>
                        {av.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AVATAR CROP MODAL */}
      {cropModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.75rem',
            width: '100%',
            maxWidth: '460px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Crop & Preview Avatar
              </h3>
              <button
                onClick={() => setCropModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <img
                src={tempImageSrc}
                alt="Temp Upload"
                style={{
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #6d28d9',
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setCropModalOpen(false)}
                style={{ padding: '0.6rem 1.1rem', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCroppedAvatar}
                style={{ padding: '0.6rem 1.3rem', borderRadius: '10px', background: '#6d28d9', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Apply Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
