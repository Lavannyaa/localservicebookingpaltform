import React from 'react';
import { Card } from '../common/Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'var(--primary-600)',
  bgColor = 'var(--primary-50)'
}) => {
  return (
    <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px' }}>
      <div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
          {value}
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          background: bgColor,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={26} />
        </div>
      )}
    </Card>
  );
};
