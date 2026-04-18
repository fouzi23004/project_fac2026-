const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  validateAcademicEmail,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { generateToken, setTokenCookie } = require('../utils/jwt');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/validate-email', validateAcademicEmail);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user.id);

      // Set token in HTTP-only cookie
      setTokenCookie(res, token);

      // Prepare user data
      const userData = {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: req.user.role,
        isVerified: req.user.is_verified,
      };

      // Redirect to frontend with token in query (will be removed and stored in localStorage)
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_callback_failed`);
    }
  }
);

module.exports = router;
