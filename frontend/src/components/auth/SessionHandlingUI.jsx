import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Clock, ShieldAlert, RefreshCw, LogOut, Key, CheckCircle2, ChevronUp, ChevronDown, ShieldCheck
} from 'lucide-react';

export const SessionHandlingUI = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user,
    role,
    token,
    tokenClaims,
    sessionStatus,
    sessionTimeRemaining,
    checkSession,
    refreshSession,
    logout
  } = useAuth();

  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll session status every 5 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    checkSession();
    const timer = setInterval(() => {
      checkSession();
    }, 5000);
    return () => clearInterval(timer);
  }, [isAuthenticated, checkSession]);

  if (!isAuthenticated || !token) return null;

  const formatRemaining = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    setIsRefreshing(true);
    try {
      await refreshSession();
    } catch (err) {
      console.error('Session extension failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* 1. Expiring Soon Toast / Alert Bar */}
      {sessionStatus === 'expiring_soon' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          border: '1px solid #fde68a',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#fde047" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                Session Expiring Soon: {formatRemaining(sessionTimeRemaining)}
              </div>
              <span style={{ fontSize: '0.76rem', color: '#fef3c7' }}>
                Your authenticated JWT session will expire shortly. Extend now to remain active.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleExtendSession}
              disabled={isRefreshing}
              style={{
                background: '#ffffff',
                color: '#78350f',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Extending...' : 'Extend Session'}
            </button>
            <button
              onClick={handleSignOut}
              style={{
                background: 'rgba(0,0,0,0.25)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* 2. Session Expired Modal */}
      {sessionStatus === 'expired' && (
        <Modal
          isOpen={true}
          title="Session Expired"
          maxWidth="440px"
          onClose={handleSignOut}
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <ShieldAlert size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Your JWT Session Has Expired
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              For your account security and enterprise compliance, sessions automatically timeout after inactivity. Please sign in again to continue your work.
            </p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSignOut}
              style={{ fontWeight: 800 }}
            >
              <LogOut size={16} /> Return to Sign In
            </Button>
          </div>
        </Modal>
      )}

      {/* 3. Collapsible JWT Session Inspector (Developer & Auditor Inspection Badge) */}
      <div style={{
        position: 'fixed',
        bottom: '12px',
        left: '12px',
        zIndex: 1100,
        fontFamily: 'monospace'
      }}>
        {!inspectorOpen ? (
          <button
            onClick={() => setInspectorOpen(true)}
            title="Inspect RFC 7519 JWT Claims & Session Status"
            style={{
              background: '#0f172a',
              color: '#38bdf8',
              border: '1px solid #334155',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
            }}
          >
            <Key size={13} color="#38bdf8" />
            <span>JWT: {role?.toUpperCase()}</span>
            <span style={{ color: '#94a3b8' }}>({formatRemaining(sessionTimeRemaining)})</span>
            <ChevronUp size={12} />
          </button>
        ) : (
          <div style={{
            width: '360px',
            maxWidth: 'calc(100vw - 24px)',
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#38bdf8" />
                <strong style={{ color: '#f8fafc', fontSize: '0.82rem' }}>RFC 7519 JWT Session Claims</strong>
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Subject (sub):</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>{tokenClaims?.sub || user?.userId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Role Claim:</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>{tokenClaims?.role || role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Account:</span>
                <span style={{ color: '#f8fafc' }}>{tokenClaims?.email || user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Session Time Left:</span>
                <span style={{ color: sessionTimeRemaining < 120 ? '#fbbf24' : '#38bdf8', fontWeight: 700 }}>
                  {formatRemaining(sessionTimeRemaining)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Token Status:</span>
                <span style={{ color: '#4ade80' }}>Verified Bearer</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleExtendSession}
                disabled={isRefreshing}
                style={{
                  flex: 1,
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh Token
              </button>
              <button
                onClick={handleSignOut}
                style={{
                  background: '#334155',
                  color: '#f8fafc',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SessionHandlingUI;
