const jwt = require('jsonwebtoken');

/**
 * Generates a JWT access token
 * @param {Object} payload - Data to encode in token
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Generates a JWT refresh token
 * @param {Object} payload - Data to encode in token
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

/**
 * Verifies a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Decodes a JWT token without verification (for getting payload data)
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Extracts token from cookie
 * @param {Object} cookies - Request cookies object
 * @returns {String|null} Token or null
 */
const getTokenFromCookie = (cookies) => {
  const cookieName = process.env.COOKIE_NAME || 'token';
  return cookies[cookieName] || null;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  getTokenFromCookie
};
