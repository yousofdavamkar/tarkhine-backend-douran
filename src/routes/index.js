const express = require('express');
const healthRoutes = require('./health');
const exampleRoutes = require('./example');
const uploadRoutes = require('./upload');
const menuRoutes = require('./menu');
const userRoutes = require('./user');
const logoRoutes = require('./logo');

const routes = (app) => {
  // Health check route (no /api prefix)
  app.use('/', healthRoutes);

  // API routes
  app.use('/api/users', userRoutes);
  app.use('/api/logo', logoRoutes);
  app.use('/api', exampleRoutes);
  app.use('/api', uploadRoutes);
  app.use('/api/menus', menuRoutes);
};

module.exports = routes;
