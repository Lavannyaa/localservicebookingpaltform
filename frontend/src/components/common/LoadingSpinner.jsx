import React from 'react';

export const LoadingSpinner = ({ message = 'Loading services...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '14px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid var(--primary-100)',
        borderTopColor: 'var(--primary-600)',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{message}</span>
    </div>
  );
};
