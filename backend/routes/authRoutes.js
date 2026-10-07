const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { passport, isGoogleOAuthConfigured } = require('../config/passport');

// Public Authentication Endpoints
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Google OAuth Status Check
router.get('/google/status', authController.getGoogleOAuthStatus);

// Google OAuth 2.0 Flow
router.get('/google', (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(503).json({
      success: false,
      message:
        'Google OAuth requires valid Google Cloud OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) configured in .env.',
    });
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!isGoogleOAuthConfigured()) {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      return res.redirect(`${clientUrl}/login?error=oauth_unconfigured`);
    }
    passport.authenticate('google', {
      failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth_failed`,
      session: false,
    })(req, res, next);
  },
  authController.googleCallbackSuccess
);

// Protected Auth Endpoints
router.get('/me', authenticateUser, authController.getMe);

module.exports = router;
