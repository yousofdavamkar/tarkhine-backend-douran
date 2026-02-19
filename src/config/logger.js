const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const logFormat = process.env.LOG_FORMAT || 'dev';

// Create a write stream for access logs (in production)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../../logs/access.log'),
  { flags: 'a' }
);

const logger = () => {
  if (process.env.NODE_ENV === 'production') {
    return morgan('combined', { stream: accessLogStream });
  }
  return morgan(logFormat);
};

module.exports = logger;
