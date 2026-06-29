import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import * as ctrl from '../controllers/message.controller.js';

const router = Router();

// Public — anyone can send a contact message
router.post('/', asyncHandler(ctrl.createMessage));

// Protected — admin and leader only
router.get('/', protect, authorize(ROLES.ADMIN, ROLES.LEADER), asyncHandler(ctrl.listMessages));
router.patch('/:id/read', protect, authorize(ROLES.ADMIN, ROLES.LEADER), asyncHandler(ctrl.markRead));
router.delete('/:id',     protect, authorize(ROLES.ADMIN, ROLES.LEADER), asyncHandler(ctrl.deleteMessage));

export default router;
