import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, HardHat, Headphones, Wrench,
  Layers, CalendarCheck, Clock, Star, AlertTriangle, TrendingUp,
  Bell, Settings, LogOut, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../hooks';

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Providers', path: '/admin/providers', icon: Building2 },
    { label: 'Technicians', path: '/admin/technicians', icon: HardHat },
    { label: 'Support Staff', path: '/admin/support', icon: Headphones },
    { label: 'Services (80+)', path: '/admin/services', icon: Wrench },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Maintenance', path: '/admin/maintenance', icon: Clock },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Complaints', path: '/admin/complaints', icon: AlertTriangle },
    { label: 'Reports', path: '/admin/reports', icon: TrendingUp },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <aside style={{ width: '260px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name || 'LocalServe Admin'}</span>
          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--primary-600)', fontWeight: 700 }}>SUPER GOVERNANCE</span>
        </div>
      </div>

      <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, overflowY: 'auto' }}>
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
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
                fontWeight: active ? 700 : 500,
                background: active ? 'var(--primary-50)' : 'transparent',
                color: active ? 'var(--primary-700)' : 'var(--text-secondary)',
                borderLeft: active ? '3px solid var(--primary-600)' : '3px solid transparent'
              }}
            >
              <Icon size={17} color={active ? 'var(--primary-600)' : 'var(--text-muted)'} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={() => navigate('/home')} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Back to Marketplace
        </button>
        <button onClick={handleSignOut} style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
