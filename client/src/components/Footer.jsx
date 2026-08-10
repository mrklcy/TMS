import React from 'react';
import { CheckSquare, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '2.5rem 1.5rem',
      background: 'rgba(11, 15, 25, 0.95)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckSquare size={20} color="var(--accent-primary)" />
          <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>TaskFlow Pro</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Documentation</span>
        </div>
      </div>
    </footer>
  );
};
