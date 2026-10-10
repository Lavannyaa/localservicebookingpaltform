import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { jwtService } from '../services/jwtService';
import { ShieldAlert, ArrowLeft, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, token, isAuthenticated } = useAuth();

  // 1. Authentication check
  if (!isAuthenticated || !token) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  // 2. JWT Token Expiration check
  if (jwtService.isTokenExpired(token, 0)) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}&expired=true`} replace />;
  }

  // 3. Role-Based Authorization check (case-insensitive & support_staff alias aware)
  const userRole = (role || '').toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => (r || '').toLowerCase());

  const isAuthorized = normalizedAllowedRoles.length === 0 || normalizedAllowedRoles.some(allowed => {
    if (allowed === userRole) return true;
    if (allowed === 'support' && (userRole === 'support_staff' || userRole === 'support')) return true;
    if (allowed === 'support_staff' && (userRole === 'support' || userRole === 'support_staff')) return true;
    return false;
  });

  if (!isAuthorized) {
    const getMyDashboardPath = (uRole) => {
      const lower = (uRole || '').toLowerCase();
      switch (lower) {
        case 'provider': return '/provider/dashboard';
        case 'technician': return '/technician/dashboard';
        case 'support':
        case 'support_staff': return '/support/dashboard';
        case 'admin': return '/admin/dashboard';
        default: return '/customer/dashboard';
      }
    };

    const myDashboard = getMyDashboardPath(role);

    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        background: 'var(--bg-app)'
      }}>
        <Card style={{ maxWidth: '520px', width: '100%', padding: '36px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto',
            border: '2px solid #fca5a5'
          }}>
            <ShieldAlert size={34} />
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Role-Based Access Restricted
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
            You are signed in as <strong>{user?.name || 'User'}</strong> with role <strong>{role?.toUpperCase()}</strong>.
            This area requires one of the following permissions: <strong>{allowedRoles.map(r => r.toUpperCase()).join(' | ')}</strong>.
          </p>

          <div style={{
            background: 'var(--bg-muted)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '24px',
            border: '1px solid var(--border-light)'
          }}>
            Attempted Resource: <code>{location.pathname}</code>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => navigate(myDashboard)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <LayoutDashboard size={16} /> Go to My {role?.toUpperCase()} Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LogIn size={16} /> Switch Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
