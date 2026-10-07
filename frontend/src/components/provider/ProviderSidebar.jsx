import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, CalendarCheck, Wrench, CheckSquare,
  Clock, Star, Building2, ToggleLeft, Bell, Settings, LogOut, ArrowLeft, History
} from 'lucide-react';
import { useAuth } from '../../hooks';

export const ProviderSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { label: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Booking Requests', path: '/provider/requests', icon: Inbox },
    { label: 'My Bookings', path: '/provider/bookings', icon: CalendarCheck },
    { label: 'My Services', path: '/provider/services', icon: Wrench },
    { label: 'Service Checklist', path: '/provider/checklist', icon: CheckSquare },
    { label: 'Maintenance', path: '/provider/maintenance', icon: Clock },
    { label: 'Reviews', path: '/provider/reviews', icon: Star },
    { label: 'Shop Profile', path: '/provider/profile', icon: Building2 },
    { label: 'Availability', path: '/provider/availability', icon: ToggleLeft },
    { label: 'Notifications', path: '/provider/notifications', icon: Bell },
    { label: 'Recently Accessed', path: '/provider/recently-accessed', icon: History },
    { label: 'Settings', path: '/provider/settings', icon: Settings }
  ];

  return (
    <aside style={{ width: '260px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--primary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building2 size={20} />
        </div>
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.shopName || 'Kumar Electricals'}</span>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--primary-600)', fontWeight: 700 }}>WORKSHOP PORTAL</span>
        </div>
      </div>

      <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
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
                borderLeft: active ? '3px solid var(--primary-600)' : '3px solid transparent'
              }}
            >
              <Icon size={18} color={active ? 'var(--primary-600)' : 'var(--text-muted)'} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => navigate('/home')}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <ArrowLeft size={14} /> Back to Marketplace
        </button>
        <button
          onClick={handleSignOut}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
