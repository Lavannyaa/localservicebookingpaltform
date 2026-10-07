/**
 * Restrict endpoint access to specified user roles
 * Example usage: authorizeRoles('ADMIN', 'SUPPORT_STAFF')
 */
const authorizeRoles = (...allowedRoles) => {
  const normalizedRoles = allowedRoles.map((r) => r.toUpperCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before verifying role authorization.',
      });
    }

    const currentRole = (req.user.role || '').toUpperCase();

    if (!normalizedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access denied. Your role '${currentRole}' is not authorized to access this resource. Required: [${normalizedRoles.join(', ')}].`,
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
