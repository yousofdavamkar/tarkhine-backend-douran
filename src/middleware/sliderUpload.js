const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'sliders');
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
        cb(null, `slider-${basename}-${uniqueSuffix}${ext}`);
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

// Configure multer for slider image uploads
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for sliders (larger area)
    }
});

// Middleware for single slider upload
const uploadSliderImage = (req, res, next) => {
    const uploadSingle = upload.single('image');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.error('File size cannot exceed 5MB', 'FILE_TOO_LARGE', 400);
            }
            return res.error(err.message, 'UPLOAD_ERROR', 400);
        } else if (err) {
            return res.error(err.message, 'INVALID_FILE_TYPE', 400);
        }

        // Attach file path to request if file was uploaded
        if (req.file) {
            // Create relative path for DB storage (e.g., /uploads/sliders/filename.jpg)
            req.imagePath = `/uploads/sliders/${req.file.filename}`;
        }

        next();
    });
};

module.exports = {
    uploadSliderImage
};
