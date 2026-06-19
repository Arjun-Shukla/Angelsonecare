/**
 * Payment routes — Razorpay.
 *
 *   POST /api/payments/order        -> create Razorpay order
 *   POST /api/payments/verify       -> verify signature server-side
 *   GET  /api/payments/:bookingId   -> payment record for a booking
 */

import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

router.post('/order', asyncHandler(paymentController.createOrder));
router.post('/verify', asyncHandler(paymentController.verifyPayment));
router.get('/:bookingId', asyncHandler(paymentController.getPayment));

export default router;
