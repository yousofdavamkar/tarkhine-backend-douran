const makeAdminController = ({ adminService }) => ({
  /**
   * Get all users
   * GET /api/admin/users
   */
  getAllUsers: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await adminService.getAllUsers(page, limit);

      res.status(200).success(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user by ID
   * GET /api/admin/users/:id
   */
  getUserById: async (req, res, next) => {
    try {
      const user = await adminService.getUserById(parseInt(req.params.id));

      res.status(200).success({ user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).error(
          'User not found',
          'USER_NOT_FOUND',
          404
        );
      }
      next(error);
    }
  },

  /**
   * Update user role
   * PUT /api/admin/users/:id/role
   */
  updateUserRole: async (req, res, next) => {
    try {
      const { role } = req.validatedData || req.body;

      const user = await adminService.updateUserRole(
        parseInt(req.params.id),
        role
      );

      res.status(200).success({
        user,
        message: 'User role updated successfully'
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).error(
          'User not found',
          'USER_NOT_FOUND',
          404
        );
      }
      if (error.message === 'Invalid role') {
        return res.status(400).error(
          'Invalid role specified',
          'INVALID_ROLE',
          400
        );
      }
      if (error.message === 'Cannot remove the last admin') {
        return res.status(400).error(
          'Cannot remove the last admin user',
          'LAST_ADMIN',
          400
        );
      }
      next(error);
    }
  },

  /**
   * Toggle user active status
   * PUT /api/admin/users/:id/status
   */
  updateUserStatus: async (req, res, next) => {
    try {
      const user = await adminService.toggleUserStatus(parseInt(req.params.id));

      res.status(200).success({
        user,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).error(
          'User not found',
          'USER_NOT_FOUND',
          404
        );
      }
      if (error.message === 'Cannot deactivate the last active admin') {
        return res.status(400).error(
          'Cannot deactivate the last active admin',
          'LAST_ADMIN',
          400
        );
      }
      next(error);
    }
  },

  /**
   * Get system statistics
   * GET /api/admin/stats
   */
  getSystemStats: async (req, res, next) => {
    try {
      const stats = await adminService.getSystemStats();

      res.status(200).success({ stats });
    } catch (error) {
      next(error);
    }
  }
});

module.exports = makeAdminController;
