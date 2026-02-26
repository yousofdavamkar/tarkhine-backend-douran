const makeMenuController = ({ menuService }) => ({
  /**
   * Get all menus with pagination, filtering, and sorting
   */
  getAll: async (req, res, next) => {
    try {
      const result = await menuService.findAll(req.parsedQuery);

      res.success(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get menu by ID with all submenus
   */
  getById: async (req, res, next) => {
    try {
      const menu = await menuService.findById(req.params.id);

      res.success(menu);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Create new menu
   */
  create: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;

      const menu = await menuService.create(data);

      res.status(201).success(menu);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update menu
   */
  update: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;

      const menu = await menuService.update(req.params.id, data);

      res.success(menu);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Delete menu
   */
  delete: async (req, res, next) => {
    try {
      const result = await menuService.delete(req.params.id);

      res.success(result);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

});

module.exports = makeMenuController;
