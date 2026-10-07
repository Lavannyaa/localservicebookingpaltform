import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useNotifications } from '../../hooks';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Wrench, User, Building2, HardHat, Headphones, ShieldCheck, Bell, Sun, Moon,
  Menu, X, ChevronDown, Heart, FileCheck, Star, HelpCircle, Info, Phone,
  LogOut, MapPin, Settings, Sparkles, Clock, Calendar
} from 'lucide-react';

export const CustomerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAuthenticated, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, languages, t } = useLanguage();
  const { unreadCount, getNotifications } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    getNotifications('customer');
  }, [getNotifications]);

  const isActive = (path) => location.pathname === path;

  const roleList = [
    { id: 'customer', label: 'Customer', icon: User, path: '/home' },
    { id: 'provider', label: 'Provider Shop', icon: Building2, path: '/provider/dashboard' },
    { id: 'technician', label: 'Technician', icon: HardHat, path: '/technician/dashboard' },
    { id: 'support', label: 'Support Staff', icon: Headphones, path: '/support/dashboard' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, path: '/admin/dashboard' }
  ];

  const handleRoleSwitch = async (targetRole, path) => {
    await switchRole(targetRole);
    navigate(path);
  };

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Top 5-Role Switcher Demo Bar */}
      <div style={{ background: '#2e1065', color: '#ffffff', padding: '6px 20px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: '#c4b5fd' }}>{t('switchPortal', 'SWITCH PORTAL (5 ROLES):')}</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {roleList.map((r) => {
              const Icon = r.icon;
              const isCurrent = isAuthenticated && role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleSwitch(r.id, r.path)}
                  style={{
                    background: isCurrent ? 'var(--primary-600)' : 'rgba(255,255,255,0.12)',
                    color: isCurrent ? '#ffffff' : '#e9d5ff',
                    border: isCurrent ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Icon size={12} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ color: '#ddd6fe', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="#a78bfa" />
            <span>{t('locationCity', 'Tirunelveli, Tamil Nadu')}</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: 'var(--shadow-purple)' }}>
            <Wrench size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '-0.5px' }}>{t('appName', 'LocalServe')}</span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px' }}>COMMERCIAL SERVICE PLATFORM</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '20px' }} className="desktop-nav">
          <Link to="/home" style={{ fontSize: '0.9rem', fontWeight: isActive('/home') ? 700 : 600, color: isActive('/home') ? 'var(--primary-600)' : 'var(--text-secondary)' }}>
            {t('home', 'Home')}
          </Link>
          <Link to="/services" style={{ fontSize: '0.9rem', fontWeight: isActive('/services') ? 700 : 600, color: isActive('/services') ? 'var(--primary-600)' : 'var(--text-secondary)' }}>
            {t('services', 'Services')}
          </Link>
          <Link to="/categories" style={{ fontSize: '0.9rem', fontWeight: isActive('/categories') ? 700 : 600, color: isActive('/categories') ? 'var(--primary-600)' : 'var(--text-secondary)' }}>
            {t('categories', 'Categories')}
          </Link>
          <Link to="/providers" style={{ fontSize: '0.9rem', fontWeight: isActive('/providers') ? 700 : 600, color: isActive('/providers') ? 'var(--primary-600)' : 'var(--text-secondary)' }}>
            {t('providers', 'Providers')}
          </Link>

          {/* Prominent Explore CTA Button with Badge */}
          <Link
            to="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.84rem',
              boxShadow: 'var(--shadow-purple)',
              textDecoration: 'none'
            }}
          >
            <Sparkles size={14} />
            <span>{t('explore', 'Explore')}</span>
            <span style={{ background: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px' }}>
              80+
            </span>
          </Link>

          <Link to="/bookings" style={{ fontSize: '0.9rem', fontWeight: isActive('/bookings') ? 700 : 600, color: isActive('/bookings') ? 'var(--primary-600)' : 'var(--text-secondary)' }}>
            {t('bookings', 'Bookings')}
          </Link>

          {/* More Dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMoreDropdownOpen(!moreDropdownOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{t('more', 'More')}</span>
              <ChevronDown size={15} />
            </button>
            {moreDropdownOpen && (
              <div onClick={() => setMoreDropdownOpen(false)} style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', width: '230px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)', padding: '8px 0', zIndex: 1100 }}>
                <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <Heart size={16} color="var(--primary-600)" /><span>{t('favorites', 'Favorites')}</span>
                </Link>
                <Link to="/service-passport" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <FileCheck size={16} color="var(--primary-600)" /><span>{t('servicePassport', 'Service Passport')}</span>
                </Link>
                <Link to="/maintenance" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <Calendar size={16} color="var(--primary-600)" /><span>{t('maintenance', 'Maintenance Schedule')}</span>
                </Link>
                <Link to="/recently-accessed" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <Clock size={16} color="var(--primary-600)" /><span>{t('recentlyAccessed', 'Recently Accessed')}</span>
                </Link>
                <Link to="/reviews" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <Star size={16} color="var(--primary-600)" /><span>{t('reviews', 'Reviews & Ratings')}</span>
                </Link>
                <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />
                <Link to="/help-support" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <HelpCircle size={16} /><span>{t('helpSupport', 'Help & Support')}</span>
                </Link>
                <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <Info size={16} /><span>{t('about', 'About Us')}</span>
                </Link>
                <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <Phone size={16} /><span>{t('contact', 'Contact')}</span>
                </Link>
                <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <Settings size={16} /><span>{t('settings', 'Settings')}</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Multilingual Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select Language"
            style={{
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native} ({l.name})
              </option>
            ))}
          </select>

          <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '7px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notification Bell with Badge */}
          <Link
            to="/notifications"
            aria-label={t('notifications', 'Notifications')}
            title={`${unreadCount} ${t('unreadAlerts', 'unread alerts')}`}
            style={{
              position: 'relative',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.66rem',
                fontWeight: 800,
                minWidth: '18px',
                height: '18px',
                padding: '0 4px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px rgba(239,68,68,0.5)',
                border: '1.5px solid var(--bg-surface)'
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/login"
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-muted)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <User size={15} />
                <span>{t('signIn', 'Sign In')}</span>
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--primary-600)',
                  background: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                {t('register', 'Register')}
              </Link>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-50)', border: '1px solid var(--primary-200)', padding: '6px 12px', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {user?.avatar || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'US')}
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-800)' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown size={14} color="var(--primary-700)" />
              </button>
              {profileDropdownOpen && (
                <div onClick={() => setProfileDropdownOpen(false)} style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', width: '200px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)', padding: '8px 0', zIndex: 1100 }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-light)', fontSize: '0.78rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>Role: {role || 'Customer'}</div>
                  </div>
                  <Link to={role === 'provider' ? '/provider/dashboard' : role === 'technician' ? '/technician/dashboard' : role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} style={{ display: 'block', padding: '10px 16px', fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    {t('dashboard', 'Dashboard')}
                  </Link>
                  <Link to="/profile" style={{ display: 'block', padding: '10px 16px', fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    {t('profile', 'My Profile')}
                  </Link>
                  <Link to="/settings" style={{ display: 'block', padding: '10px 16px', fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    {t('settings', 'Settings')}
                  </Link>
                  <div style={{ height: '1px', background: 'var(--border-light)', margin: '4px 0' }} />
                  <button onClick={handleSignOut} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '10px 16px', fontSize: '0.86rem', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <LogOut size={15} /><span>{t('signOut', 'Sign Out')}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu" className="mobile-toggle" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/home" onClick={() => setMobileMenuOpen(false)}>{t('home', 'Home')}</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)}>{t('services', 'Services')}</Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>{t('categories', 'Categories')}</Link>
          <Link to="/providers" onClick={() => setMobileMenuOpen(false)}>{t('providers', 'Providers')}</Link>
          <Link to="/nearby-providers" onClick={() => setMobileMenuOpen(false)}>{t('nearby', 'Nearby Providers')}</Link>
          <Link to="/bookings" onClick={() => setMobileMenuOpen(false)}>{t('bookings', 'My Bookings')}</Link>
          <Link to="/maintenance" onClick={() => setMobileMenuOpen(false)}>{t('maintenance', 'Maintenance')}</Link>
          <Link to="/service-passport" onClick={() => setMobileMenuOpen(false)}>{t('servicePassport', 'Service Passport')}</Link>
          <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>{t('favorites', 'Favorites')}</Link>
          <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>{t('settings', 'Settings')}</Link>
          <div style={{ height: '1px', background: 'var(--border-light)', margin: '6px 0' }} />
          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-muted)', fontWeight: 700 }}>{t('signIn', 'Sign In')}</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-600)', color: '#fff', fontWeight: 700 }}>{t('register', 'Register')}</Link>
            </div>
          ) : (
            <button onClick={() => { setMobileMenuOpen(false); handleSignOut(); }} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', background: '#fee2e2', color: 'var(--danger)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <LogOut size={16} /> {t('signOut', 'Sign Out')} ({user?.name})
            </button>
          )}
        </div>
      )}
      <style>{`@media (min-width: 900px) { .desktop-nav { display: flex !important; } .mobile-toggle { display: none !important; } }`}</style>
    </header>
  );
};
