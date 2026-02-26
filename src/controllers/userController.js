const factory = require('./handlerFactory');

const makeUserController = ({ userService }) => ({
    /**
     * Get all users
     * GET /api/users
     */
    getAllUsers: factory.getAll(userService),

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    getUserById: factory.getOne(userService),

    /**
     * Signup - Create new user account
     * POST /api/users/signup
     */
    signup: async (req, res, next) => {
        try {
            const { username, password } = req.validatedData || req.body;

            const user = await userService.signup(username, password);

            res.status(201).success({
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                message: 'Account created successfully'
            });
        } catch (error) {
            if (error.message === 'Username already taken') {
                return res.status(409).error(
                    'This username is already taken. Please choose another.',
                    'USERNAME_TAKEN',
                    409
                );
            }
            next(error);
        }
    },

    /**
     * Signin - Login user
     * POST /api/users/signin
     */
    signin: async (req, res, next) => {
        try {
            const { username, password } = req.validatedData || req.body;

            const result = await userService.signin(username, password);

            // Set access token in cookie accessible to frontend JS
            res.cookie(
                process.env.COOKIE_NAME || 'token',
                result.accessToken,
                {
                    httpOnly: false, // Made accessible to frontend JS as requested
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-port dev
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                }
            );

            res.status(200).success({
                user: result.user,
                token: result.accessToken, // Explicitly providing token in JSON as well
                message: 'Signed in successfully'
            });
        } catch (error) {
            if (error.message === 'Invalid username or password') {
                return res.status(401).error(
                    'Invalid username or password',
                    'INVALID_CREDENTIALS',
                    401
                );
            }
            if (error.message === 'Account is disabled') {
                return res.status(403).error(
                    'Your account has been disabled',
                    'ACCOUNT_DISABLED',
                    403
                );
            }
            next(error);
        }
    },

    /**
     * Signout - Logout user and delete cookie
     * POST /api/users/signout
     */
    signout: async (req, res, next) => {
        try {
            // Remove all refresh tokens for user
            if (req.user) {
                await userService.signout(req.user.id);
            }

            // Clear the authentication cookie
            res.clearCookie(process.env.COOKIE_NAME || 'token', {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            });

            res.status(200).success({
                message: 'Signed out successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get current authenticated user
     * GET /api/users/me
     */
    me: async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).error(
                    'Not authenticated',
                    'NOT_AUTHENTICATED',
                    401
                );
            }

            res.status(200).success({
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    role: req.user.role
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update user role
     * PUT /api/users/:id/role
     */
    updateUserRole: async (req, res, next) => {
        try {
            const { role } = req.validatedData || req.body;

            const user = await userService.updateRole(req.params.id, role);

            res.status(200).success({
                user,
                message: 'User role updated successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).error(
                    'User not found',
                    'USER_NOT_FOUND',
                    404
                );
            }
            if (error.message === 'Invalid role') {
                return res.status(400).error(
                    'Invalid role specified',
                    'INVALID_ROLE',
                    400
                );
            }
            if (error.message === 'Cannot remove the last admin') {
                return res.status(400).error(
                    'Cannot remove the last admin user',
                    'LAST_ADMIN',
                    400
                );
            }
            next(error);
        }
    },

    /**
     * Toggle user active status
     * PUT /api/users/:id/status
     */
    updateUserStatus: async (req, res, next) => {
        try {
            const user = await userService.toggleStatus(req.params.id);

            res.status(200).success({
                user,
                message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).error(
                    'User not found',
                    'USER_NOT_FOUND',
                    404
                );
            }
            if (error.message === 'Cannot deactivate the last active admin') {
                return res.status(400).error(
                    'Cannot deactivate the last active admin',
                    'LAST_ADMIN',
                    400
                );
            }
            next(error);
        }
    },

    /**
     * Get system statistics
     * GET /api/users/stats
     */
    getSystemStats: async (req, res, next) => {
        try {
            const stats = await userService.getStats();

            res.status(200).success({ stats });
        } catch (error) {
            next(error);
        }
    }
});

module.exports = makeUserController;
