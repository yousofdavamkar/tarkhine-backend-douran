/**
 * Builds a Prisma query object from parsed query parameters
 * @param {Object} parsedQuery - The parsed query from queryParser middleware
 * @param {Object} searchableFields - Map of field names to Prisma search configurations
 * @returns {Object} Prisma query object with where, orderBy, skip, take, and select
 */
const buildPrismaQuery = (parsedQuery, searchableFields = {}) => {
  const { page, limit, sort, fields, filters } = parsedQuery;

  const query = {
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort.field]: sort.order
    }
  };

  // Build where clause from filters
  if (filters && Object.keys(filters).length > 0) {
    query.where = buildWhereClause(filters, searchableFields);
  }

  // Build select from fields
  if (fields) {
    query.select = {};
    fields.forEach(field => {
      query.select[field] = true;
    });
    // Always include id
    query.select.id = true;
  }

  return query;
};

/**
 * Builds a Prisma where clause from filter object
 * @param {Object} filters - Filter key-value pairs
 * @param {Object} searchableFields - Map of searchable fields
 * @returns {Object} Prisma where clause
 */
const buildWhereClause = (filters, searchableFields = {}) => {
  const where = {};

  for (const [key, value] of Object.entries(filters)) {
    if (!value || value === '') continue;

    // Handle full-text search
    if (key === 'search' && searchableFields) {
      const searchFields = Object.keys(searchableFields);
      if (searchFields.length > 0) {
        where.OR = searchFields.map(field => ({
          [field]: { contains: value, mode: 'insensitive' }
        }));
      }
      continue;
    }

    // Handle exact match filters
    where[key] = value;
  }

  return where;
};

/**
 * Executes a paginated Prisma query with metadata
 * @param {Object} prisma - Prisma client instance
 * @param {String} model - Prisma model name (e.g., 'user', 'resource')
 * @param {Object} parsedQuery - Parsed query from queryParser middleware
 * @param {Object} searchableFields - Map of searchable fields
 * @returns {Object} Result with items and pagination metadata
 */
const executePaginatedQuery = async (prisma, model, parsedQuery, searchableFields = {}) => {
  const query = buildPrismaQuery(parsedQuery, searchableFields);

  // Get total count and data in parallel
  const [total, items] = await Promise.all([
    prisma[model].count({ where: query.where }),
    prisma[model].findMany(query)
  ]);

  return {
    items,
    pagination: {
      page: parsedQuery.page,
      limit: parsedQuery.limit,
      totalItems: total,
      totalPages: Math.ceil(total / parsedQuery.limit),
      hasNext: parsedQuery.page < Math.ceil(total / parsedQuery.limit),
      hasPrev: parsedQuery.page > 1
    }
  };
};

module.exports = {
  buildPrismaQuery,
  buildWhereClause,
  executePaginatedQuery
};
