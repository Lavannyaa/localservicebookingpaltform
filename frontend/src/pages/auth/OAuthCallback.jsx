import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { oauthService } from '../../services/oauthService';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { AlertCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginOAuth } = useAuth();

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);

        // 1. Validate PKCE code verifier and CSRF state parameters
        const oauthData = oauthService.validateCallback(searchParams);

        // 2. Exchange authorization code with backend API layer for real JWT
        const result = await loginOAuth({
          provider: oauthData.provider || 'google',
          role: oauthData.role || 'customer',
          code: oauthData.code,
          codeVerifier: oauthData.codeVerifier,
          state: searchParams.get('state')
        }).unwrap();

        // 3. Clear transient handshake session
        oauthService.clearSession();

        if (result?.user) {
          setAuthenticatedUser(result.user);
          setStatus('success');

          // Determine target role dashboard
          const userRole = result.user.role || oauthData.role || 'customer';
          let targetPath = '/customer/dashboard';
          if (userRole === 'provider') targetPath = '/provider/dashboard';
          else if (userRole === 'technician') targetPath = '/technician/dashboard';
          else if (userRole === 'support') targetPath = '/support/dashboard';
          else if (userRole === 'admin') targetPath = '/admin/dashboard';

          // Short delay for visual confirmation
          setTimeout(() => {
            navigate(targetPath, { replace: true });
          }, 700);
        } else {
          throw new Error('OAuth authentication exchange returned no user credentials.');
        }
      } catch (err) {
        console.error('OAuth Callback processing failed:', err);
        oauthService.clearSession();
        setStatus('error');
        setErrorMessage(typeof err === 'string' ? err : err?.message || 'OAuth authentication verification failed.');
      }
    };

    processCallback();
  }, [location.search, loginOAuth, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, #2e1065 0%, #1e1338 60%, #0f172a 100%)',
      padding: '20px'
    }}>
      <Card style={{ padding: '36px', maxWidth: '460px', width: '100%', textAlign: 'center' }}>
        {status === 'processing' && (
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Verifying OAuth 2.0 PKCE Handshake
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Exchanging authorization code with identity provider, validating cryptographic signatures, and generating your secure JWT session token...
            </p>
            <LoadingSpinner message="Completing secure single sign-on..." />
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '2px solid #a7f3d0'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Authentication Certified!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
              Signed in as <strong>{authenticatedUser?.name || 'Verified User'}</strong>. Redirecting to your <strong>{authenticatedUser?.role?.toUpperCase()}</strong> dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
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
              <AlertCircle size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              OAuth Verification Failed
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '20px' }}>
              {errorMessage}
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate('/login')}
              style={{ fontWeight: 700 }}
            >
              Return to Sign In
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OAuthCallback;
