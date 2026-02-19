const makeExampleController = ({ exampleService }) => ({
  /**
   * Get all resources with pagination, filtering, and sorting
   */
  getAll: async (req, res, next) => {
    try {
      const result = await exampleService.findAll(req.parsedQuery);

      res.success(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get resource by ID
   */
  getById: async (req, res, next) => {
    try {
      const resource = await exampleService.findById(req.params.id);

      res.success(resource);
    } catch (error) {
      if (error.message === 'Resource not found') {
        return res.error(
          'Resource not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Create new resource
   */
  create: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;
      const userId = req.user?.id;

      const resource = await exampleService.create(data, userId);

      res.status(201).success(resource);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update resource
   */
  update: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;

      const resource = await exampleService.update(req.params.id, data);

      res.success(resource);
    } catch (error) {
      if (error.message === 'Resource not found') {
        return res.error(
          'Resource not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Delete resource
   */
  delete: async (req, res, next) => {
    try {
      const result = await exampleService.delete(req.params.id);

      res.success(result);
    } catch (error) {
      if (error.message === 'Resource not found') {
        return res.error(
          'Resource not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  }
});

module.exports = makeExampleController;
