import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { jwtService } from '../../services/jwtService';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, role, rememberMe = true, mfaCode = null }, { rejectWithValue }) => {
    try {
      return await authService.login({ email, password, role, rememberMe, mfaCode });
    } catch (err) {
      return rejectWithValue(err.message || 'Authentication failed. Please verify credentials.');
    }
  }
);

export const loginOAuthUser = createAsyncThunk(
  'auth/loginOAuth',
  async ({ provider, role, code, codeVerifier, state }, { rejectWithValue }) => {
    try {
      return await authService.exchangeOAuthCode({ provider, role, code, codeVerifier, state });
    } catch (err) {
      return rejectWithValue(err.message || 'OAuth authorization failed.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData);
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed.');
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async ({ email, role }, { rejectWithValue }) => {
    try {
      return await authService.forgotPassword({ email, role });
    } catch (err) {
      return rejectWithValue(err.message || 'Unable to process password reset.');
    }
  }
);

export const submitPasswordReset = createAsyncThunk(
  'auth/submitPasswordReset',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      return await authService.resetPassword({ token, newPassword });
    } catch (err) {
      return rejectWithValue(err.message || 'Password reset failed.');
    }
  }
);

export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.refreshToken();
    } catch (err) {
      return rejectWithValue(err.message || 'Session refresh failed.');
    }
  }
);

export const switchUserRole = createAsyncThunk(
  'auth/switchRole',
  async (role) => {
    return await authService.switchRole(role);
  }
);

// Initial state initialization from JWT service
const initialToken = typeof window !== 'undefined' ? jwtService.getToken() : null;
const isInitialTokenValid = initialToken && !jwtService.isTokenExpired(initialToken);
const initialUser = isInitialTokenValid ? jwtService.getUser() : null;
const initialClaims = isInitialTokenValid ? jwtService.decodeToken(initialToken) : null;

const initialState = {
  user: initialUser,
  role: initialUser ? initialUser.role : (initialClaims ? initialClaims.role : null),
  token: isInitialTokenValid ? initialToken : null,
  tokenClaims: initialClaims,
  isAuthenticated: !!initialUser,
  loading: false,
  error: null,
  sessionStatus: isInitialTokenValid ? 'active' : 'logged_out',
  sessionTimeRemaining: isInitialTokenValid ? jwtService.getTokenRemainingSeconds(initialToken) : 0,
  passwordResetStatus: {
    requested: false,
    email: null,
    tempToken: null,
    message: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload || {};
      state.token = token || null;
      state.tokenClaims = jwtService.decodeToken(token);
      state.user = user || (state.tokenClaims ? {
        id: state.tokenClaims.userId || state.tokenClaims.sub,
        name: state.tokenClaims.name || 'Google User',
        email: state.tokenClaims.email || '',
        role: (state.tokenClaims.role || 'CUSTOMER').toUpperCase()
      } : null);
      state.role = state.user ? state.user.role : 'CUSTOMER';
      state.isAuthenticated = !!(state.user && state.token);
      state.loading = false;
      state.error = null;
      state.sessionStatus = 'active';
      state.sessionTimeRemaining = token ? jwtService.getTokenRemainingSeconds(token) : 86400;

      if (token) {
        jwtService.setTokens({ accessToken: token, rememberMe: true });
        localStorage.setItem('localserve_token', token);
      }
      if (state.user) {
        jwtService.setUser(state.user, true);
        localStorage.setItem('localserve_user', JSON.stringify(state.user));
      }
    },
    logout(state) {
      authService.logout();
      state.user = null;
      state.role = null;
      state.token = null;
      state.tokenClaims = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.sessionStatus = 'logged_out';
      state.sessionTimeRemaining = 0;
    },
    clearAuthError(state) {
      state.error = null;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    checkSessionState(state) {
      if (!state.token || !state.isAuthenticated) {
        state.sessionStatus = 'logged_out';
        state.sessionTimeRemaining = 0;
        return;
      }

      if (jwtService.isTokenExpired(state.token, 0)) {
        // Expired
        authService.logout();
        state.user = null;
        state.role = null;
        state.token = null;
        state.tokenClaims = null;
        state.isAuthenticated = false;
        state.sessionStatus = 'expired';
        state.sessionTimeRemaining = 0;
      } else {
        const remaining = jwtService.getTokenRemainingSeconds(state.token);
        state.sessionTimeRemaining = remaining;
        // If less than 2 minutes (120 seconds), warn session expiring soon
        state.sessionStatus = remaining < 120 ? 'expiring_soon' : 'active';
      }
    },
    resetPasswordState(state) {
      state.passwordResetStatus = {
        requested: false,
        email: null,
        tempToken: null,
        message: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Email / Password Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;
        state.tokenClaims = jwtService.decodeToken(action.payload.token);
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.sessionStatus = 'active';
        state.sessionTimeRemaining = jwtService.getTokenRemainingSeconds(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // OAuth Login
      .addCase(loginOAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginOAuthUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;
        state.tokenClaims = jwtService.decodeToken(action.payload.token);
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.sessionStatus = 'active';
        state.sessionTimeRemaining = jwtService.getTokenRemainingSeconds(action.payload.token);
      })
      .addCase(loginOAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'OAuth authentication failed';
      })

      // Registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;
        state.tokenClaims = jwtService.decodeToken(action.payload.token);
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.sessionStatus = 'active';
        state.sessionTimeRemaining = jwtService.getTokenRemainingSeconds(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // Password Reset Request
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.passwordResetStatus = {
          requested: true,
          email: action.meta.arg.email,
          tempToken: action.payload.token || null,
          message: action.payload.message
        };
      })

      // Refresh Session
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.tokenClaims = jwtService.decodeToken(action.payload.token);
        state.sessionStatus = 'active';
        state.sessionTimeRemaining = jwtService.getTokenRemainingSeconds(action.payload.token);
      })
      .addCase(refreshSession.rejected, (state) => {
        state.sessionStatus = 'expired';
      })

      // Switch Role
      .addCase(switchUserRole.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;
        state.tokenClaims = jwtService.decodeToken(action.payload.token);
        state.isAuthenticated = true;
        state.sessionStatus = 'active';
        state.sessionTimeRemaining = jwtService.getTokenRemainingSeconds(action.payload.token);
      });
  }
});

export const { setCredentials, logout, clearAuthError, setRole, checkSessionState, resetPasswordState } = authSlice.actions;
export default authSlice.reducer;
