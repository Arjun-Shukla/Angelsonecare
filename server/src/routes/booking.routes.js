/**
 * Booking routes — core service workflow.
 *
 *   POST  /api/bookings                 -> client creates booking
 *   GET   /api/bookings                 -> role-scoped list
 *   GET   /api/bookings/:id             -> single booking
 *   PATCH /api/bookings/:id/accept      -> admin accept
 *   PATCH /api/bookings/:id/reject      -> admin reject
 *   PATCH /api/bookings/:id/assign      -> admin assign leader
 *   PATCH /api/bookings/:id/progress    -> leader update progress
 *   POST  /api/bookings/:id/otp/generate-> request completion OTP
 *   POST  /api/bookings/:id/otp/verify  -> leader verify OTP -> COMPLETED
 */

import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

router.post('/', authorize(ROLES.CLIENT), asyncHandler(bookingController.createBooking));
router.get('/', asyncHandler(bookingController.listBookings));
router.get('/:id', asyncHandler(bookingController.getBooking));

router.patch('/:id/accept', authorize(ROLES.ADMIN), asyncHandler(bookingController.acceptBooking));
router.patch('/:id/reject', authorize(ROLES.ADMIN), asyncHandler(bookingController.rejectBooking));
router.patch('/:id/assign', authorize(ROLES.ADMIN), asyncHandler(bookingController.assignLeader));

router.patch('/:id/progress', authorize(ROLES.LEADER, ROLES.ADMIN), asyncHandler(bookingController.updateProgress));

router.post('/:id/otp/generate', authorize(ROLES.LEADER, ROLES.ADMIN), asyncHandler(bookingController.generateOtp));
router.post('/:id/otp/verify', authorize(ROLES.LEADER, ROLES.ADMIN), asyncHandler(bookingController.verifyOtp));

export default router;
