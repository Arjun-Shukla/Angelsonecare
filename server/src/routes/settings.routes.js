import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/',  asyncHandler(settingsController.getSettings));
router.patch('/', asyncHandler(settingsController.updateSettings));

export default router;
