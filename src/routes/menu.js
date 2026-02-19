const express = require('express');
const router = express.Router();
const makeMenuController = require('../controllers/menuController');
const makeMenuService = require('../services/menuService');
const {
  validateCreateMenu,
  validateUpdateMenu,
  validateCreateMenuItem,
  validateUpdateMenuItem,
  validateCreateSubMenuItem,
  validateUpdateSubMenuItem
} = require('../validators/menuValidator');
const { authenticate, optionalAuth } = require('../middleware/auth');
const queryParser = require('../middleware/queryParser');
const { uploadLogo } = require('../middleware/menuUpload');

// Initialize service and controller
const menuService = makeMenuService();
const menuController = makeMenuController({ menuService });

// Public routes (with optional auth)
router.get('/', queryParser, optionalAuth, menuController.getAll);
router.get('/:id', optionalAuth, menuController.getById);

// Protected routes (require authentication)
router.post('/', authenticate, validateCreateMenu, menuController.create);
router.put('/:id', authenticate, validateUpdateMenu, menuController.update);
router.delete('/:id', authenticate, menuController.delete);

// Logo upload
router.put('/:id/logo', authenticate, uploadLogo, menuController.uploadLogo);

// Menu items routes
router.post('/:menuId/items', authenticate, validateCreateMenuItem, menuController.addMenuItem);
router.put('/:menuId/items/:itemId', authenticate, validateUpdateMenuItem, menuController.updateMenuItem);
router.delete('/:menuId/items/:itemId', authenticate, menuController.deleteMenuItem);

// Submenu items routes
router.post(
  '/:menuId/items/:itemId/subitems',
  authenticate,
  validateCreateSubMenuItem,
  menuController.addSubMenuItem
);
router.put(
  '/:menuId/items/:itemId/subitems/:subitemId',
  authenticate,
  validateUpdateSubMenuItem,
  menuController.updateSubMenuItem
);
router.delete(
  '/:menuId/items/:itemId/subitems/:subitemId',
  authenticate,
  menuController.deleteSubMenuItem
);

module.exports = router;
