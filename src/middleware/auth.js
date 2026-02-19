const { verifyToken, getTokenFromCookie } = require('../utils/jwt');
const prisma = require('../config/database');

/**
 * Authentication middleware - verifies JWT token from cookie
 */
const authenticate = async (req, res, next) => {
  try {
    const token = getTokenFromCookie(req.cookies);

    if (!token) {
      return res.status(401).error(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      );
    }

    const decoded = verifyToken(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).error(
        'Invalid authentication',
        'AUTH_INVALID',
        401
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).error(
        'Invalid authentication token',
        'AUTH_INVALID',
        401
      );
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).error(
        'Authentication token expired',
        'AUTH_EXPIRED',
        401
      );
    }
    next(error);
  }
};

/**
 * Optional authentication - attaches user if token exists, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromCookie(req.cookies);

    if (token) {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true
        }
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore errors, continue without user
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
