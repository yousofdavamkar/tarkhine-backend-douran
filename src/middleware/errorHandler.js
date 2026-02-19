const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.error(
      'A record with this value already exists',
      'DUPLICATE_RECORD',
      400,
      { field: err.meta?.target }
    );
  }

  if (err.code === 'P2025') {
    return res.error(
      'Record not found',
      'NOT_FOUND',
      404
    );
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.error(
      err.message,
      'VALIDATION_ERROR',
      400
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.error(
      'Invalid token',
      'AUTH_ERROR',
      401
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.error(
      'Token expired',
      'AUTH_ERROR',
      401
    );
  }

  // Rate limit errors
  if (err.name === 'RateLimitError') {
    return res.error(
      'Too many requests',
      'RATE_LIMIT_EXCEEDED',
      429
    );
  }

  // File upload errors
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

  // Default error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.error(message, 'INTERNAL_ERROR', statusCode);
};

module.exports = errorHandler;
