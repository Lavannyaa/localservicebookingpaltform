const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Authenticate incoming HTTP request by verifying JWT Bearer token
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No valid Bearer token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
      });
    }

    // Attach user record to request
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'This account has been suspended by platform administration.',
      });
    }

    req.user = user;
    req.userRole = (user.role || 'CUSTOMER').toUpperCase();
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Authentication error: ${err.message}`,
    });
  }
};

module.exports = { authenticateUser };
