const makeAuthController = ({ authService }) => ({
  /**
   * Signup - Create new user account
   * POST /api/auth/signup
   */
  signup: async (req, res, next) => {
    try {
      const { username, password } = req.validatedData || req.body;

      const user = await authService.signup(username, password);

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
   * POST /api/auth/signin
   */
  signin: async (req, res, next) => {
    try {
      const { username, password } = req.validatedData || req.body;

      const result = await authService.signin(username, password);

      // Set access token in httpOnly cookie
      res.cookie(
        process.env.COOKIE_NAME || 'token',
        result.accessToken,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
      );

      res.status(200).success({
        user: result.user,
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
   * POST /api/auth/signout
   */
  signout: async (req, res, next) => {
    try {
      // Remove all refresh tokens for user
      if (req.user) {
        await authService.signout(req.user.id);
      }

      // Clear the authentication cookie
      res.clearCookie(process.env.COOKIE_NAME || 'token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
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
   * GET /api/auth/me
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
  }
});

module.exports = makeAuthController;
