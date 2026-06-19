/**
 * Ticket routes — support system.
 *
 *   POST  /api/tickets             -> raise ticket
 *   GET   /api/tickets             -> role-scoped list
 *   GET   /api/tickets/:id         -> single ticket + thread
 *   POST  /api/tickets/:id/messages-> add reply
 *   PATCH /api/tickets/:id/status  -> update status (leader/admin)
 */

import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

router.post('/', asyncHandler(ticketController.createTicket));
router.get('/', asyncHandler(ticketController.listTickets));
router.get('/:id', asyncHandler(ticketController.getTicket));
router.post('/:id/messages', asyncHandler(ticketController.addMessage));
router.patch('/:id/status', authorize(ROLES.LEADER, ROLES.ADMIN), asyncHandler(ticketController.updateStatus));

export default router;
