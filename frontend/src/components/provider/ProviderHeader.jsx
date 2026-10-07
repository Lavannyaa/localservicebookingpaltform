import React from 'react';
import { useAuth } from '../../hooks';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProviderHeader = ({ title = "Workshop Dashboard" }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ height: '70px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kumar Electricals · Tirunelveli</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          ● Workshop Open & Available
        </span>

        <button onClick={toggleTheme} style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '7px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <Link to="/provider/notifications" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '7px', color: 'var(--text-primary)', display: 'flex' }}>
          <Bell size={17} />
        </Link>
      </div>
    </header>
  );
};
