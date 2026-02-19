/**
 * Calculates pagination metadata
 * @param {Number} total - Total number of items
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    totalItems: total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

/**
 * Calculates skip value for Prisma queries
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Number} Skip value
 */
const getSkipValue = (page, limit) => {
  return (page - 1) * limit;
};

/**
 * Validates and sanitizes pagination parameters
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @param {Number} maxLimit - Maximum allowed limit
 * @returns {Object} Validated page and limit
 */
const validatePagination = (page, limit, maxLimit = 100) => {
  const validatedPage = Math.max(1, parseInt(page) || 1);
  const validatedLimit = Math.min(
    Math.max(1, parseInt(limit) || 10),
    maxLimit
  );

  return {
    page: validatedPage,
    limit: validatedLimit
  };
};

module.exports = {
  getPaginationMeta,
  getSkipValue,
  validatePagination
};
