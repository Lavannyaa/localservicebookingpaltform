import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  title = "No data found",
  description = "There are no matching items for your search or filter criteria.",
  icon: Icon = PackageOpen,
  actionLabel,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 20px',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-medium)',
      margin: '20px 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--primary-50)',
        color: 'var(--primary-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px auto'
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px auto' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
