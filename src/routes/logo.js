const express = require('express');
const router = express.Router();
const makeLogoController = require('../controllers/logoController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorization');
const { uploadLogo } = require('../middleware/menuUpload');

// Initialize controller
const logoController = makeLogoController();

// Public route to get the global site logo
router.get('/', optionalAuth, logoController.getLogo);

// Protected Admin route to upload/replace the core global site logo
router.put('/', authenticate, requireAdmin, uploadLogo, logoController.uploadLogo);

module.exports = router;
