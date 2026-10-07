import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks';

export const NotificationBell = ({ to = '/notifications', size = 18 }) => {
  const { unreadCount } = useNotifications();

  return (
    <Link
      to={to}
      aria-label={`Notifications (${unreadCount} unread)`}
      style={{
        position: 'relative',
        background: 'var(--bg-muted)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '7px',
        color: 'var(--text-primary)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none'
      }}
    >
      <Bell size={size} />
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: 'var(--danger)',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
