import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading...', size = 36 }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      gap: '14px',
      width: '100%'
    }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        color: 'var(--primary-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Loader2 size={size} />
      </div>
      <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
