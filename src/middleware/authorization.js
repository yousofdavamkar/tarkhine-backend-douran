/**
 * Authorization middleware for role-based access control
 */

/**
 * Role-based authorization middleware factory
 * Creates middleware that checks if authenticated user has required role
 *
 * @param {...string} allowedRoles - Roles that can access the route
 * @returns {Function} Express middleware
 *
 * @example
 * // Only admins can access
 * router.get('/admin', authorize('ADMIN'), adminController.dashboard)
 *
 * // Both admins and users can access
 * router.get('/profile', authorize('ADMIN', 'USER'), profileController.show)
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Must be authenticated first
    if (!req.user) {
      return res.status(401).error(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      );
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).error(
        'Insufficient permissions',
        'INSUFFICIENT_PERMISSIONS',
        403
      );
    }

    next();
  };
};

/**
 * Admin-only middleware
 * Shortcut for authorize('ADMIN')
 *
 * @example
 * router.delete('/users/:id', requireAdmin, userController.delete)
 */
const requireAdmin = authorize('ADMIN');

/**
 * Allow all authenticated users
 * Shortcut for authorize('ADMIN', 'USER')
 *
 * @example
 * router.get('/profile', requireAuth, profileController.show)
 */
const requireAuth = authorize('ADMIN', 'USER');

/**
 * Check if current user is accessing their own resource
 * Useful for routes like /users/:id where user can only access their own data
 * Admins can access any resource
 *
 * @param {Function} getIdFromReq - Function to extract resource ID from request
 * @returns {Function} Express middleware
 *
 * @example
 * // User can only update their own profile, admins can update any
 * router.put('/users/:id',
 *   requireOwnership(req => req.params.id),
 *   userController.updateProfile
 * )
 */
const requireOwnership = (getIdFromReq) => {
  return (req, res, next) => {
    // Must be authenticated first
    if (!req.user) {
      return res.status(401).error(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      );
    }

    const resourceId = parseInt(getIdFromReq(req));

    // Admins can access any resource
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Users can only access their own resources
    if (req.user.id !== resourceId) {
      return res.status(403).error(
        'Access denied',
        'ACCESS_DENIED',
        403
      );
    }

    next();
  };
};

module.exports = {
  authorize,
  requireAdmin,
  requireAuth,
  requireOwnership
};
