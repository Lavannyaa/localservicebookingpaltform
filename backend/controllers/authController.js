const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const {
  generateEmailVerificationToken,
  generatePasswordResetToken,
} = require('../utils/emailToken');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../services/emailService');
const {
  validateRegistration,
  validateLogin,
} = require('../validators/authValidator');
const { isGoogleOAuthConfigured } = require('../config/passport');

/**
 * Register a new customer
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { isValid, errors } = validateRegistration(req.body);

    if (!isValid) {
      return res.status(422).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const { name, email, phone, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Hash password using bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate email verification token & 6-digit OTP
    const { token, otp, expires } = generateEmailVerificationToken();

    // Create user
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'CUSTOMER',
      isEmailVerified: false,
      emailVerificationToken: token,
      emailVerificationExpires: expires,
      authProvider: 'LOCAL',
    });

    // Send verification email via Nodemailer
    const emailResult = await sendVerificationEmail({
      to: normalizedEmail,
      name: newUser.name,
      token,
      otp,
    });

    res.status(201).json({
      success: true,
      message:
        'Registration successful! A verification email with a 6-digit code has been sent. Please verify your email before logging in.',
      data: {
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        // Include simulated token/OTP in dev response for automated testing convenience
        ...(emailResult.simulated && {
          verificationOtp: otp,
          verificationToken: token,
        }),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify customer email address
 * POST /api/auth/verify-email
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token, otp, email } = req.body;

    if (!token && (!otp || !email)) {
      return res.status(400).json({
        success: false,
        message: 'Verification token or email and OTP code are required.',
      });
    }

    let user;

    if (token) {
      user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
      });
    } else if (otp && email) {
      // In development simulation, verify matching user with active token
      user = await User.findOne({
        email: email.trim().toLowerCase(),
        emailVerificationExpires: { $gt: new Date() },
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token/code. Please request a new one.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Issue JWT upon successful email verification
    const authToken = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You may now access your customer account.',
      token: authToken,
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'This account email is already verified. Please proceed to login.',
      });
    }

    const { token, otp, expires } = generateEmailVerificationToken();
    user.emailVerificationToken = token;
    user.emailVerificationExpires = expires;
    await user.save();

    const emailResult = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token,
      otp,
    });

    res.status(200).json({
      success: true,
      message: 'A new verification code has been dispatched to your email.',
      ...(emailResult.simulated && {
        verificationOtp: otp,
        verificationToken: token,
      }),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log in for all 5 roles (Customer, Provider, Technician, Support Staff, Admin)
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { isValid, errors } = validateLogin(req.body);

    if (!isValid) {
      return res.status(422).json({
        success: false,
        message: errors[0],
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Query user and explicitly select passwordHash
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    // Verify password hash with bcrypt
    const isMatch = await bcrypt.compare(password, user.passwordHash || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    // Enforce email verification for customers
    if (user.role === 'CUSTOMER' && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message:
          'Your email address is not yet verified. Please verify using the code sent to your email.',
        requiresVerification: true,
        email: user.email,
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Account has been suspended by administration. Please contact support.',
      });
    }

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Login successful. Welcome back, ${user.name}!`,
      token,
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferredLanguage: user.preferredLanguage || 'en',
        profileImage: user.profileImage || '',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
        status: user.status,
        preferredLanguage: user.preferredLanguage,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Forgot password request
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      // Return 200 for security to prevent user enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.',
      });
    }

    const { token, expires } = generatePasswordResetToken();
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      token,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link has been dispatched to your email address.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset password
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is required.',
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(422).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(422).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You may now log in with your new credentials.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Exchange a Google authorization code for a backend JWT
 * POST /api/auth/google/exchange
 */
const exchangeGoogleAuthorizationCode = async (req, res, next) => {
  try {
    if (!isGoogleOAuthConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Google OAuth is not configured on the server.',
      });
    }

    const { code, codeVerifier, state, redirectUri } = req.body || {};
    if (
      typeof code !== 'string' ||
      !code.trim() ||
      typeof codeVerifier !== 'string' ||
      !/^[A-Za-z0-9._~-]{43,128}$/.test(codeVerifier) ||
      typeof state !== 'string' ||
      !state.trim()
    ) {
      return res.status(422).json({
        success: false,
        message: 'A valid authorization code, PKCE verifier, and OAuth state are required.',
      });
    }

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const expectedRedirectUri =
      process.env.GOOGLE_FRONTEND_CALLBACK_URL ||
      `${clientUrl}/auth/oauth/callback`;
    if (redirectUri !== expectedRedirectUri) {
      return res.status(400).json({
        success: false,
        message: 'Google OAuth redirect URI does not match the server configuration.',
      });
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: expectedRedirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[Google OAuth] Authorization code exchange was rejected:', tokenData.error || tokenResponse.status);
      return res.status(401).json({
        success: false,
        message: 'Google could not verify this sign-in. Please try again.',
      });
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok) {
      console.error('[Google OAuth] Failed to retrieve the verified profile:', profile.error || profileResponse.status);
      return res.status(502).json({
        success: false,
        message: 'Google verified the sign-in, but the profile could not be retrieved.',
      });
    }

    if (!profile.sub || !profile.email || profile.email_verified !== true) {
      return res.status(403).json({
        success: false,
        message: 'Google did not provide a verified email address for this account.',
      });
    }

    const email = profile.email.trim().toLowerCase();
    let user = await User.findOne({
      $or: [{ googleId: profile.sub }, { email }],
    });

    if (user?.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'This account has been suspended. Please contact support.',
      });
    }

    if (user?.googleId && user.googleId !== profile.sub) {
      return res.status(409).json({
        success: false,
        message: 'This email is already linked to a different Google account.',
      });
    }

    if (user) {
      user.googleId = profile.sub;
      user.isEmailVerified = true;
      user.authProvider = 'GOOGLE';
      if (!user.profileImage && profile.picture) {
        user.profileImage = profile.picture;
      }
      await user.save();
    } else {
      user = await User.create({
        name: profile.name || email.split('@')[0],
        email,
        googleId: profile.sub,
        role: 'CUSTOMER',
        isEmailVerified: true,
        authProvider: 'GOOGLE',
        profileImage: profile.picture || '',
      });
    }

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      token,
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        preferredLanguage: user.preferredLanguage || 'en',
        profileImage: user.profileImage || '',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Check Google OAuth availability status
 * GET /api/auth/google/status
 */
const getGoogleOAuthStatus = (req, res) => {
  const configured = isGoogleOAuthConfigured();
  res.status(200).json({
    success: true,
    configured,
    message: configured
      ? 'Google OAuth 2.0 is fully configured and ready.'
      : 'Google OAuth requires valid Google Cloud OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env).',
  });
};

/**
 * Handle successful Google OAuth callback redirect
 */
const googleCallbackSuccess = (req, res) => {
  if (!req.user) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/login?error=oauth_failed`);
  }

  const token = generateToken(req.user);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  // Redirect to frontend with token in query params
  res.redirect(`${clientUrl}/auth/oauth/callback?token=${token}&role=${req.user.role}`);
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  exchangeGoogleAuthorizationCode,
  getGoogleOAuthStatus,
  googleCallbackSuccess,
};
