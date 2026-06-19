/**
 * User routes (admin-scoped) — manage clients & leaders.
 *
 *   GET    /api/users          -> list/filter users
 *   GET    /api/users/:id      -> single user
 *   POST   /api/users/leaders  -> create a leader
 *   PATCH  /api/users/:id      -> update user
 *   DELETE /api/users/:id      -> delete user
 */

import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/', asyncHandler(userController.listUsers));
router.get('/:id', asyncHandler(userController.getUser));
router.post('/leaders', asyncHandler(userController.createLeader));
router.patch('/:id', asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));

export default router;
