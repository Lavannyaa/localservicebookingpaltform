import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks';
import {
  Wrench, Lock, Key, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck
} from 'lucide-react';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, loading, error, clearError } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(newPassword);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (clearError) clearError();

    if (!token.trim()) {
      setLocalError('Please provide the authorization reset token.');
      return;
    }
    if (newPassword.length < 8) {
      setLocalError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify.');
      return;
    }

    try {
      await resetPassword({ token: token.trim(), newPassword }).unwrap();
      setSuccess(true);
    } catch (err) {
      setLocalError(typeof err === 'string' ? err : err?.message || 'Password reset failed. Invalid or expired token.');
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
            Secure Password Reset
          </p>
        </div>

        <Card style={{ padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
          {!success ? (
            <>
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  Set New Password
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Enter your authorization token and create a strong, new password.
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

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Input
                  label="Reset Authorization Token"
                  icon={Key}
                  type="text"
                  required
                  placeholder="rst_..."
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setLocalError(''); }}
                />

                <div>
                  <Input
                    label="New Password"
                    icon={Lock}
                    type="password"
                    required
                    placeholder="Min 8 chars, uppercase, number, symbol"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setLocalError(''); }}
                  />

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Strength:</span>
                        <span style={{ color: strengthColors[strength], fontWeight: 700 }}>
                          {strengthLabels[strength]}
                        </span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(strength / 4) * 100}%`,
                          background: strengthColors[strength],
                          transition: 'width 0.2s ease, background 0.2s ease'
                        }} />
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm New Password"
                  icon={Lock}
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(''); }}
                />

                <Button type="submit" size="lg" loading={loading} style={{ width: '100%', marginTop: '6px', fontWeight: 800 }}>
                  Update Password & Secure Account
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
                Password Updated Successfully
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                Your account password has been updated and certified. You can now sign in with your updated credentials.
              </p>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
                style={{ fontWeight: 800 }}
              >
                Sign In to LocalServe
              </Button>
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

export default ResetPassword;
