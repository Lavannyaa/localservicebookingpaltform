import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { useUserSettings } from '../../hooks/useUserSettings';
import { useAuth } from '../../hooks';
import {
  User, Palette, Globe, Bell, Eye, ShieldCheck,
  Sliders, Wrench, Lock, CheckCircle2, AlertCircle,
  Sun, Moon, Monitor, Laptop, Smartphone, Trash2,
  Download, LogOut, Check, RefreshCw, Key, Shield,
  CreditCard, MapPin, Clock, Volume2, HardDrive
} from 'lucide-react';

export const UnifiedSettingsView = ({
  role = 'customer',
  title = 'System Preferences & Settings',
  subtitle = 'Manage your account profile, live UI appearance, regional language, and security protocols.'
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    settings,
    loading,
    saving,
    feedback,
    activeRole,
    // Context controls
    theme,
    language,
    languages,
    contrast,
    fontSize,
    reducedMotion,
    // Updaters
    updateAccount,
    updateAppearance,
    updateLanguage,
    updateNotifications,
    updatePrivacy,
    updateAccessibility,
    updatePreferences,
    changePassword,
    toggleOAuth,
    terminateSession,
    terminateAllOtherSessions,
    exportUserData,
    saveAll
  } = useUserSettings(role);

  // Active section tab
  const [activeTab, setActiveTab] = useState('account');

  // Local form states for Account
  const [accountForm, setAccountForm] = useState(() => settings.account || {});
  // Local form state for Preferences
  const [prefForm, setPrefForm] = useState(() => settings.preferences || {});
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Keep local forms synced when settings finishes initial load
  React.useEffect(() => {
    if (settings.account) setAccountForm(settings.account);
    if (settings.preferences) setPrefForm(settings.preferences);
  }, [settings]);

  const tabs = [
    { id: 'account', label: 'Account', icon: User, desc: 'Personal details and profile credentials' },
    { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Light, dark, and system color schemes' },
    { id: 'language', label: 'Language', icon: Globe, desc: 'Regional language dictionaries' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alert channels and dispatch updates' },
    { id: 'privacy', label: 'Privacy', icon: Eye, desc: 'Profile visibility and data preferences' },
    { id: 'security', label: 'Security', icon: ShieldCheck, desc: 'Password, OAuth, active sessions, and logout' },
    { id: 'accessibility', label: 'Accessibility', icon: Sliders, desc: 'Font scaling, high contrast, reduced motion' },
    { id: 'preferences', label: 'Preferences', icon: Wrench, desc: 'Role-specific operational parameters' },
  ];

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const res = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });

    if (res.success) {
      setPasswordSuccess('Password successfully updated!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } else {
      setPasswordError(res.error || 'Failed to update password');
    }
  };

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out of LocalServe?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-100)',
              color: 'var(--primary-800)'
            }}>
              {activeRole.toUpperCase()} PORTAL SETTINGS
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              · Context API Live Sync
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '720px' }}>
            {subtitle}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={saveAll}
          loading={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Check size={16} /> Save All Preferences
        </Button>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: feedback.type === 'error' ? '#fef2f2' : 'var(--success-bg)',
          color: feedback.type === 'error' ? '#991b1b' : 'var(--success-text)',
          border: feedback.type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Layout Grid: Left Sidebar Navigation & Right Content Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Navigation Sidebar */}
        <Card style={{ padding: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: isActive ? 'var(--primary-50)' : 'transparent',
                    color: isActive ? 'var(--primary-700)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    background: isActive ? 'var(--primary-600)' : 'var(--bg-muted)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ lineHeight: 1.2 }}>{tab.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Content Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ================= SECTION 1: ACCOUNT ================= */}
          {activeTab === 'account' && (
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Account Profile Details
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Identity information, contact details, and role credentials.
                  </p>
                </div>
              </div>

              {/* Profile Avatar & Role Tag */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                padding: '16px',
                background: 'var(--bg-muted)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--primary-600)',
                  color: '#ffffff',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(accountForm.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{accountForm.name || 'LocalServe User'}</h4>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-800)'
                    }}>
                      {activeRole}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0 0', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                    {accountForm.email} · {accountForm.phone}
                  </p>
                </div>
              </div>

              {/* Account Form Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    value={accountForm.name || ''}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    value={accountForm.email || ''}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="text"
                    value={accountForm.phone || ''}
                    onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Role Specific Fields */}
                {activeRole === 'customer' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Service Passport ID</label>
                      <input
                        type="text"
                        value={accountForm.passportNumber || 'PASSPORT-TNV-2026-081'}
                        disabled
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Default Delivery Address</label>
                      <input
                        type="text"
                        value={accountForm.deliveryAddress || ''}
                        onChange={(e) => setAccountForm({ ...accountForm, deliveryAddress: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </>
                )}

                {activeRole === 'provider' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Registered Workshop Name</label>
                      <input
                        type="text"
                        value={accountForm.workshopName || ''}
                        onChange={(e) => setAccountForm({ ...accountForm, workshopName: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Workshop GSTIN / Registration</label>
                      <input
                        type="text"
                        value={accountForm.workshopGst || ''}
                        onChange={(e) => setAccountForm({ ...accountForm, workshopGst: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Commercial Workshop Address</label>
                      <input
                        type="text"
                        value={accountForm.workshopAddress || ''}
                        onChange={(e) => setAccountForm({ ...accountForm, workshopAddress: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </>
                )}

                {activeRole === 'technician' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Technician Badge ID</label>
                      <input
                        type="text"
                        value={accountForm.technicianId || 'TECH-TNV-042'}
                        disabled
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Primary Trade Specialty</label>
                      <input
                        type="text"
                        value={accountForm.tradeSpecialty || 'AC & Refrigeration Master'}
                        onChange={(e) => setAccountForm({ ...accountForm, tradeSpecialty: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </>
                )}

                {activeRole === 'support' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Support Agent ID</label>
                      <input
                        type="text"
                        value={accountForm.staffId || 'SUP-TNV-108'}
                        disabled
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Assigned Department Queue</label>
                      <input
                        type="text"
                        value={accountForm.department || 'Customer Grievances & Service Escalations'}
                        onChange={(e) => setAccountForm({ ...accountForm, department: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </>
                )}

                {activeRole === 'admin' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Master Admin ID</label>
                      <input
                        type="text"
                        value={accountForm.adminId || 'ADMIN-SYS-001'}
                        disabled
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Security Clearance Level</label>
                      <input
                        type="text"
                        value={accountForm.clearanceLevel || 'Level 5 (Super Governance)'}
                        disabled
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '18px' }}>
                <Button onClick={() => updateAccount(accountForm)}>
                  Save Account Changes
                </Button>
              </div>
            </Card>
          )}

          {/* ================= SECTION 2: APPEARANCE ================= */}
          {activeTab === 'appearance' && (
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Palette size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Appearance & Theme
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Select your preferred visual palette. Updates apply immediately via Context API.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean, high-visibility daytime palette' },
                  { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Low-light theme to reduce eye fatigue' },
                  { id: 'system', label: 'System Mode', icon: Laptop, desc: 'Syncs automatically with operating system theme' }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = theme === mode.id;
                  return (
                    <div
                      key={mode.id}
                      onClick={() => updateAppearance(mode.id)}
                      style={{
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                        background: isSelected ? 'var(--primary-50)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--primary-600)' : 'var(--bg-muted)',
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={20} />
                        </div>
                        {isSelected && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--primary-600)',
                            color: '#ffffff'
                          }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: isSelected ? 'var(--primary-900)' : 'var(--text-primary)', marginBottom: '4px' }}>
                          {mode.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {mode.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '24px', padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'var(--bg-muted)', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <strong>Live Theme Status:</strong> Active theme is <code>{theme}</code>. Changes are saved to user profile and persist across refreshes.
              </div>
            </Card>
          )}

          {/* ================= SECTION 3: LANGUAGE ================= */}
          {activeTab === 'language' && (
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Language & Regional Display
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Choose your preferred language. Translations update instantaneously across all pages.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => updateLanguage(lang.code)}
                      style={{
                        padding: '18px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                        background: isSelected ? 'var(--primary-50)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.02rem', color: isSelected ? 'var(--primary-900)' : 'var(--text-primary)' }}>
                          {lang.name}
                        </div>
                        <div style={{ fontSize: '0.86rem', color: isSelected ? 'var(--primary-700)' : 'var(--text-secondary)', fontWeight: 600 }}>
                          {lang.native}
                        </div>
                      </div>
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: isSelected ? '6px solid var(--primary-600)' : '2px solid var(--border-color)',
                        background: '#ffffff'
                      }} />
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '24px', padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'var(--bg-muted)', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <strong>Active Language:</strong> {languages.find(l => l.code === language)?.name} ({languages.find(l => l.code === language)?.native}). Multilingual state is managed via Language Context API.
              </div>
            </Card>
          )}

          {/* ================= SECTION 4: NOTIFICATIONS ================= */}
          {activeTab === 'notifications' && (
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Notification Subscriptions
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Control which service alerts and dispatch notifications trigger alerts.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    key: 'bookingUpdates',
                    title: 'Booking Updates',
                    desc: 'Real-time notifications on job creation, technician assignment, and arrival alerts.'
                  },
                  {
                    key: 'maintenanceReminders',
                    title: 'Maintenance Reminders',
                    desc: 'Quarterly servicing reminders, filter renewals, and warranty expiration notices.'
                  },
                  {
                    key: 'serviceUpdates',
                    title: 'Service Updates',
                    desc: 'Job completion summaries, digitized checklists, and itemized invoice slips.'
                  },
                  {
                    key: 'reviews',
                    title: 'Reviews',
                    desc: 'Customer feedback notices, rating prompts, and workshop replies.'
                  },
                  {
                    key: 'offers',
                    title: 'Offers',
                    desc: 'Seasonal maintenance packages, promotional discounts, and trade referral bonuses.'
                  },
                  {
                    key: 'systemNotifications',
                    title: 'System Notifications',
                    desc: 'High-priority platform governance announcements, security alerts, and system downtime.'
                  }
                ].map((item) => {
                  const isChecked = Boolean(settings.notifications?.[item.key]);
                  return (
                    <div
                      key={item.key}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {item.desc}
                        </div>
                      </div>

                      <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer', flexShrink: 0 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => updateNotifications({ [item.key]: e.target.checked })}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: isChecked ? 'var(--primary-600)' : '#cbd5e1',
                          borderRadius: '26px',
                          transition: '0.2s ease',
                          display: 'block'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '""',
                            height: '20px',
                            width: '20px',
                            left: isChecked ? '24px' : '3px',
                            bottom: '3px',
                            backgroundColor: '#ffffff',
                            borderRadius: '50%',
                            transition: '0.2s ease',
                            display: 'block',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }} />
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ================= SECTION 5: PRIVACY ================= */}
          {activeTab === 'privacy' && (
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Eye size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Privacy & Data Governance
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Configure profile visibility, GPS location sharing, and personal data portability.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* 1. Profile Visibility */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, marginBottom: '8px' }}>
                    Profile Visibility
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {[
                      { id: 'public', label: 'Public', desc: 'Visible to all customers & providers' },
                      { id: 'contacts', label: 'Assigned Workers Only', desc: 'Visible only during active orders' },
                      { id: 'private', label: 'Private', desc: 'Hidden from public directory' }
                    ].map((opt) => {
                      const isSel = (settings.privacy?.profileVisibility || 'contacts') === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => updatePrivacy({ profileVisibility: opt.id })}
                          style={{
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: isSel ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                            background: isSel ? 'var(--primary-50)' : 'var(--bg-surface)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSel ? 'var(--primary-900)' : 'var(--text-primary)' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {opt.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Location Sharing Preference */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, marginBottom: '8px' }}>
                    Location Sharing Preference
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {[
                      { id: 'always', label: 'Always Share', desc: 'Best precision for technician routing' },
                      { id: 'while_using', label: 'While Using App', desc: 'Active only when jobs are in progress' },
                      { id: 'never', label: 'Never Share', desc: 'Manual address entry required' }
                    ].map((opt) => {
                      const isSel = (settings.privacy?.locationSharing || 'while_using') === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => updatePrivacy({ locationSharing: opt.id })}
                          style={{
                            padding: '14px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: isSel ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                            background: isSel ? 'var(--primary-50)' : 'var(--bg-surface)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSel ? 'var(--primary-900)' : 'var(--text-primary)' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {opt.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Data Preferences & Export */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, marginBottom: '8px' }}>
                    Data Preferences & Portability
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-muted)', cursor: 'pointer' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Share anonymous diagnostics & usage analytics</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settings.privacy?.dataPreferences?.analytics)}
                        onChange={(e) => updatePrivacy({
                          dataPreferences: { ...settings.privacy?.dataPreferences, analytics: e.target.checked }
                        })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-muted)', cursor: 'pointer' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Enable personalized appliance service recommendations</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settings.privacy?.dataPreferences?.personalization)}
                        onChange={(e) => updatePrivacy({
                          dataPreferences: { ...settings.privacy?.dataPreferences, personalization: e.target.checked }
                        })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Data Export Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Export Personal Data Archive</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Download a complete JSON export of your profile, history, and preferences (DPDPA 2023 compliant).
                    </div>
                  </div>
                  <Button variant="outline" size="sm" icon={Download} onClick={exportUserData}>
                    Download Data
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ================= SECTION 6: SECURITY ================= */}
          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Change Password Card */}
              <Card style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Key size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      Change Password
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Ensure your account uses a strong, unique password.
                    </p>
                  </div>
                </div>

                {passwordSuccess && (
                  <div style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div style={{ background: '#fef2f2', color: '#991b1b', padding: '10px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>New Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <Button type="submit" variant="primary">
                      Update Password
                    </Button>
                  </div>
                </form>
              </Card>

              {/* OAuth Account Card */}
              <Card style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      Connected OAuth Accounts
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Sign in seamlessly using trusted single sign-on (SSO) identity providers.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-muted)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem' }}>Google Workspace OAuth</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {settings.security?.oauthLinked?.google
                          ? `Linked: ${settings.security.oauthLinked.googleEmail || 'Active'}`
                          : 'Not linked to any Google account'}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={settings.security?.oauthLinked?.google ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleOAuth('google', !settings.security?.oauthLinked?.google)}
                  >
                    {settings.security?.oauthLinked?.google ? 'Disconnect' : 'Connect Google'}
                  </Button>
                </div>
              </Card>

              {/* Active Sessions Card */}
              <Card style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Laptop size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        Active Sessions & Devices
                      </h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Devices currently authenticated into your LocalServe account.
                      </p>
                    </div>
                  </div>

                  {settings.security?.sessions?.length > 1 && (
                    <Button variant="outline" size="sm" onClick={terminateAllOtherSessions}>
                      Revoke All Other Sessions
                    </Button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(settings.security?.sessions || []).map((sess) => (
                    <div
                      key={sess.id}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {sess.device.includes('Android') || sess.device.includes('Mobile') ? (
                          <Smartphone size={20} color="var(--primary-600)" />
                        ) : (
                          <Laptop size={20} color="var(--primary-600)" />
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{sess.device}</span>
                            {sess.isCurrent && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                                CURRENT DEVICE
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            IP: {sess.ip} · {sess.location} · {sess.lastActive}
                          </div>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => terminateSession(sess.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            color: '#dc2626',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Logout Card */}
              <Card style={{ padding: '24px', border: '1px solid #fee2e2', background: '#fff5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LogOut size={18} /> End Current Session
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: '2px' }}>
                      Log out of your {activeRole} account on this device. You will need your credentials to log back in.
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    icon={LogOut}
                    onClick={handleLogoutClick}
                  >
                    Log Out of LocalServe
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* ================= SECTION 7: ACCESSIBILITY ================= */}
          {activeTab === 'accessibility' && (
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sliders size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Accessibility & Vision Controls
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Adjust text scaling, border contrast palettes, and motion preferences.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* 1. Font Size Scaling */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, marginBottom: '8px' }}>
                    Font Size Scaling
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { id: 'small', label: 'Compact', scale: '0.9x scale' },
                      { id: 'normal', label: 'Standard', scale: '1.0x default' },
                      { id: 'large', label: 'Enlarged', scale: '1.15x large' }
                    ].map((opt) => {
                      const isSel = fontSize === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => updateAccessibility({ fontSize: opt.id })}
                          style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-md)',
                            border: isSel ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                            background: isSel ? 'var(--primary-50)' : 'var(--bg-surface)',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: opt.id === 'large' ? '1.1rem' : opt.id === 'small' ? '0.85rem' : '0.95rem' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {opt.scale}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. High Contrast Mode */}
                <div style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      High Contrast Mode
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Enhance border delineations and darken contrast boundaries for improved readability.
                    </div>
                  </div>

                  <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer', flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={contrast === 'high'}
                      onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: contrast === 'high' ? 'var(--primary-600)' : '#cbd5e1',
                      borderRadius: '26px',
                      transition: '0.2s ease',
                      display: 'block'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '20px',
                        width: '20px',
                        left: contrast === 'high' ? '24px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        transition: '0.2s ease',
                        display: 'block',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </span>
                  </label>
                </div>

                {/* 3. Reduced Motion */}
                <div style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      Reduced Motion Animations
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Disable sliding and pulsing CSS transition effects to assist motion sensitivity.
                    </div>
                  </div>

                  <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer', flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={reducedMotion}
                      onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: reducedMotion ? 'var(--primary-600)' : '#cbd5e1',
                      borderRadius: '26px',
                      transition: '0.2s ease',
                      display: 'block'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '20px',
                        width: '20px',
                        left: reducedMotion ? '24px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        transition: '0.2s ease',
                        display: 'block',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* ================= SECTION 8: PREFERENCES ================= */}
          {activeTab === 'preferences' && (
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {activeRole === 'provider' ? 'Workshop Payout & Radius Parameters' :
                     activeRole === 'technician' ? 'Field Shift & Travel Preferences' :
                     activeRole === 'support' ? 'Helpdesk Routing & SLA Rules' :
                     activeRole === 'admin' ? 'Platform Governance & Fee Architecture' :
                     'Customer Booking Preferences'}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Specialized operational parameters customized for the {activeRole} role.
                  </p>
                </div>
              </div>

              {/* Customer Preferences Form */}
              {activeRole === 'customer' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Preferred Booking Slot Window</label>
                    <select
                      value={prefForm.preferredSlot || 'morning'}
                      onChange={(e) => setPrefForm({ ...prefForm, preferredSlot: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                      <option value="morning">Morning (08:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (12:00 PM - 04:00 PM)</option>
                      <option value="evening">Evening (04:00 PM - 08:00 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Default Payment Method</label>
                    <select
                      value={prefForm.defaultPaymentMethod || 'UPI / Online'}
                      onChange={(e) => setPrefForm({ ...prefForm, defaultPaymentMethod: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                      <option value="UPI / Online">Instant UPI / QR Scanner</option>
                      <option value="Card">Credit / Debit Card</option>
                      <option value="Cash">Cash on Service Completion</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Appliance Reminder Frequency</label>
                    <select
                      value={prefForm.applianceReminderFrequency || 'Every 3 Months'}
                      onChange={(e) => setPrefForm({ ...prefForm, applianceReminderFrequency: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                      <option value="Every 1 Month">Monthly</option>
                      <option value="Every 3 Months">Quarterly (Recommended)</option>
                      <option value="Every 6 Months">Bi-Annually</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prefForm.autoReorderSupplies)}
                        onChange={(e) => setPrefForm({ ...prefForm, autoReorderSupplies: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Automatically suggest replacement filters & parts when maintenance is due</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Provider Preferences Form */}
              {activeRole === 'provider' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Settlement Beneficiary Name</label>
                    <input
                      type="text"
                      value={prefForm.accountName || ''}
                      onChange={(e) => setPrefForm({ ...prefForm, accountName: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Bank Account Number</label>
                    <input
                      type="text"
                      value={prefForm.accountNumber || ''}
                      onChange={(e) => setPrefForm({ ...prefForm, accountNumber: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>IFSC Code</label>
                    <input
                      type="text"
                      value={prefForm.ifsc || ''}
                      onChange={(e) => setPrefForm({ ...prefForm, ifsc: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Instant UPI ID</label>
                    <input
                      type="text"
                      value={prefForm.upiId || ''}
                      onChange={(e) => setPrefForm({ ...prefForm, upiId: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Dispatch Radius (km)</label>
                    <input
                      type="number"
                      value={prefForm.serviceRadiusKm || 25}
                      onChange={(e) => setPrefForm({ ...prefForm, serviceRadiusKm: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Workshop Operating Hours</label>
                    <input
                      type="text"
                      value={prefForm.workingHours || '08:00 AM - 08:00 PM'}
                      onChange={(e) => setPrefForm({ ...prefForm, workingHours: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prefForm.autoAcceptBookings)}
                        onChange={(e) => setPrefForm({ ...prefForm, autoAcceptBookings: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Auto-accept incoming booking requests during active shop hours</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Technician Preferences Form */}
              {activeRole === 'technician' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Max Field Travel Distance (km)</label>
                    <input
                      type="number"
                      value={prefForm.maxTravelDistanceKm || 15}
                      onChange={(e) => setPrefForm({ ...prefForm, maxTravelDistanceKm: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Default Navigation App</label>
                    <select
                      value={prefForm.preferredNavigation || 'google_maps'}
                      onChange={(e) => setPrefForm({ ...prefForm, preferredNavigation: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                      <option value="google_maps">Google Maps GPS Navigation</option>
                      <option value="in_app">LocalServe In-App Route Planner</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prefForm.offlineChecklistSync)}
                        onChange={(e) => setPrefForm({ ...prefForm, offlineChecklistSync: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Enable offline checklist & photo caching when working in poor network zones</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prefForm.emergencyDispatch)}
                        onChange={(e) => setPrefForm({ ...prefForm, emergencyDispatch: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Opt-in to emergency night breakdown service requests (1.5x payout surge)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Support Staff Preferences Form */}
              {activeRole === 'support' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Ticket Refresh Interval (seconds)</label>
                    <select
                      value={prefForm.ticketRefreshIntervalSeconds || 30}
                      onChange={(e) => setPrefForm({ ...prefForm, ticketRefreshIntervalSeconds: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                      <option value={15}>15 Seconds (Rapid)</option>
                      <option value={30}>30 Seconds (Standard)</option>
                      <option value={60}>60 Seconds</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>SLA Escalation Alert Threshold (mins)</label>
                    <input
                      type="number"
                      value={prefForm.escalationSlaMinutes || 30}
                      onChange={(e) => setPrefForm({ ...prefForm, escalationSlaMinutes: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prefForm.autoAssignTickets)}
                        onChange={(e) => setPrefForm({ ...prefForm, autoAssignTickets: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Automatically assign open customer grievances to my triage queue</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prefForm.urgentAudioAlarm)}
                        onChange={(e) => setPrefForm({ ...prefForm, urgentAudioAlarm: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Play audible alarm chime when urgent SLA grievance breaches threshold</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Admin Preferences Form */}
              {activeRole === 'admin' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Fixed Platform Booking Fee (₹)</label>
                    <input
                      type="number"
                      value={prefForm.platformFee || 49}
                      onChange={(e) => setPrefForm({ ...prefForm, platformFee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Workshop Commission Rate (%)</label>
                    <input
                      type="number"
                      value={prefForm.commissionRate || 10}
                      onChange={(e) => setPrefForm({ ...prefForm, commissionRate: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>Applicable GST (%)</label>
                    <input
                      type="number"
                      value={prefForm.gstRate || 18}
                      onChange={(e) => setPrefForm({ ...prefForm, gstRate: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>SLA Auto-Escalation Window (mins)</label>
                    <input
                      type="number"
                      value={prefForm.escalationTimeoutMinutes || 45}
                      onChange={(e) => setPrefForm({ ...prefForm, escalationTimeoutMinutes: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(prefForm.maintenanceMode)}
                        onChange={(e) => setPrefForm({ ...prefForm, maintenanceMode: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                      />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#b91c1c' }}>
                        Enable Platform Maintenance Mode Banner (Read-only for consumers)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '18px' }}>
                <Button onClick={() => updatePreferences(prefForm)}>
                  Save {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Preferences
                </Button>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default UnifiedSettingsView;
