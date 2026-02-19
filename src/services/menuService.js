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
   * Find menu by ID with all items and subitems
   */
  findById: async (id) => {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          orderBy: { position: 'asc' },
          include: {
            subitems: {
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    return menu;
  },

  /**
   * Create new menu
   */
  create: async (data) => {
    return await prisma.menu.create({
      data
    });
  },

  /**
   * Update menu
   */
  update: async (id, data) => {
    const existing = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Menu not found');
    }

    return await prisma.menu.update({
      where: { id: parseInt(id) },
      data
    });
  },

  /**
   * Update menu logo
   */
  updateLogo: async (id, logoPath) => {
    const existing = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Menu not found');
    }

    // Delete old logo if exists
    if (existing.logo) {
      const oldLogoPath = path.join(process.cwd(), 'public', existing.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    return await prisma.menu.update({
      where: { id: parseInt(id) },
      data: { logo: logoPath }
    });
  },

  /**
   * Delete menu
   */
  delete: async (id) => {
    const existing = await prisma.menu.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existing) {
      throw new Error('Menu not found');
    }

    // Delete logo file if exists
    if (existing.logo) {
      const logoPath = path.join(process.cwd(), 'public', existing.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    await prisma.menu.delete({
      where: { id: parseInt(id) }
    });

    return { message: 'Menu deleted successfully' };
  },

  /**
   * Add menu item to a menu
   */
  addMenuItem: async (menuId, data) => {
    // Check if menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(menuId) }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    return await prisma.menuItem.create({
      data: {
        ...data,
        menuId: parseInt(menuId)
      }
    });
  },

  /**
   * Update menu item
   */
  updateMenuItem: async (menuId, itemId, data) => {
    // Check if menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(menuId) }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    // Check if item exists and belongs to menu
    const existing = await prisma.menuItem.findFirst({
      where: {
        id: parseInt(itemId),
        menuId: parseInt(menuId)
      }
    });

    if (!existing) {
      throw new Error('Menu item not found');
    }

    return await prisma.menuItem.update({
      where: { id: parseInt(itemId) },
      data
    });
  },

  /**
   * Delete menu item
   */
  deleteMenuItem: async (menuId, itemId) => {
    // Check if menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(menuId) }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    // Check if item exists and belongs to menu
    const existing = await prisma.menuItem.findFirst({
      where: {
        id: parseInt(itemId),
        menuId: parseInt(menuId)
      }
    });

    if (!existing) {
      throw new Error('Menu item not found');
    }

    await prisma.menuItem.delete({
      where: { id: parseInt(itemId) }
    });

    return { message: 'Menu item deleted successfully' };
  },

  /**
   * Add submenu item to a menu item
   */
  addSubMenuItem: async (menuId, itemId, data) => {
    // Check if menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(menuId) }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    // Check if menu item exists and belongs to menu
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: parseInt(itemId),
        menuId: parseInt(menuId)
      }
    });

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    return await prisma.subMenuItem.create({
      data: {
        ...data,
        menuItemId: parseInt(itemId)
      }
    });
  },

  /**
   * Update submenu item
   */
  updateSubMenuItem: async (menuId, itemId, subitemId, data) => {
    // Check if menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(menuId) }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    // Check if menu item exists and belongs to menu
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: parseInt(itemId),
        menuId: parseInt(menuId)
      }
    });

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    // Check if submenu item exists and belongs to menu item
    const existing = await prisma.subMenuItem.findFirst({
      where: {
        id: parseInt(subitemId),
        menuItemId: parseInt(itemId)
      }
    });

    if (!existing) {
      throw new Error('Submenu item not found');
    }

    return await prisma.subMenuItem.update({
      where: { id: parseInt(subitemId) },
      data
    });
  },

  /**
   * Delete submenu item
   */
  deleteSubMenuItem: async (menuId, itemId, subitemId) => {
    // Check if menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(menuId) }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    // Check if menu item exists and belongs to menu
    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: parseInt(itemId),
        menuId: parseInt(menuId)
      }
    });

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    // Check if submenu item exists and belongs to menu item
    const existing = await prisma.subMenuItem.findFirst({
      where: {
        id: parseInt(subitemId),
        menuItemId: parseInt(itemId)
      }
    });

    if (!existing) {
      throw new Error('Submenu item not found');
    }

    await prisma.subMenuItem.delete({
      where: { id: parseInt(subitemId) }
    });

    return { message: 'Submenu item deleted successfully' };
  }
});

module.exports = makeMenuService;
