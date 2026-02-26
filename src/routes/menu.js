const express = require('express');
const router = express.Router();
const makeMenuController = require('../controllers/menuController');
const makeMenuService = require('../services/menuService');
const {
  validateCreateMenu,
  validateUpdateMenu
} = require('../validators/menuValidator');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorization');
const queryParser = require('../middleware/queryParser');

// Initialize service and controller
const menuService = makeMenuService();
const menuController = makeMenuController({ menuService });

// Public routes (with optional auth)
router.get('/', queryParser, optionalAuth, menuController.getAll);
router.get('/:id', optionalAuth, menuController.getById);

// Protected routes (require authentication + ADMIN role)
router.post('/', authenticate, requireAdmin, validateCreateMenu, menuController.create);
router.put('/:id', authenticate, requireAdmin, validateUpdateMenu, menuController.update);
router.delete('/:id', authenticate, requireAdmin, menuController.delete);

module.exports = router;
