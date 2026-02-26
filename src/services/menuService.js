const prisma = require('../config/database');
const { executePaginatedQuery } = require('../utils/prismaQuery');
const fs = require('fs');
const path = require('path');

const makeMenuService = () => ({
  /**
   * Find all menus with pagination, filtering, and sorting
   */
  findAll: async (parsedQuery) => {
    const searchableFields = {
      name: true
    };

    return await executePaginatedQuery(prisma, 'menu', parsedQuery, searchableFields);
  },

  /**
   * Find menu by ID with all submenus
   */
  findById: async (id) => {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
      include: {
        submenus: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    return menu;
  },

  /**
   * Create new menu with optional submenus
   */
  create: async (data) => {
    const { submenus, ...menuData } = data;

    const createPayload = {
      ...menuData
    };

    if (submenus && submenus.length > 0) {
      createPayload.submenus = {
        create: submenus.map(sub => {
          const { id, ...subData } = sub; // Discard client IDs for create
          return subData;
        })
      };
    }

    return await prisma.menu.create({
      data: createPayload,
      include: {
        submenus: true
      }
    });
  },

  /**
   * Update menu (fully replaces submenus)
   */
  update: async (id, data) => {
    const existing = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Menu not found');
    }

    const { submenus, ...menuData } = data;

    const updatePayload = {
      ...menuData
    };

    if (submenus) {
      updatePayload.submenus = {
        deleteMany: {},
        create: submenus.map(sub => {
          const { id, ...subData } = sub; // Discard IDs to create new rows
          return subData;
        })
      };
    }

    return await prisma.menu.update({
      where: { id: parseInt(id) },
      data: updatePayload,
      include: {
        submenus: true
      }
    });
  },

  /**
   * Delete menu (cascade deletes all nested items via Prisma schema)
   */
  delete: async (id) => {
    const existing = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Menu not found');
    }

    await prisma.menu.delete({
      where: { id: parseInt(id) }
    });

    return { message: 'Menu deleted successfully' };
  }
});

module.exports = makeMenuService;
