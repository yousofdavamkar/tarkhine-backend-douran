const makeSanitizeMiddleware = ({ sanitizer }) => {
  const sanitizeBody = (fields = []) => (req, res, next) => {
    if (fields.length === 0) {
      req.body = sanitizer.sanitizeObject(req.body);
    } else {
      fields.forEach(field => {
        if (req.body[field]) {
          req.body[field] = sanitizer.sanitizeString(req.body[field]);
        }
      });
    }
    next();
  };

  const sanitizeQuery = (req, res, next) => {
    req.query = sanitizer.sanitizeObject(req.query);
    next();
  };

  const sanitizeParams = (req, res, next) => {
    req.params = sanitizer.sanitizeObject(req.params);
    next();
  };

  return { sanitizeBody, sanitizeQuery, sanitizeParams };
};

module.exports = makeSanitizeMiddleware;
