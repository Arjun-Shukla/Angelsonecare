/**
 * Review routes.
 *
 *   GET    /api/reviews           -> public approved reviews (website)
 *   POST   /api/reviews           -> client submits review
 *   GET    /api/reviews/me        -> client's own reviews
 *   PATCH  /api/reviews/:id/approve -> admin approve
 *   DELETE /api/reviews/:id       -> admin delete
 */

import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(reviewController.listReviews));

router.post('/', protect, authorize(ROLES.CLIENT), asyncHandler(reviewController.createReview));
router.get('/me', protect, authorize(ROLES.CLIENT), asyncHandler(reviewController.listMyReviews));

router.get('/admin/all', protect, authorize(ROLES.ADMIN), asyncHandler(reviewController.listAllReviews));
router.patch('/:id/approve',  protect, authorize(ROLES.ADMIN), asyncHandler(reviewController.approveReview));
router.patch('/:id/featured', protect, authorize(ROLES.ADMIN), asyncHandler(reviewController.toggleFeatured));
router.delete('/:id',         protect, authorize(ROLES.ADMIN), asyncHandler(reviewController.deleteReview));

export default router;
