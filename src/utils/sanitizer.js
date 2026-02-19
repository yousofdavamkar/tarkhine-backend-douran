const validator = require('validator');

const makeSanitizer = () => ({
  // Sanitize string input
  sanitizeString: (input) => {
    if (typeof input !== 'string') return '';
    return validator.escape(input.trim());
  },

  // Sanitize email
  sanitizeEmail: (email) => {
    return validator.normalizeEmail(email?.trim()) || '';
  },

  // Sanitize array of strings
  sanitizeArray: (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => validator.escape(String(item).trim()));
  },

  // Sanitize object keys and values
  sanitizeObject: (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = validator.escape(key.trim());
      sanitized[sanitizedKey] = typeof value === 'string'
        ? validator.escape(value.trim())
        : value;
    }
    return sanitized;
  },

  // Remove potentially dangerous HTML
  stripHtml: (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]*>/g, '');
  },

  // Validate and sanitize URL
  sanitizeUrl: (url) => {
    return validator.isURL(url) ? url : '';
  }
});

module.exports = makeSanitizer;
