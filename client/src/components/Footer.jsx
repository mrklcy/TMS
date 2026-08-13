import React from 'react';
import { CheckSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      padding: '2.25rem 1.5rem',
      background: '#f8fafc',
      color: '#1e293b',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#6d28d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckSquare size={18} color="#ffffff" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
            TaskFlow<span style={{ color: '#6d28d9' }}>Pro</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security & MongoDB Analytics</span>
        </div>
      </div>
    </footer>
  );
};
