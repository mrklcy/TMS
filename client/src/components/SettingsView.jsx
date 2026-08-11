import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Palette, Shield, Bell, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    displayName: user?.name || '',
    email: user?.email || '',
    notifications: true,
    darkMode: true,
    compactView: false
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage your account preferences and workspace configuration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {/* Profile Settings */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--accent-primary)" /> Profile
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              padding: '3px',
              background: 'var(--gradient-primary)',
              borderRadius: '50%',
              flexShrink: 0
            }}>
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                alt={user?.name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1e293b' }}
              />
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '1.05rem' }}>{user?.name}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{user?.email || 'No email set'}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              maxLength={50}
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              maxLength={100}
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={18} color="var(--accent-secondary)" /> Preferences
          </h3>

          {/* Toggle items */}
          {[
            { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme for the interface', icon: <Palette size={16} color="#818cf8" /> },
            { key: 'notifications', label: 'Push Notifications', desc: 'Receive alerts for urgent tasks', icon: <Bell size={16} color="#fbbf24" /> },
            { key: 'compactView', label: 'Compact View', desc: 'Reduce spacing in task cards', icon: <Settings size={16} color="#38bdf8" /> }
          ].map(item => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.desc}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: settings[item.key] ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '3px',
                  left: settings[item.key] ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }} />
              </div>
            </div>
          ))}

          {/* Security Info */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Shield size={16} color="#818cf8" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#818cf8' }}>Security</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Your data is stored securely in MongoDB Atlas with encrypted JWT authentication.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem' }}
        >
          {saved ? <><CheckCircle2 size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
};
