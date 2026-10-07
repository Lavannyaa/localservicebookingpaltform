import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks';
import { oauthService } from '../../services/oauthService';
import {
  Wrench, User, Building2, HardHat, Mail, Lock, Phone, MapPin,
  AlertCircle, ShieldCheck, CheckCircle2, ArrowRight, ShieldAlert,
  Briefcase
} from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'provider' | 'technician'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Tirunelveli');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [tradeSkill, setTradeSkill] = useState('AC & Refrigeration');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [localError, setLocalError] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);

  const roles = [
    {
      role: 'customer',
      label: 'Customer',
      icon: User,
      desc: 'Book verified local repairs'
    },
    {
      role: 'provider',
      label: 'Workshop Provider',
      icon: Building2,
      desc: 'List commercial repair shop'
    },
    {
      role: 'technician',
      label: 'Field Technician',
      icon: HardHat,
      desc: 'Perform service jobs'
    }
  ];

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'];

  const handleOAuthSignUp = async () => {
    setLocalError('');
    setOauthLoading(true);
    try {
      const { state } = await oauthService.createAuthorizationRequest('google', selectedRole);
      const simulatedAuthCode = `oauth_signup_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      setTimeout(() => {
        navigate(`/auth/oauth/callback?code=${simulatedAuthCode}&state=${encodeURIComponent(state)}`);
      }, 500);
    } catch (err) {
      setLocalError(err.message || 'OAuth signup failed.');
      setOauthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (clearError) clearError();

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify.');
      return;
    }
    if (selectedRole === 'provider' && !shopName.trim()) {
      setLocalError('Please provide your commercial workshop or shop name.');
      return;
    }
    if (!agreedTerms) {
      setLocalError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98000 00000',
        password,
        role: selectedRole,
        city: city.trim() || 'Tirunelveli',
        shopName: selectedRole === 'provider' ? shopName.trim() : undefined,
        shopAddress: selectedRole === 'provider' ? shopAddress.trim() : undefined,
        tradeSkill: selectedRole === 'technician' ? tradeSkill : undefined
      };

      const result = await register(payload).unwrap();
      if (result?.success || result?.user) {
        if (selectedRole === 'provider') {
          navigate('/provider/dashboard');
        } else if (selectedRole === 'technician') {
          navigate('/technician/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      setLocalError(typeof err === 'string' ? err : err?.message || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #2e1065 0%, #1e1338 60%, #0f172a 100%)',
      padding: '30px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>
        {/* Brand */}
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
          <p style={{ color: '#c4b5fd', fontSize: '0.86rem', marginTop: '6px' }}>
            Join the Local Service Commercial Marketplace
          </p>
        </div>

        <Card style={{ padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Create an Account
            </h2>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0'
            }}>
              Free Sign Up
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
            Select your account type to set up your profile and dashboard.
          </p>

          {/* Account Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => { setSelectedRole(r.role); setLocalError(''); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '10px 6px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                    background: isSelected ? 'var(--primary-50)' : 'var(--bg-muted)',
                    color: isSelected ? 'var(--primary-800)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color={isSelected ? 'var(--primary-600)' : 'var(--text-muted)'} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Corporate Provisioning Notice */}
          <div style={{
            background: 'var(--bg-muted)',
            border: '1px solid var(--border-light)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldAlert size={14} color="var(--primary-600)" />
            <span>Administrator & Support Staff accounts require enterprise corporate provisioning.</span>
          </div>

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
              <AlertCircle size={18} />
              <span>{localError || error}</span>
            </div>
          )}

          {/* OAuth Quick Sign Up */}
          <div style={{ marginBottom: '18px' }}>
            <button
              type="button"
              onClick={handleOAuthSignUp}
              disabled={oauthLoading || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: oauthLoading ? 'default' : 'pointer',
                boxShadow: 'var(--shadow-sm)',
                width: '100%'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.25 21.35 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.19 0 9.98 0 12s.46 3.81 1.26 5.41l4.02-3.09z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.65 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"/>
              </svg>
              <span>{oauthLoading ? 'Authenticating with Google...' : `Sign up with Google (${selectedRole.toUpperCase()})`}</span>
            </button>
          </div>

          <div style={{ position: 'relative', textAlign: 'center', margin: '14px 0 18px 0' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-light)' }} />
            <span style={{ position: 'relative', background: 'var(--bg-surface)', padding: '0 10px', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              or with email & password
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label={selectedRole === 'provider' ? 'Workshop Owner / Manager Name' : 'Full Legal Name'}
              icon={User}
              required
              placeholder={selectedRole === 'provider' ? 'e.g. Ramesh Kumar' : 'e.g. Rahul Sharma'}
              value={name}
              onChange={(e) => { setName(e.target.value); setLocalError(''); }}
            />

            {/* Provider-Specific Fields */}
            {selectedRole === 'provider' && (
              <>
                <Input
                  label="Commercial Workshop / Shop Name"
                  icon={Building2}
                  required
                  placeholder="e.g. Kumar Electricals & Motors"
                  value={shopName}
                  onChange={(e) => { setShopName(e.target.value); setLocalError(''); }}
                />
                <Input
                  label="Physical Workshop Street Address"
                  icon={MapPin}
                  placeholder="e.g. 124 South Bypass Road, Palayamkottai"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                />
              </>
            )}

            {/* Technician-Specific Fields */}
            {selectedRole === 'technician' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Primary Trade Specialization
                </label>
                <select
                  value={tradeSkill}
                  onChange={(e) => setTradeSkill(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                >
                  <option value="AC & Refrigeration">AC & Refrigeration Specialist</option>
                  <option value="Licensed Electrician">Licensed Electrician (Domestic & Commercial)</option>
                  <option value="Master Plumber">Master Plumber & Sanitary Fitter</option>
                  <option value="RO Purifier Specialist">RO Water Purifier Technician</option>
                  <option value="Appliance Repair">Washing Machine & Microwave Expert</option>
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLocalError(''); }}
              />
              <Input
                label="Mobile Phone"
                icon={Phone}
                required
                placeholder="+91 98421 23456"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setLocalError(''); }}
              />
            </div>

            <Input
              label="City / District"
              icon={MapPin}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Tirunelveli, Tamil Nadu"
            />

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input
                  label="Password"
                  icon={Lock}
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
                />
                <Input
                  label="Confirm Password"
                  icon={Lock}
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(''); }}
                />
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Security Strength:</span>
                    <span style={{ color: strengthColors[strength], fontWeight: 700 }}>
                      {strengthLabels[strength]}
                    </span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(strength / 4) * 100}%`,
                      background: strengthColors[strength],
                      transition: 'width 0.2s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the LocalServe Terms of Service, Commercial Warranty Standards, and Privacy Policy.
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: '6px', fontWeight: 800 }}
            >
              Register as {roles.find(r => r.role === selectedRole)?.label} →
            </Button>
          </form>

          <div style={{
            borderTop: '1px solid var(--border-light)',
            marginTop: '20px',
            paddingTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.84rem'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>Already have an account?</span>
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 700 }}>
              Sign In to Your Portal →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
