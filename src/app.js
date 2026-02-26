require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const JSend = require('jsend');

const logger = require('./config/logger');
const swaggerConfig = require('./config/swagger');
const routes = require('./routes');
const jsendMiddleware = require('./middleware/jsend');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const makeSanitizer = require('./utils/sanitizer');
const makeSanitizeMiddleware = require('./middleware/sanitize');

const app = express();

// Initialize sanitizer
const sanitizer = makeSanitizer();
const { sanitizeQuery, sanitizeParams } = makeSanitizeMiddleware({ sanitizer });

// ===============================
// Security Middleware
// ===============================

// 1. Security headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  hsts: process.env.NODE_ENV === 'production',
  noSniff: true,
  xssFilter: true,
}));

// 2. CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
  credentials: true,
}));

// 3. Global rate limiting (prevents DoS)
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
  message: 'Too many requests from this IP'
});

if (process.env.NODE_ENV !== 'development') {
  app.use('/api', globalLimiter);
}

// ===============================
// JSend Middleware
// ===============================
app.use(JSend.middleware);
app.use(jsendMiddleware);

// 4. Body parsing limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static file serving for uploads/logos
const path = require('path');
app.use(express.static(path.join(process.cwd(), 'public')));

// 5. Parameter pollution protection
app.use(hpp());

// 6. Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// ===============================
// Logging
// ===============================
app.use(logger());

// ===============================
// Input Sanitization
// ===============================
app.use(sanitizeQuery);
app.use(sanitizeParams);

// ===============================
// API Documentation (Scalar)
// ===============================
app.get('/docs', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Documentation</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <script id="api-reference" data-url="/docs/swagger.json"></script>
        <script>
          var Scalar = window.Scalar || {};
          Scalar.ApiReference = {
            spec: ${JSON.stringify(swaggerConfig)}
          };
        </script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `);
});

app.get('/docs/swagger.json', (req, res) => {
  res.json(swaggerConfig);
});

// ===============================
// Routes
// ===============================
routes(app);

// ===============================
// Error Handling
// ===============================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
