const queryParser = (req, res, next) => {
  const {
    page = process.env.DEFAULT_PAGE || 1,
    limit = process.env.DEFAULT_LIMIT || 10,
    sort = 'id:asc',
    fields,
    ...filters
  } = req.query;

  // Parse and validate pagination
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(
    parseInt(limit) || parseInt(process.env.DEFAULT_LIMIT) || 10,
    parseInt(process.env.MAX_LIMIT) || 100
  );

  // Parse sort parameter
  const [sortField, sortOrder] = sort.split(':');
  const validSortOrder = ['asc', 'desc'].includes(sortOrder?.toLowerCase())
    ? sortOrder.toLowerCase()
    : 'asc';

  // Parse fields if provided
  let selectedFields = null;
  if (fields) {
    selectedFields = fields.split(',').map(f => f.trim());
  }

  // Build query object
  req.parsedQuery = {
    page: parsedPage,
    limit: parsedLimit,
    sort: {
      field: sortField || 'id',
      order: validSortOrder
    },
    fields: selectedFields,
    filters
  };

  next();
};

module.exports = queryParser;
