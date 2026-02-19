const notFound = (req, res, next) => {
  res.error(
    `Route not found: ${req.method} ${req.originalUrl}`,
    'NOT_FOUND',
    404
  );
};

module.exports = notFound;
