/**
 * OAuth 2.0 Frontend Integration Service
 * 
 * Implements the standard Authorization Code Flow with PKCE (Proof Key for Code Exchange)
 * for OAuth identity providers (e.g. Google OAuth 2.0).
 * 
 * Security Features:
 * - Generates high-entropy cryptographic code_verifier
 * - Generates SHA-256 code_challenge via Web Crypto API (crypto.subtle)
 * - Cryptographically random CSRF state nonce verification
 * - Exchanges the authorization code through the backend using PKCE
 */

const OAUTH_STORAGE_KEY = 'localserve_oauth_session';

// Helper to generate cryptographically random strings
function generateRandomString(length = 64) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  if (typeof window === 'undefined' || !window.crypto) {
    throw new Error('Secure browser cryptography is required to start Google sign-in.');
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

// Convert ArrayBuffer to Base64URL string
function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generate SHA-256 PKCE Code Challenge
async function generateCodeChallenge(codeVerifier) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Secure PKCE support is unavailable in this browser.');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToBase64Url(digest);
}

export const oauthService = {
  // Configurable OAuth Provider Settings
  config: {
    google: {
      clientId: typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID 
        ? import.meta.env.VITE_GOOGLE_CLIENT_ID 
        : '',
      authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      scopes: ['openid', 'email', 'profile'],
      redirectUri: typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/oauth/callback` 
        : 'http://localhost:5173/auth/oauth/callback'
    }
  },

  /**
   * Initialize OAuth PKCE Session & Build Authorization URL
   */
  async createAuthorizationRequest(provider = 'google', role = 'customer', customRedirectUri = null) {
    const providerConfig = this.config[provider];
    if (!providerConfig) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
    if (!providerConfig.clientId) {
      throw new Error('Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in frontend/.env.');
    }

    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const stateNonce = generateRandomString(32);

    const redirectUri = customRedirectUri || providerConfig.redirectUri;

    // Structured state object preserving role and return context
    const stateData = {
      nonce: stateNonce,
      provider,
      role,
      redirectUri,
      createdAt: Date.now()
    };

    const encodedState = btoa(JSON.stringify(stateData))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Persist PKCE verifier and state in sessionStorage for verification on return
    sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify({
      codeVerifier,
      encodedState,
      provider,
      role,
      redirectUri,
      timestamp: Date.now()
    }));

    // Build standard OAuth 2.0 PKCE Query Parameters
    const params = new URLSearchParams({
      client_id: providerConfig.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: providerConfig.scopes.join(' '),
      state: encodedState,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'select_account'
    });

    const authorizationUrl = `${providerConfig.authEndpoint}?${params.toString()}`;

    return {
      authorizationUrl,
      codeVerifier,
      state: encodedState,
      role
    };
  },

  /**
   * Process the OAuth callback URL parameters (code, state, error)
   */
  validateCallback(searchParams) {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      this.clearSession();
      throw new Error(`OAuth Authorization Error: ${errorDescription || error}`);
    }

    if (!code) {
      this.clearSession();
      throw new Error('Authorization failed: No authorization code received from identity provider.');
    }

    if (!state) {
      this.clearSession();
      throw new Error('CSRF Security Alert: Missing OAuth state parameter.');
    }

    // Retrieve saved PKCE session from sessionStorage
    const savedSessionRaw = sessionStorage.getItem(OAUTH_STORAGE_KEY);
    if (!savedSessionRaw) {
      throw new Error('OAuth session timed out or invalid session storage. Please initiate sign-in again.');
    }

    let savedSession;
    try {
      savedSession = JSON.parse(savedSessionRaw);
    } catch {
      this.clearSession();
      throw new Error('Corrupted OAuth session state.');
    }

    // CSRF verification: compare state parameters
    if (savedSession.encodedState !== state) {
      this.clearSession();
      throw new Error('CSRF Security Validation Failed: OAuth state mismatch.');
    }

    // Check expiration (max 10 minutes)
    if (Date.now() - savedSession.timestamp > 10 * 60 * 1000) {
      this.clearSession();
      throw new Error('OAuth session has expired. Please initiate login again.');
    }

    return {
      code,
      codeVerifier: savedSession.codeVerifier,
      provider: savedSession.provider,
      role: savedSession.role,
      redirectUri: savedSession.redirectUri
    };
  },

  /**
   * Clear the active OAuth handshake session
   */
  clearSession() {
    try {
      sessionStorage.removeItem(OAUTH_STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing OAuth session:', err);
    }
  }
};

export default oauthService;
