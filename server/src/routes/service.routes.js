/**
 * Service routes — public reads, admin writes.
 *
 *   GET    /api/services       -> list active services (public)
 *   GET    /api/services/:id   -> single service (public)
 *   POST   /api/services       -> create (admin)
 *   PATCH  /api/services/:id   -> update (admin)
 *   DELETE /api/services/:id   -> delete (admin)
 */

import { Router } from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(serviceController.listServices));
router.get('/:id', asyncHandler(serviceController.getService));

router.post('/', protect, authorize(ROLES.ADMIN), asyncHandler(serviceController.createService));
router.patch('/:id', protect, authorize(ROLES.ADMIN), asyncHandler(serviceController.updateService));
router.delete('/:id', protect, authorize(ROLES.ADMIN), asyncHandler(serviceController.deleteService));

export default router;
