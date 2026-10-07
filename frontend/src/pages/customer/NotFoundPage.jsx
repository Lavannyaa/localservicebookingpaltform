import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
        <div>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <AlertCircle size={32} />
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary-700)', lineHeight: 1 }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 24px auto' }}>
            The local service page or booking invoice you are looking for is unavailable or has moved.
          </p>
          <Link to="/home">
            <Button size="lg">Return to Marketplace</Button>
          </Link>
        </div>
      </div>
  );
};
