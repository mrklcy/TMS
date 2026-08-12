import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
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
  Check
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

export const SettingsView = () => {
  const { user, updateUser, isDarkMode, isCompactView, toggleDarkMode, toggleCompactView } = useAuth();
  const fileInputRef = useRef(null);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Cropper & Zoom Modal States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [settings, setSettings] = useState({
    displayName: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`,
    notifications: true,
    darkMode: isDarkMode,
    compactView: isCompactView
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

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: isDarkMode,
      compactView: isCompactView
    }));
  }, [isDarkMode, isCompactView]);

  const handleTogglePreference = (key) => {
    if (key === 'darkMode') {
      const nextVal = !settings.darkMode;
      setSettings(prev => ({ ...prev, darkMode: nextVal }));
      toggleDarkMode(nextVal);
    } else if (key === 'compactView') {
      const nextVal = !settings.compactView;
      setSettings(prev => ({ ...prev, compactView: nextVal }));
      toggleCompactView(nextVal);
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

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
    reader.onerror = () => {
      setError('Failed to read selected image file.');
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  // Dragging handlers for crop preview canvas
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panPosition.x,
        y: e.touches[0].clientY - panPosition.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Crop & Export High-Res Canvas Image Result
  const handleCropSave = () => {
    if (!tempImageSrc) return;

    const img = new window.Image();
    img.src = tempImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 320;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, size, size);
      ctx.save();

      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoomLevel, zoomLevel);

      const aspect = img.width / img.height;
      let drawW = size;
      let drawH = size;
      if (aspect > 1) {
        drawW = size * aspect;
      } else {
        drawH = size / aspect;
      }

      ctx.drawImage(
        img,
        -drawW / 2 + panPosition.x / zoomLevel,
        -drawH / 2 + panPosition.y / zoomLevel,
        drawW,
        drawH
      );

      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/png', 0.92);
      setSettings(prev => ({ ...prev, avatar: croppedDataUrl }));
      setCropModalOpen(false);
      setIsAvatarModalOpen(false);
      setTempImageSrc(null);
    };
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

  const handleSelectAvatar = (url) => {
    setSettings(prev => ({ ...prev, avatar: url }));
    setIsAvatarModalOpen(false);
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setSettings(prev => ({ ...prev, avatar: customUrlInput.trim() }));
      setCustomUrlInput('');
      setIsAvatarModalOpen(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Settings color="var(--accent-primary)" size={28} /> Workspace Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Customize your profile, profile avatar, preferences, and account security.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.9rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {saved && (
        <div style={{
          padding: '0.9rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>Profile & settings updated successfully across your workspace!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Profile Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--accent-primary)" /> User Profile & Avatar
          </h3>

          {/* Avatar Selector Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '1.5rem'
          }}>
            {/* Click Avatar to Upload File directly */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'relative',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Click to browse & crop photo from your device"
            >
              <div style={{
                padding: '3px',
                background: 'var(--gradient-primary)',
                borderRadius: '50%',
                display: 'inline-block',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}>
                <img
                  src={settings.avatar}
                  alt={settings.displayName}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: '#1e293b',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.displayName || 'User'}`;
                  }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                background: 'var(--accent-primary)',
                color: '#fff',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}>
                <Camera size={13} />
              </div>
            </div>

            <div>
              <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{settings.displayName || 'User'}</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>{settings.email || 'No email set'}</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
                >
                  <Upload size={14} /> Upload & Crop
                </button>

                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
                >
                  <Sparkles size={14} /> Presets
                </button>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              maxLength={50}
              placeholder="e.g. Alex Rivera"
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              maxLength={100}
              placeholder="e.g. alex@company.com"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
        </div>

        {/* Preferences & Security Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} color="var(--accent-secondary)" /> Workspace Preferences
          </h3>

          {[
            { key: 'darkMode', label: 'Dark Theme Interface', desc: 'Enable ultra-sleek dark theme aesthetic', icon: <Palette size={16} color="#818cf8" /> },
            { key: 'notifications', label: 'Push & Activity Alerts', desc: 'Receive notifications for high priority tasks', icon: <Bell size={16} color="#fbbf24" /> },
            { key: 'compactView', label: 'Compact Dashboard Layout', desc: 'Optimize UI density for wide monitor screens', icon: <Settings size={16} color="#38bdf8" /> }
          ].map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.1rem' }}>{item.label}</p>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>{item.desc}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                onClick={() => handleTogglePreference(item.key)}
                style={{
                  width: '46px',
                  height: '24px',
                  borderRadius: '12px',
                  background: settings[item.key] ? 'var(--accent-primary)' : 'rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  marginLeft: '1rem'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '3px',
                  left: settings[item.key] ? '25px' : '3px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }} />
              </div>
            </div>
          ))}

          {/* Security Info Banner */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Shield size={16} color="#818cf8" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#818cf8' }}>OWASP-Hardened Security</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Your profile changes are protected with encrypted JWT headers, NoSQL query sanitization, and rate-limiting middleware.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary"
          style={{
            padding: '0.8rem 2.25rem',
            fontSize: '0.95rem',
            fontWeight: '700',
            minWidth: '170px'
          }}
        >
          {loading ? (
            <><Loader2 className="spinner" size={18} /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 size={18} /> Saved!</>
          ) : (
            <><Save size={18} /> Save Changes</>
          )}
        </button>
      </div>

      {/* Interactive Photo Crop & Zoom Editor Modal */}
      {cropModalOpen && tempImageSrc && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 8, 16, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), var(--shadow-glow)',
            border: '1px solid var(--border-glow)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.2rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Crop size={20} color="var(--accent-primary)" /> Crop & Adjust Profile Photo
              </h3>
              <button
                onClick={() => setCropModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Crop Viewport */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              
              {/* Interactive Crop Mask Frame */}
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  width: '260px',
                  height: '260px',
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#090d16',
                  border: '3px solid var(--accent-primary)',
                  boxShadow: '0 0 35px rgba(99, 102, 241, 0.45)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                  touchAction: 'none'
                }}
              >
                {/* Image to be zoomed/panned */}
                <img
                  src={tempImageSrc}
                  alt="Crop Preview"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    maxWidth: 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translate(-50%, -50%) translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    pointerEvents: 'none'
                  }}
                />

                {/* Alignment Grid Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  border: '1px dashed rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%'
                }} />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '-0.2rem' }}>
                <Move size={14} color="var(--accent-primary)" /> Click & drag image to reposition face
              </p>

              {/* Zoom & Rotation Controls */}
              <div style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                {/* Zoom Slider Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(1, +(prev - 0.15).toFixed(2)))}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>

                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      accentColor: 'var(--accent-primary)',
                      cursor: 'pointer'
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(3, +(prev + 0.15).toFixed(2)))}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>

                  <span style={{ fontSize: '0.825rem', fontWeight: '700', minWidth: '45px', textAlign: 'right', color: 'var(--accent-primary)' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                </div>

                {/* Additional Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setRotation(prev => (prev + 90) % 360)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.4rem' }}
                  >
                    <RotateCw size={14} /> Rotate 90°
                  </button>

                  <button
                    type="button"
                    onClick={() => { setZoomLevel(1); setPanPosition({ x: 0, y: 0 }); setRotation(0); }}
                    className="btn"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem', color: 'var(--text-muted)', background: 'transparent' }}
                  >
                    Reset Zoom
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <button
                onClick={() => setCropModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.25rem' }}
              >
                Cancel
              </button>

              <button
                onClick={handleCropSave}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.5rem', gap: '0.45rem', fontWeight: '700' }}
              >
                <Check size={18} /> Apply & Crop Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="var(--accent-primary)" /> Choose Your Profile Avatar
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Upload your local photo or pick from preset developer avatars.
                </p>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {/* Local File Upload Banner inside Modal */}
              <div style={{
                padding: '1.1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px dashed rgba(99, 102, 241, 0.3)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Upload size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.1rem' }}>Upload Image from Device</p>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>Select PNG, JPG, WebP, or SVG from your files</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.5rem 1.1rem', gap: '0.4rem' }}
                >
                  <ImageIcon size={15} /> Browse Files
                </button>
              </div>

              {/* Category Tabs */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                paddingBottom: '0.75rem'
              }}>
                {PRESET_AVATARS.map((cat, idx) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveTab(idx)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.825rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: activeTab === idx ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                      color: activeTab === idx ? '#fff' : 'var(--text-dim)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Avatar Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                {PRESET_AVATARS[activeTab].avatars.map((item) => {
                  const isSelected = settings.avatar === item.url;
                  return (
                    <div
                      key={item.url}
                      onClick={() => handleSelectAvatar(item.url)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.03)' : 'none'
                      }}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: '#1e293b'
                        }}
                      />
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        color: isSelected ? '#fff' : 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '90px'
                      }}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Image URL Option */}
              <div style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <LinkIcon size={14} color="var(--accent-primary)" /> Custom Image Link
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/avatar.png"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.825rem' }}
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="btn"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
