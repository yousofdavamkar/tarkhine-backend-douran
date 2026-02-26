const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { executePaginatedQuery } = require('../utils/prismaQuery');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const makeUserService = () => ({
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
     * Get all users with pagination, filtering, and sorting
     */
    findAll: async (parsedQuery) => {
        const searchableFields = {
            username: true
        };

        // We override select mapping locally if fields parameter isn't providing its own mapping,
        // to prevent password hash leakage.
        if (!parsedQuery.fields) {
            // By mutating the query object before executePaginatedQuery builds it we ensure safety.
            // But the handler Factory and utilities handle fields correctly. We can enforce it here
            // by setting default fields.
            parsedQuery.fields = ['id', 'username', 'role', 'isActive', 'createdAt'];
        }

        return await executePaginatedQuery(prisma, 'user', parsedQuery, searchableFields);
    },

    /**
     * Get user by ID
     */
    findById: async (userId, parsedQuery = {}) => {
        const query = {
            where: { id: parseInt(userId) },
        };

        if (parsedQuery.fields && parsedQuery.fields.length > 0) {
            query.select = {};
            parsedQuery.fields.forEach(field => {
                query.select[field] = true;
            });
            query.select.id = true;
        } else {
            query.select = {
                id: true,
                username: true,
                role: true,
                isActive: true,
                createdAt: true
            };
        }

        const user = await prisma.user.findUnique(query);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    },

    /**
     * Update user role
     */
    updateRole: async (userId, newRole) => {
        // Validate role
        if (!['ADMIN', 'USER'].includes(newRole)) {
            throw new Error('Invalid role');
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Prevent removing last admin
        if (user.role === 'ADMIN' && newRole === 'USER') {
            const adminCount = await prisma.user.count({
                where: { role: 'ADMIN' }
            });

            if (adminCount <= 1) {
                throw new Error('Cannot remove the last admin');
            }
        }

        // Update role
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { role: newRole },
            select: {
                id: true,
                username: true,
                role: true,
                isActive: true,
                updatedAt: true
            }
        });

        return updatedUser;
    },

    /**
     * Toggle user active status
     */
    toggleStatus: async (userId) => {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Prevent deactivating last admin
        if (user.role === 'ADMIN' && user.isActive) {
            const adminCount = await prisma.user.count({
                where: { role: 'ADMIN', isActive: true }
            });

            if (adminCount <= 1) {
                throw new Error('Cannot deactivate the last active admin');
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                username: true,
                role: true,
                isActive: true
            }
        });

        return updatedUser;
    },

    /**
     * Get system statistics
     */
    getStats: async () => {
        const [totalUsers, adminCount, activeUsers, userCount] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.user.count({ where: { isActive: true } }),
            prisma.user.count({ where: { role: 'USER' } })
        ]);

        return {
            totalUsers,
            adminCount,
            userCount,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers
        };
    }
});

module.exports = makeUserService;
