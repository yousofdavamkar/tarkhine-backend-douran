const prisma = require('../config/database');
const { executePaginatedQuery } = require('../utils/prismaQuery');

const makeExampleService = () => ({
  /**
   * Find all resources with pagination, filtering, and sorting
   */
  findAll: async (parsedQuery) => {
    const searchableFields = {
      name: true,
      description: true
    };

    return await executePaginatedQuery(prisma, 'resource', parsedQuery, searchableFields);
  },

  /**
   * Find resource by ID
   */
  findById: async (id) => {
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) }
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    return resource;
  },

  /**
   * Create new resource
   */
  create: async (data, userId = null) => {
    return await prisma.resource.create({
      data: {
        ...data,
        userId: userId ? parseInt(userId) : null
      }
    });
  },

  /**
   * Update resource
   */
  update: async (id, data) => {
    // Check if resource exists
    const existing = await prisma.resource.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Resource not found');
    }

    return await prisma.resource.update({
      where: { id: parseInt(id) },
      data
    });
  },

  /**
   * Delete resource
   */
  delete: async (id) => {
    // Check if resource exists
    const existing = await prisma.resource.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Resource not found');
    }

    await prisma.resource.delete({
      where: { id: parseInt(id) }
    });

    return { message: 'Resource deleted successfully' };
  }
});

module.exports = makeExampleService;
