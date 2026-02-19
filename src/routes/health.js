const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.success({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
