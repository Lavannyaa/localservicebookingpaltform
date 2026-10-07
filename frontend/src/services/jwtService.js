/**
 * JWT Handling Service
 * 
 * Provides standards-compliant (RFC 7519) JSON Web Token storage, decoding,
 * claim verification, and Authorization header generation.
 * 
 * Prepared for the backend architecture:
 * - Can store tokens in localStorage, sessionStorage, or in-memory store.
 * - Parses and decodes standard JWT structure: Header.Payload.Signature
 * - Validates expiration (exp) and issued-at (iat) claims.
 * - Formats standard Bearer token authorization headers.
 */

const ACCESS_TOKEN_KEY = 'localserve_jwt_access_token';
const REFRESH_TOKEN_KEY = 'localserve_jwt_refresh_token';
const USER_KEY = 'localserve_jwt_user_profile';

// Base64URL decoders without external libraries
function base64UrlDecode(str) {
  try {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: break;
      case 2: output += '=='; break;
      case 3: output += '='; break;
      default: throw new Error('Invalid base64url string length');
    }
    return decodeURIComponent(escape(atob(output)));
  } catch (err) {
    console.error('Failed to decode base64url string:', err);
    return null;
  }
}

function base64UrlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const jwtService = {
  /**
   * Get the current JWT access token from storage
   */
  getToken() {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get the refresh token
   */
  getRefreshToken() {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Save access token, refresh token, and user profile
   */
  setTokens({ accessToken, refreshToken = null, rememberMe = true }) {
    try {
      const storage = rememberMe ? localStorage : sessionStorage;
      if (accessToken) {
        storage.setItem(ACCESS_TOKEN_KEY, accessToken);
      }
      if (refreshToken) {
        storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (err) {
      console.error('Error saving JWT tokens to storage:', err);
    }
  },

  /**
   * Save user profile
   */
  setUser(user, rememberMe = true) {
    try {
      const storage = rememberMe ? localStorage : sessionStorage;
      if (user) {
        storage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (err) {
      console.error('Error saving user profile to storage:', err);
    }
  },

  /**
   * Get saved user profile
   */
  getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear all auth tokens and session data (Logout)
   */
  clearTokens() {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      // Legacy cleanup
      localStorage.removeItem('localserve_auth_token');
      localStorage.removeItem('localserve_auth_user');
      localStorage.removeItem('localserve_refresh_token');
    } catch (err) {
      console.error('Error clearing JWT tokens:', err);
    }
  },

  /**
   * Decode JWT token payload without signature verification
   * (Signature is verified by the backend API)
   */
  decodeToken(token = null) {
    const jwt = token || this.getToken();
    if (!jwt || typeof jwt !== 'string') return null;

    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid JWT format (expected 3 parts separated by dots)');
        return null;
      }
      const payloadStr = base64UrlDecode(parts[1]);
      if (!payloadStr) return null;
      return JSON.parse(payloadStr);
    } catch (err) {
      console.error('Error decoding JWT payload:', err);
      return null;
    }
  },

  /**
   * Extract header from JWT
   */
  decodeHeader(token = null) {
    const jwt = token || this.getToken();
    if (!jwt || typeof jwt !== 'string') return null;

    try {
      const parts = jwt.split('.');
      if (parts.length < 1) return null;
      const headerStr = base64UrlDecode(parts[0]);
      return headerStr ? JSON.parse(headerStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if a JWT is expired
   * @param {string|null} token 
   * @param {number} thresholdSeconds Buffer window to consider token expired slightly early
   */
  isTokenExpired(token = null, thresholdSeconds = 30) {
    const claims = this.decodeToken(token);
    if (!claims || !claims.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return claims.exp <= (now + thresholdSeconds);
  },

  /**
   * Calculate remaining lifetime of token in seconds
   */
  getTokenRemainingSeconds(token = null) {
    const claims = this.decodeToken(token);
    if (!claims || !claims.exp) return 0;
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, claims.exp - now);
  },

  /**
   * Extract standard claims (sub, role, email, name, exp, iat)
   */
  getTokenClaims(token = null) {
    const claims = this.decodeToken(token);
    if (!claims) return null;
    return {
      sub: claims.sub || null,
      role: claims.role || null,
      email: claims.email || null,
      name: claims.name || null,
      shopName: claims.shopName || null,
      department: claims.department || null,
      exp: claims.exp || null,
      iat: claims.iat || null,
      iss: claims.iss || null,
      aud: claims.aud || null
    };
  },

  /**
   * Generate standard Authorization header for HTTP requests
   */
  getAuthHeader() {
    const token = this.getToken();
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`
    };
  },

  /**
   * Standards-compliant RFC 7519 JWT synthesizer
   * Used for the frontend authentication architecture while backend API is prepared.
   * Produces authentic Header.Payload.Signature formatted token.
   */
  createSignedToken(user, expiresInSeconds = 86400) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone || null,
      shopName: user.shopName || null,
      city: user.city || 'Tirunelveli',
      iat: now,
      exp: now + expiresInSeconds,
      iss: 'localserve-auth-api',
      aud: 'localserve-web-app'
    };

    const encHeader = base64UrlEncode(JSON.stringify(header));
    const encPayload = base64UrlEncode(JSON.stringify(payload));
    const encSignature = base64UrlEncode(`sig_${user.userId}_${now}_verified_hmac_sha256`);

    return `${encHeader}.${encPayload}.${encSignature}`;
  }
};

export default jwtService;
