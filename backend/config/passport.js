const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL =
  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

const isGoogleOAuthConfigured = () => {
  return Boolean(
    clientID &&
      clientSecret &&
      clientID.trim() !== '' &&
      clientSecret.trim() !== ''
  );
};

if (isGoogleOAuthConfigured()) {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0] ? profile.emails[0].value : null;

          if (!email) {
            return done(new Error('Google profile did not provide an email address'), null);
          }

          // Check if user exists by googleId or email
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: email.toLowerCase() }],
          });

          if (user) {
            // Update Google ID and verify status if not set
            if (!user.googleId) user.googleId = profile.id;
            user.isEmailVerified = true;
            if (user.authProvider !== 'GOOGLE') {
              user.authProvider = 'GOOGLE';
            }
            if (profile.photos && profile.photos[0] && !user.profileImage) {
              user.profileImage = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }

          // Create new user for first-time Google sign-in
          user = await User.create({
            name: profile.displayName || email.split('@')[0],
            email: email.toLowerCase(),
            googleId: profile.id,
            role: 'CUSTOMER',
            isEmailVerified: true,
            authProvider: 'GOOGLE',
            profileImage:
              profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  console.log('[Google OAuth] Google Strategy initialized successfully.');
} else {
  console.warn(
    '[Google OAuth Notice] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not configured in .env. Real Google OAuth requires valid Google Cloud Console credentials.'
  );
}

module.exports = { passport, isGoogleOAuthConfigured };
