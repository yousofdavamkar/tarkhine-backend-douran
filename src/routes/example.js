const express = require('express');
const router = express.Router();
const makeExampleController = require('../controllers/exampleController');
const makeExampleService = require('../services/exampleService');
const { validateCreateResource, validateUpdateResource } = require('../validators/exampleValidator');
const { authenticate, optionalAuth } = require('../middleware/auth');
const queryParser = require('../middleware/queryParser');

// Initialize service and controller
const exampleService = makeExampleService();
const exampleController = makeExampleController({ exampleService });

// Public routes (with optional auth)
router.get('/resources', queryParser, optionalAuth, exampleController.getAll);
router.get('/resources/:id', optionalAuth, exampleController.getById);

// Protected routes (require authentication)
router.post('/resources', authenticate, validateCreateResource, exampleController.create);
router.put('/resources/:id', authenticate, validateUpdateResource, exampleController.update);
router.delete('/resources/:id', authenticate, exampleController.delete);

module.exports = router;
