/**
 * Auth routes — Google OAuth + session/token management.
 *
 *   GET  /api/auth/google           -> start Google OAuth
 *   GET  /api/auth/google/callback  -> OAuth callback, issue JWTs
 *   GET  /api/auth/me               -> current user (protected)
 *   POST /api/auth/refresh          -> rotate access token
 *   POST /api/auth/logout           -> clear refresh cookie
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
// router.get('/google/callback', passport.authenticate('google', { session: false }), asyncHandler(authController.googleCallback));
router.get('/me', protect, asyncHandler(authController.getMe));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));

export default router;
