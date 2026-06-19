/**
 * Analytics routes (admin-scoped).
 *
 *   GET /api/analytics/dashboard -> headline stats
 *   GET /api/analytics/bookings  -> booking trends
 *   GET /api/analytics/revenue   -> revenue aggregation
 */

import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', asyncHandler(analyticsController.getDashboard));
router.get('/bookings', asyncHandler(analyticsController.getBookings));
router.get('/revenue', asyncHandler(analyticsController.getRevenue));

export default router;
