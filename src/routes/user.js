const express = require('express');
const router = express.Router();

// Controllers and Services
const makeUserController = require('../controllers/userController');
const makeUserService = require('../services/userService');

// Middleware
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorization');
const rateLimit = require('express-rate-limit');

// Validators
const { validateRegister, validateLogin, validateUpdateRole } = require('../validators/userValidator');

// Initialize service and controller
const userService = makeUserService();
const userController = makeUserController({ userService });

// Rate limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    skipSuccessfulRequests: true,
    message: 'Too many authentication attempts. Please try again later.'
});

// ==========================================
// Public/Auth Routes
// ==========================================
router.post('/signup', validateRegister, userController.signup);
router.post('/signin', authLimiter, validateLogin, userController.signin);

// ==========================================
// Protected Routes (Logged In Users)
// ==========================================
router.post('/signout', authenticate, userController.signout);
router.get('/me', authenticate, userController.me);

// ==========================================
// Admin Operations
// ==========================================
// Apply admin checks to all subsequent routes
router.use(authenticate, requireAdmin);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Admin
 */
router.get('/', userController.getAllUsers);

/**
 * @route   GET /api/users/stats
 * @desc    Get system statistics
 * @access  Admin
 */
router.get('/stats', userController.getSystemStats);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Admin
 */
router.get('/:id', userController.getUserById);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role
 * @access  Admin
 */
router.put('/:id/role', validateUpdateRole, userController.updateUserRole);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Toggle user active status
 * @access  Admin
 */
router.put('/:id/status', userController.updateUserStatus);

module.exports = router;
