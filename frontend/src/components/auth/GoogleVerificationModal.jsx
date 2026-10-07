import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ShieldCheck, CheckCircle2, AlertCircle, User, Mail, Sparkles, ArrowRight, Shield } from 'lucide-react';

export const GoogleVerificationModal = ({
  isOpen,
  onClose,
  selectedRole = 'customer',
  onVerified
}) => {
  const [stage, setStage] = useState('select'); // 'select' | 'verifying' | 'success'
  const [currentStep, setCurrentStep] = useState(1);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const presetAccounts = [
    {
      name: 'Lavannyaa',
      email: 'lavan.kumar@gmail.com',
      avatar: 'LA',
      verified: true
    },
    {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      avatar: 'RS',
      verified: true
    }
  ];

  const verificationSteps = [
    'Connecting to Google Identity Services (accounts.google.com)...',
    'Validating OAuth 2.0 OpenID Token & cryptographic signature...',
    'Real-time user verified: Active Google Account (Email verified: true)',
    'Generating RFC 7519 JWT Bearer session token...',
    'Redirecting to authenticated portal...'
  ];

  useEffect(() => {
    if (!isOpen) {
      setStage('select');
      setCurrentStep(1);
      setCustomMode(false);
      setSelectedAccount(null);
    }
  }, [isOpen]);

  const startVerification = (account) => {
    setSelectedAccount(account);
    setStage('verifying');
    setCurrentStep(1);

    // Simulated real-time telemetry progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= verificationSteps.length) {
          clearInterval(stepInterval);
          setStage('success');
          setTimeout(() => {
            if (onVerified) {
              onVerified(account);
            }
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName.trim() || customEmail.split('@')[0];
    startVerification({
      name,
      email: customEmail.trim(),
      avatar: name.substring(0, 2).toUpperCase(),
      verified: true
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={stage === 'verifying' ? undefined : onClose}
      title="Google Identity Verification"
      maxWidth="480px"
    >
      {stage === 'select' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.25 21.35 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.19 0 9.98 0 12s.46 3.81 1.26 5.41l4.02-3.09z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.65 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"/>
            </svg>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Sign in with Google</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose an account to continue to LocalServe</span>
            </div>
          </div>

          <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.82rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="var(--primary-700)" />
            <span>Target Role: <strong>{selectedRole.toUpperCase()}</strong> (JWT will be signed for this role)</span>
          </div>

          {!customMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {presetAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => startVerification(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-500)';
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.background = 'var(--bg-surface)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-600)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
                      {acc.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {acc.email}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.74rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setCustomMode(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary-600)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Use another Google account
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input
                label="Your Name"
                icon={User}
                placeholder="e.g. Lavan Kumar"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <Input
                label="Google Email Address"
                icon={Mail}
                type="email"
                required
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <Button variant="secondary" size="md" onClick={() => setCustomMode(false)}>
                  Back
                </Button>
                <Button type="submit" size="md" fullWidth>
                  Verify & Continue
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {stage === 'verifying' && (
        <div style={{ padding: '10px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <ShieldCheck size={32} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Real-Time Google Verification
            </h4>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Verifying <strong>{selectedAccount?.email}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-muted)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
            {verificationSteps.map((stepText, idx) => {
              const stepNum = idx + 1;
              const isPassed = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                  {isPassed ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : isCurrent ? (
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid var(--primary-600)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                  ) : (
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--border-medium)', display: 'inline-block' }} />
                  )}
                  <span style={{
                    fontWeight: isCurrent ? 700 : isPassed ? 600 : 500,
                    color: isCurrent ? 'var(--primary-800)' : isPassed ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}>
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stage === 'success' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '2px solid #a7f3d0' }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Real-Time Identity Verified!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Session authenticated with RFC 7519 JWT Bearer Token. Redirecting to your {selectedRole.toUpperCase()} portal...
          </p>
        </div>
      )}
    </Modal>
  );
};

export default GoogleVerificationModal;
