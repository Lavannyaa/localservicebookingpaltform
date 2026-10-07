import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks';
import {
  Wrench, Mail, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft, Key, Clock
} from 'lucide-react';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading, error, clearError, passwordResetStatus } = useAuth();

  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [localError, setLocalError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dispatchedToken, setDispatchedToken] = useState('');

  const roles = [
    { id: 'customer', label: 'Customer' },
    { id: 'provider', label: 'Service Provider' },
    { id: 'technician', label: 'Technician' },
    { id: 'support', label: 'Support Staff' },
    { id: 'admin', label: 'Administrator' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (clearError) clearError();

    const clean = (email || '').trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      setLocalError('Please enter a valid registered email address.');
      return;
    }

    try {
      const result = await forgotPassword({ email: clean, role: selectedRole }).unwrap();
      setSubmitted(true);
      if (result?.token) {
        setDispatchedToken(result.token);
      }
    } catch (err) {
      setLocalError(typeof err === 'string' ? err : err?.message || 'Failed to dispatch password reset request.');
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
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--shadow-purple)'
            }}>
              <Wrench size={24} />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>LocalServe</span>
          </Link>
          <p style={{ color: '#c4b5fd', fontSize: '0.86rem', marginTop: '6px' }}>
            Account Recovery & Security Verification
          </p>
        </div>

        <Card style={{ padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
          {!submitted ? (
            <>
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  Forgot Your Password?
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Enter your registered account email and select your role to receive a cryptographic password reset token.
                </p>
              </div>

              {(localError || error) && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} />
                  <span>{localError || error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Role Identity Select */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Account Role Identity
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '6px' }}>
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: 'var(--radius-sm)',
                          border: selectedRole === r.id ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                          background: selectedRole === r.id ? 'var(--primary-50)' : 'var(--bg-muted)',
                          color: selectedRole === r.id ? 'var(--primary-800)' : 'var(--text-secondary)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Registered Email Address"
                  icon={Mail}
                  type="email"
                  required
                  placeholder="e.g. rahul.sharma@localserve.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLocalError(''); }}
                />

                <div style={{
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border-light)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={16} color="var(--primary-600)" />
                  <span>Reset links expire in 15 minutes for your account protection.</span>
                </div>

                <Button type="submit" size="lg" loading={loading} style={{ width: '100%', marginTop: '4px' }}>
                  Send Password Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '2px solid #a7f3d0'
              }}>
                <CheckCircle2 size={32} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Reset Link Dispatched
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                We have generated a secure authorization token and dispatched the recovery instruction to:
              </p>

              <div style={{
                background: 'var(--bg-muted)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                color: 'var(--primary-700)',
                fontSize: '0.9rem',
                marginBottom: '18px',
                border: '1px solid var(--border-light)'
              }}>
                {email}
              </div>

              {dispatchedToken && (
                <div style={{
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  marginBottom: '18px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--primary-800)', fontWeight: 800, marginBottom: '4px' }}>
                    AUTHORIZATION RESET TOKEN (DEMO ENVIRONMENT):
                  </div>
                  <code style={{ fontSize: '0.78rem', color: 'var(--primary-900)', wordBreak: 'break-all', display: 'block', background: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--primary-200)' }}>
                    {dispatchedToken}
                  </code>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate(`/reset-password?token=${encodeURIComponent(dispatchedToken)}`)}
                style={{ marginBottom: '12px', fontWeight: 800 }}
              >
                Proceed to Reset Password <ArrowRight size={16} />
              </Button>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Didn't receive email? Try another address
              </button>
            </div>
          )}

          <div style={{
            borderTop: '1px solid var(--border-light)',
            marginTop: '22px',
            paddingTop: '16px',
            textAlign: 'center'
          }}>
            <Link to="/login" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--primary-600)',
              fontSize: '0.86rem',
              fontWeight: 700
            }}>
              <ArrowLeft size={15} /> Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
