const crypto = require('crypto');

/**
 * Generate a secure 64-char hex token or 6-digit numeric OTP
 */
const generateEmailVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Token expires in 24 hours
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return { token, otp, expires };
};

const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  // Expires in 1 hour
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  return { token, expires };
};

module.exports = {
  generateEmailVerificationToken,
  generatePasswordResetToken,
};
