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
   * Get menu by ID with all items and subitems
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
   * Update menu logo
   */
  uploadLogo: async (req, res, next) => {
    try {
      if (!req.file && !req.logoPath) {
        return res.error(
          'No logo file provided',
          'NO_FILE',
          400
        );
      }

      const menu = await menuService.updateLogo(req.params.id, req.logoPath);

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

  /**
   * Add menu item to a menu
   */
  addMenuItem: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;

      const menuItem = await menuService.addMenuItem(req.params.menuId, data);

      res.status(201).success(menuItem);
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
   * Update menu item
   */
  updateMenuItem: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;

      const menuItem = await menuService.updateMenuItem(
        req.params.menuId,
        req.params.itemId,
        data
      );

      res.success(menuItem);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      if (error.message === 'Menu item not found') {
        return res.error(
          'Menu item not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Delete menu item
   */
  deleteMenuItem: async (req, res, next) => {
    try {
      const result = await menuService.deleteMenuItem(
        req.params.menuId,
        req.params.itemId
      );

      res.success(result);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      if (error.message === 'Menu item not found') {
        return res.error(
          'Menu item not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Add submenu item to a menu item
   */
  addSubMenuItem: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;

      const subMenuItem = await menuService.addSubMenuItem(
        req.params.menuId,
        req.params.itemId,
        data
      );

      res.status(201).success(subMenuItem);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      if (error.message === 'Menu item not found') {
        return res.error(
          'Menu item not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Update submenu item
   */
  updateSubMenuItem: async (req, res, next) => {
    try {
      const data = req.validatedData || req.body;

      const subMenuItem = await menuService.updateSubMenuItem(
        req.params.menuId,
        req.params.itemId,
        req.params.subitemId,
        data
      );

      res.success(subMenuItem);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      if (error.message === 'Menu item not found') {
        return res.error(
          'Menu item not found',
          'NOT_FOUND',
          404
        );
      }
      if (error.message === 'Submenu item not found') {
        return res.error(
          'Submenu item not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Delete submenu item
   */
  deleteSubMenuItem: async (req, res, next) => {
    try {
      const result = await menuService.deleteSubMenuItem(
        req.params.menuId,
        req.params.itemId,
        req.params.subitemId
      );

      res.success(result);
    } catch (error) {
      if (error.message === 'Menu not found') {
        return res.error(
          'Menu not found',
          'NOT_FOUND',
          404
        );
      }
      if (error.message === 'Menu item not found') {
        return res.error(
          'Menu item not found',
          'NOT_FOUND',
          404
        );
      }
      if (error.message === 'Submenu item not found') {
        return res.error(
          'Submenu item not found',
          'NOT_FOUND',
          404
        );
      }
      next(error);
    }
  }
});

module.exports = makeMenuController;
