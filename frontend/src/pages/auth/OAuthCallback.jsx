import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks';
import { oauthService } from '../../services/oauthService';
import { jwtService } from '../../services/jwtService';
import { setCredentials } from '../../store/slices/authSlice';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loginOAuth } = useAuth();
  const callbackStarted = useRef(false);

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    if (callbackStarted.current) return;
    callbackStarted.current = true;

    const processCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const directToken = searchParams.get('token');
        const roleParam = searchParams.get('role');

        // CASE 1: Backend Passport Google OAuth completed — token passed directly in query params
        if (directToken) {
          const claims = jwtService.decodeToken(directToken) || {};
          const userObj = {
            id: claims.userId || claims.sub || 'usr-google',
            name: claims.name || 'Lavannya (Google User)',
            email: claims.email || 'lavannyaalavannyaa@gmail.com',
            role: (claims.role || roleParam || 'CUSTOMER').toUpperCase()
          };

          // Dispatch Redux action so isAuthenticated=true and Navbar displays Customer Name immediately
          dispatch(setCredentials({ user: userObj, token: directToken }));

          setAuthenticatedUser(userObj);
          setStatus('success');

          const userRole = (userObj.role || roleParam || 'CUSTOMER').toLowerCase();
          let targetPath = '/home';
          if (userRole === 'provider') targetPath = '/provider/dashboard';
          else if (userRole === 'technician') targetPath = '/technician/dashboard';
          else if (userRole === 'support') targetPath = '/support/dashboard';
          else if (userRole === 'admin') targetPath = '/admin/dashboard';

          setTimeout(() => {
            navigate(targetPath, { replace: true });
          }, 800);
          return;
        }

        // CASE 2: Frontend PKCE Authorization Code Flow
        const oauthData = oauthService.validateCallback(searchParams);

        const result = await loginOAuth({
          provider: oauthData.provider || 'google',
          role: oauthData.role || 'customer',
          code: oauthData.code,
          codeVerifier: oauthData.codeVerifier,
          state: searchParams.get('state'),
          redirectUri: oauthData.redirectUri
        }).unwrap();

        oauthService.clearSession();

        if (result?.user || result?.token) {
          const userObj = result.user || { name: 'Google User', role: oauthData.role || 'CUSTOMER' };
          if (result.token) {
            dispatch(setCredentials({ user: userObj, token: result.token }));
          }
          setAuthenticatedUser(userObj);
          setStatus('success');

          const userRole = (userObj.role || oauthData.role || 'customer').toLowerCase();
          let targetPath = '/home';
          if (userRole === 'provider') targetPath = '/provider/dashboard';
          else if (userRole === 'technician') targetPath = '/technician/dashboard';
          else if (userRole === 'support') targetPath = '/support/dashboard';
          else if (userRole === 'admin') targetPath = '/admin/dashboard';

          setTimeout(() => {
            navigate(targetPath, { replace: true });
          }, 800);
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
  }, [location.search, loginOAuth, navigate, dispatch]);

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
              Verifying Google Single Sign-On
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Validating Google identity credentials and preparing your role dashboard...
            </p>
            <LoadingSpinner message="Completing secure sign-in..." />
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
              Welcome back, <strong>{authenticatedUser?.name || 'Google User'}</strong>! Redirecting to your <strong>{authenticatedUser?.role?.toUpperCase() || 'CUSTOMER'}</strong> portal...
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
