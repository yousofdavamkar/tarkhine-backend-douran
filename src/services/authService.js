const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const makeAuthService = () => ({
  /**
   * Register a new user (Signup)
   */
  signup: async (username, password) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      throw new Error('Username already taken');
    }

    // Check if this is the first user (make them admin)
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role
      },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return user;
  },

  /**
   * Login user (Signin)
   */
  signin: async (username, password) => {
    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    // Generate tokens with role
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt
      }
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      accessToken
    };
  },

  /**
   * Logout user (Signout) - removes all refresh tokens
   */
  signout: async (userId) => {
    // Delete all refresh tokens for user
    await prisma.refreshToken.deleteMany({
      where: { userId }
    });

    return { message: 'Successfully signed out' };
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
  }
});

module.exports = makeAuthService;
