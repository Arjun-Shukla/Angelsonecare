import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const router = Router();

// Step 1: Redirect user to Google consent screen
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google redirects here with ?code=... — Passport verifies it,
// calls findOrCreateGoogleUser, then passes the user to googleCallback.
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.clientUrl}/login?error=auth_failed`,
  }),
  asyncHandler(authController.googleCallback)
);

router.post('/register',         asyncHandler(authController.register));
router.get('/me',      protect,  asyncHandler(authController.getMe));
router.post('/refresh',          asyncHandler(authController.refresh));
router.post('/logout',           asyncHandler(authController.logout));

export default router;
