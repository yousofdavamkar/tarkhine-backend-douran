const express = require('express');
const router = express.Router();
const makeSliderController = require('../controllers/sliderController');
const { validateCreateSlider, validateUpdateSlider } = require('../validators/sliderValidator');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorization');
const queryParser = require('../middleware/queryParser');
const { uploadSliderImage } = require('../middleware/sliderUpload');

const sliderController = makeSliderController();

// Public routes
router.get('/', queryParser, optionalAuth, sliderController.getAll);
router.get('/:id', optionalAuth, sliderController.getById);

// Protected routes (require authentication + ADMIN role)
router.post('/', authenticate, requireAdmin, validateCreateSlider, sliderController.create);
router.put('/:id', authenticate, requireAdmin, validateUpdateSlider, sliderController.update);
router.delete('/:id', authenticate, requireAdmin, sliderController.delete);

// Image upload
router.put('/:id/image', authenticate, requireAdmin, uploadSliderImage, sliderController.uploadImage);

module.exports = router;
