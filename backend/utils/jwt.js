const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'localserve_super_secure_jwt_secret_key_2026_production_auth';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for an authenticated user
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id || user.id,
    email: user.email,
    role: (user.role || 'CUSTOMER').toUpperCase(),
    name: user.name,
    isEmailVerified: Boolean(user.isEmailVerified),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
};
