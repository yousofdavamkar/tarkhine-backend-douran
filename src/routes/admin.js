const express = require('express');
const router = express.Router();
const makeAdminController = require('../controllers/adminController');
const makeAdminService = require('../services/adminService');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorization');
const { validateUpdateRole } = require('../validators/adminValidator');

const adminService = makeAdminService();
const adminController = makeAdminController({ adminService });

// All routes require authentication AND admin role
router.use(authenticate, requireAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination
 * @access  Admin
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Admin
 */
router.get('/users/:id', adminController.getUserById);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Admin
 */
router.put('/users/:id/role', validateUpdateRole, adminController.updateUserRole);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Toggle user active status
 * @access  Admin
 */
router.put('/users/:id/status', adminController.updateUserStatus);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system statistics
 * @access  Admin
 */
router.get('/stats', adminController.getSystemStats);

module.exports = router;
