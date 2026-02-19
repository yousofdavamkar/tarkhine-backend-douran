const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
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
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(',');

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB default
  }
});

// Middleware for single file upload
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.error(
            'File size too large',
            'FILE_TOO_LARGE',
            400
          );
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.error(
            'Unexpected file field',
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

      next();
    });
  };
};

// Middleware for multiple file upload
const uploadMultiple = (fieldName, maxCount = 10) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.error(
            'File size too large',
            'FILE_TOO_LARGE',
            400
          );
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.error(
            'Unexpected file field',
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

      next();
    });
  };
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple
};
