const prisma = require('../config/database');

const makeAdminService = () => ({
  /**
   * Get all users with pagination
   */
  getAllUsers: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  /**
   * Update user role
   */
  updateUserRole: async (userId, newRole) => {
    // Validate role
    if (!['ADMIN', 'USER'].includes(newRole)) {
      throw new Error('Invalid role');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Prevent removing last admin
    if (user.role === 'ADMIN' && newRole === 'USER') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });

      if (adminCount <= 1) {
        throw new Error('Cannot remove the last admin');
      }
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    return updatedUser;
  },

  /**
   * Toggle user active status
   */
  toggleUserStatus: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Prevent deactivating last admin
    if (user.role === 'ADMIN' && user.isActive) {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN', isActive: true }
      });

      if (adminCount <= 1) {
        throw new Error('Cannot deactivate the last active admin');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true
      }
    });

    return updatedUser;
  },

  /**
   * Get system statistics
   */
  getSystemStats: async () => {
    const [totalUsers, adminCount, activeUsers, userCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'USER' } })
    ]);

    return {
      totalUsers,
      adminCount,
      userCount,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers
    };
  }
});

module.exports = makeAdminService;
