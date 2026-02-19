const express = require('express');
const healthRoutes = require('./health');
const authRoutes = require('./auth');
const exampleRoutes = require('./example');
const uploadRoutes = require('./upload');
const menuRoutes = require('./menu');
const adminRoutes = require('./admin');

const routes = (app) => {
  // Health check route (no /api prefix)
  app.use('/', healthRoutes);

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', exampleRoutes);
  app.use('/api', uploadRoutes);
  app.use('/api/menus', menuRoutes);
};

module.exports = routes;
