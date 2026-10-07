import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while processing your request.',
  onRetry,
  retryLabel = 'Try Again'
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid #fecaca',
      margin: '20px 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#fef2f2',
        color: '#dc2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px auto'
      }}>
        <AlertCircle size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} />
          <span>{retryLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
