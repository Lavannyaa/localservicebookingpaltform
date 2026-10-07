import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = ({ title = 'Navigation', subtitle, icon: Icon, links = [], footer }) => {
  const location = useLocation();

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0
    }}>
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {Icon && (
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-600)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={20} />
          </div>
        )}
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</span>
          {subtitle && (
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--primary-600)', fontWeight: 700 }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        {links.map((link) => {
          const ItemIcon = link.icon;
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: active ? 700 : 500,
                background: active ? 'var(--primary-50)' : 'transparent',
                color: active ? 'var(--primary-700)' : 'var(--text-secondary)',
                borderLeft: active ? '3px solid var(--primary-600)' : '3px solid transparent',
                textDecoration: 'none'
              }}
            >
              {ItemIcon && <ItemIcon size={18} color={active ? 'var(--primary-600)' : 'var(--text-muted)'} />}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {footer && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)' }}>
          {footer}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
