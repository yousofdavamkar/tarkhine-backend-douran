const express = require('express');
const router = express.Router();
const makeUploadController = require('../controllers/uploadController');
const makeUploadService = require('../services/uploadService');
const { validateUploadMetadata } = require('../validators/uploadValidator');
const { authenticate } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');

// Initialize service and controller
const uploadService = makeUploadService();
const uploadController = makeUploadController({ uploadService });

// Serve uploaded files statically
router.use('/uploads', express.static('uploads'));

// Protected routes
router.post('/upload/single', authenticate, uploadSingle('file'), validateUploadMetadata, uploadController.uploadSingle);
router.post('/upload/multiple', authenticate, uploadMultiple('files', 10), validateUploadMetadata, uploadController.uploadMultiple);
router.delete('/uploads/:filename', authenticate, uploadController.deleteFile);
router.get('/uploads/:filename/info', uploadController.getFileInfo);

module.exports = router;
