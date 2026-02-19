const express = require('express');
const router = express.Router();
const makeAuthController = require('../controllers/authController');
const makeAuthService = require('../services/authService');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Initialize service and controller
const authService = makeAuthService();
const authController = makeAuthController({ authService });

// Rate limiter for auth routes (prevents brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts. Please try again later.'
});

// Public routes
router.post('/signup', validateRegister, authController.signup);
router.post('/signin', authLimiter, validateLogin, authController.signin);

// Protected routes (require authentication)
router.post('/signout', authenticate, authController.signout);
router.get('/me', authenticate, authController.me);

module.exports = router;
