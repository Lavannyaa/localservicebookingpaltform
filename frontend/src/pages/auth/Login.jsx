import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks';
import { oauthService } from '../../services/oauthService';
import { authService } from '../../services/authService';
import {
  Wrench, User, Building2, HardHat, Headphones, ShieldCheck,
  Mail, Lock, AlertCircle, Shield, Key, Sparkles, ChevronDown,
  ChevronUp, CheckCircle2, ShieldAlert
} from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('rahul.sharma@localserve.com');
  const [password, setPassword] = useState('Rahul@LocalServe2026!');
  const [adminMfaCode, setAdminMfaCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState('');
  const [showCredsDrawer, setShowCredsDrawer] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // Extract redirect query param if present
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect');

  // The 5 User Roles & Dashboards
  const roleConfigs = [
    {
      role: 'customer',
      label: 'Customer',
      email: 'rahul.sharma@localserve.com',
      password: 'Rahul@LocalServe2026!',
      icon: User,
      dashboard: '/customer/dashboard',
      tagline: 'Local Consumer & Service Booking'
    },
    {
      role: 'provider',
      label: 'Service Provider',
      email: 'ravi.kumar@localserve.com',
      password: 'Kumar@Electric2026!',
      icon: Building2,
      dashboard: '/provider/dashboard',
      tagline: 'Kumar Electricals & Rewinding'
    },
    {
      role: 'technician',
      label: 'Technician',
      email: 's.murugan@localserve.com',
      password: 'Murugan@Tech2026!',
      icon: HardHat,
      dashboard: '/technician/dashboard',
      tagline: 'Certified Field Specialist'
    },
    {
      role: 'support',
      label: 'Support Staff',
      email: 'ananya.support@localserve.com',
      password: 'Support@Ops2026!',
      icon: Headphones,
      dashboard: '/support/dashboard',
      tagline: 'Dispute Resolution & Operations'
    },
    {
      role: 'admin',
      label: 'Administrator',
      email: 'admin.governance@localserve.com',
      password: 'Admin@Governance2026!',
      icon: ShieldCheck,
      dashboard: '/admin/dashboard',
      tagline: 'Platform Governance & Security'
    }
  ];

  const handleSelectRole = (cfg) => {
    setSelectedRole(cfg.role);
    setEmail(cfg.email);
    setPassword(cfg.password);
    setAdminMfaCode('');
    setLocalError('');
    if (clearError) clearError();
  };

  const handleOAuthLogin = async (provider = 'google') => {
    setLocalError('');
    setOauthLoading(true);

    try {
      const { authorizationUrl } =
        await oauthService.createAuthorizationRequest(
          provider,
          selectedRole
        );

      // Go to the REAL Google OAuth login page
      window.location.href = authorizationUrl;

    } catch (err) {
      console.error('OAuth initialization failed:', err);

      setLocalError(
        err?.message || 'Unable to start Google authentication.'
      );

      setOauthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (clearError) clearError();

    const cleanInput = (email || '').trim();
    if (!cleanInput) {
      setLocalError('Please enter your email or registered phone number.');
      return;
    }

    try {
      const result = await login({
        email: cleanInput,
        password,
        role: selectedRole,
        rememberMe,
        mfaCode: selectedRole === 'admin' ? (adminMfaCode || null) : null
      }).unwrap();

      if (result?.success || result?.user) {
        const targetCfg = roleConfigs.find(r => r.role === (result.user?.role || selectedRole));
        const destination = redirectPath || (targetCfg ? targetCfg.dashboard : '/home');
        navigate(destination);
      }
    } catch (err) {
      setLocalError(typeof err === 'string' ? err : err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const currentConfig = roleConfigs.find(r => r.role === selectedRole) || roleConfigs[0];
  const isAdmin = selectedRole === 'admin';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #2e1065 0%, #1e1338 60%, #0f172a 100%)',
      padding: '30px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary-600) 0%, #4338ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)'
            }}>
              <Wrench size={24} />
            </div>
            <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              LocalServe
            </span>
          </Link>
          <p style={{ color: '#c4b5fd', fontSize: '0.86rem', marginTop: '6px', fontWeight: 500 }}>
            Unified Commercial Service Platform · 5 Role Portals
          </p>
        </div>

        <Card style={{
          padding: '32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          borderRadius: 'var(--radius-lg)',
          border: isAdmin ? '2px solid #7c3aed' : '1px solid var(--border-light)'
        }}>
          {/* Card Header & Security Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Sign In to Your Account
            </h2>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Shield size={11} /> RFC 7519 JWT
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
            Choose your role portal below to authenticate securely.
          </p>

          {/* 5 User Role Selector Tabs */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Select Portal (5 Roles Supported)
              </span>
              {isAdmin && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#7c3aed',
                  background: '#f5f3ff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #ddd6fe'
                }}>
                  MASTER GOVERNANCE
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {roleConfigs.map((cfg) => {
                const Icon = cfg.icon;
                const isSelected = selectedRole === cfg.role;
                const isCfgAdmin = cfg.role === 'admin';

                return (
                  <button
                    key={cfg.role}
                    type="button"
                    onClick={() => handleSelectRole(cfg)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 2px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected
                        ? isCfgAdmin ? '2px solid #7c3aed' : '2px solid var(--primary-600)'
                        : '1px solid var(--border-light)',
                      background: isSelected
                        ? isCfgAdmin ? '#f5f3ff' : 'var(--primary-50)'
                        : 'var(--bg-muted)',
                      color: isSelected
                        ? isCfgAdmin ? '#6d28d9' : 'var(--primary-800)'
                        : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} color={isSelected ? (isCfgAdmin ? '#7c3aed' : 'var(--primary-600)') : 'var(--text-muted)'} />
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      padding: '0 2px'
                    }}>
                      {cfg.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Security Banner */}
          {isAdmin && (
            <div style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <ShieldAlert size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.82rem', color: '#5b21b6', display: 'block' }}>
                  Enterprise Administrative Console
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#6d28d9', lineHeight: 1.4 }}>
                  Super Admin credentials required. Access grants master control over services, workshops, finance, and system audit logs.
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {(localError || error) && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{localError || error}</span>
            </div>
          )}

          {/* OAuth 2.0 Sign In (Google) */}
          <div style={{ marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '11px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: oauthLoading ? 'default' : 'pointer',
                boxShadow: 'var(--shadow-sm)',
                width: '100%',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-400)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.25 21.35 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.19 0 9.98 0 12s.46 3.81 1.26 5.41l4.02-3.09z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.65 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"/>
              </svg>
              <span>
                {oauthLoading ? 'Initiating PKCE Handshake...' : `Continue with Google (${selectedRole.toUpperCase()})`}
              </span>
            </button>
            <span style={{ display: 'block', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Standard OAuth 2.0 PKCE Single Sign-On
            </span>
          </div>

          {/* Divider */}
          <div style={{ position: 'relative', textAlign: 'center', margin: '14px 0 18px 0' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-light)' }} />
            <span style={{ position: 'relative', background: 'var(--bg-surface)', padding: '0 12px', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              or email & password
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Email Address or Mobile Number"
              icon={Mail}
              type="text"
              required
              placeholder="e.g. rahul.sharma@localserve.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLocalError(''); }}
            />

            <div>
              <Input
                label="Account Password"
                icon={Lock}
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <Link to="/forgot-password" style={{ fontSize: '0.76rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Optional Admin Security Key */}
            {isAdmin && (
              <Input
                label="Admin 2FA Security Key (Optional for Dev)"
                icon={Key}
                type="text"
                placeholder="Enter 6-digit key (Default: 202600)"
                value={adminMfaCode}
                onChange={(e) => setAdminMfaCode(e.target.value)}
              />
            )}

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ cursor: 'pointer', userSelect: 'none' }}>
                Keep me signed in on this browser (7-day JWT session)
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              style={{
                width: '100%',
                marginTop: '4px',
                fontWeight: 800,
                background: isAdmin ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' : undefined
              }}
            >
              Sign In as {selectedRole.toUpperCase()} →
            </Button>
          </form>

          {/* Quick-Fill Credentials Helper Drawer */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
            <button
              type="button"
              onClick={() => setShowCredsDrawer(!showCredsDrawer)}
              style={{
                background: 'transparent',
                border: 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                color: 'var(--primary-700)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="var(--primary-600)" />
                Quick Test Credentials (All 5 Roles)
              </span>
              {showCredsDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showCredsDrawer && (
              <div style={{
                background: 'var(--bg-muted)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                marginTop: '8px',
                fontSize: '0.76rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: '1px solid var(--border-light)'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  Click any role to autofill verified enterprise credentials:
                </span>
                {roleConfigs.map((cfg) => (
                  <div
                    key={cfg.role}
                    onClick={() => handleSelectRole(cfg)}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '8px 10px',
                      borderRadius: '4px',
                      border: selectedRole === cfg.role ? '1.5px solid var(--primary-600)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-primary)', display: 'block' }}>
                        {cfg.label}: {cfg.email}
                      </strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        Pass: <code style={{ color: 'var(--primary-700)' }}>{cfg.password}</code>
                      </span>
                    </div>
                    <button
                      type="button"
                      style={{
                        background: 'var(--primary-50)',
                        border: '1px solid var(--primary-200)',
                        color: 'var(--primary-700)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Autofill
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registration link */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            marginTop: '16px',
            paddingTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.84rem'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>New to LocalServe?</span>
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Create an account →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
