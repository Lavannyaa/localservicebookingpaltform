import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Calendar, FileText, CheckSquare,
  User, MapPin, History, StickyNote, Bell, Settings, LogOut, ArrowLeft, HardHat
} from 'lucide-react';
import { useAuth } from '../../hooks';

export const TechSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { label: 'Dashboard', path: '/technician/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Jobs', path: '/technician/jobs', icon: Briefcase },
    { label: "Today's Schedule", path: '/technician/schedule', icon: Calendar },
    { label: 'Job Details', path: '/technician/job-details', icon: FileText },
    { label: 'Service Checklist', path: '/technician/checklist', icon: CheckSquare },
    { label: 'Customer Details', path: '/technician/customer', icon: User },
    { label: 'Location', path: '/technician/location', icon: MapPin },
    { label: 'Service History', path: '/technician/history', icon: History },
    { label: 'Notes', path: '/technician/notes', icon: StickyNote },
    { label: 'Notifications', path: '/technician/notifications', icon: Bell },
    { label: 'Profile', path: '/technician/profile', icon: User },
    { label: 'Settings', path: '/technician/settings', icon: Settings }
  ];

  return (
    <aside style={{ width: '260px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HardHat size={20} />
        </div>
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name || 'S. Murugan'}</span>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>FIELD TECHNICIAN PORTAL</span>
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
