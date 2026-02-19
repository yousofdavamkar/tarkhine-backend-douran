const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'menus');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `logo-${basename}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: jpg, jpeg, png, svg, webp`), false);
  }
};

// Configure multer for menu logo uploads
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// Middleware for single logo upload
const uploadLogo = (req, res, next) => {
  const uploadHandler = upload.single('logo');

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.error(
          'Logo file size must not exceed 2MB',
          'FILE_TOO_LARGE',
          400
        );
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.error(
          'Unexpected file field. Expected: logo',
          'INVALID_FILE_FIELD',
          400
        );
      }
      return res.error(
        err.message,
        'UPLOAD_ERROR',
        400
      );
    }

    if (err) {
      return res.error(
        err.message,
        'UPLOAD_ERROR',
        400
      );
    }

    // Add file path to request for controller to use
    if (req.file) {
      req.logoPath = `/uploads/menus/${req.file.filename}`;
    }

    next();
  });
};

module.exports = {
  upload,
  uploadLogo
};
