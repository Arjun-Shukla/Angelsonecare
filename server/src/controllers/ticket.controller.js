import Ticket from '../models/Ticket.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import { ROLES } from '../constants/roles.js';
import { getIo } from '../sockets/index.js';
import { SOCKET_EVENTS, ROOMS } from '../constants/events.js';

const POPULATE_SENDER      = { path: 'messages.sender', select: 'name role' };
const POPULATE_USER        = { path: 'user', select: 'name email' };
const POPULATE_BOOKING     = { path: 'booking', select: 'service status' };
const POPULATE_RESOLVED_BY = { path: 'resolvedBy', select: 'name role' };

const populateFull = (query) =>
  query
    .populate(POPULATE_SENDER)
    .populate(POPULATE_USER)
    .populate(POPULATE_BOOKING)
    .populate(POPULATE_RESOLVED_BY);

// ── CREATE ─────────────────────────────────────────────────────────────────
export const createTicket = async (req, res) => {
  const { bookingId, category, subject, description } = req.body;
  if (!subject?.trim()) throw new ApiError(400, 'Subject is required');
  if (!description?.trim() || description.trim().length < 20) {
    throw new ApiError(400, 'Description must be at least 20 characters');
  }

  const ticket = await Ticket.create({
    user:        req.user._id,
    booking:     bookingId || null,
    category:    category || 'General Inquiry',
    subject:     subject.trim(),
    description: description.trim(),
    messages:    [{ sender: req.user._id, text: description.trim() }],
  });

  const populated = await populateFull(Ticket.findById(ticket._id));

  // Real-time: push new ticket to all leaders and admins immediately
  const io = getIo();
  if (io) {
    io.to(ROOMS.roleAdmin).to(ROOMS.roleLeader).emit(SOCKET_EVENTS.TICKET_CREATED, populated);
  }

  sendSuccess(res, { status: 201, data: { ticket: populated }, message: 'Ticket raised successfully' });
};

// ── LIST ───────────────────────────────────────────────────────────────────
export const listTickets = async (req, res) => {
  const filter = {};
  if (req.user.role === ROLES.CLIENT) filter.user = req.user._id;

  const tickets = await populateFull(
    Ticket.find(filter).sort({ createdAt: -1 })
  );
  sendSuccess(res, { data: { tickets }, message: 'Tickets fetched' });
};

// ── GET ONE ────────────────────────────────────────────────────────────────
export const getTicket = async (req, res) => {
  const ticket = await populateFull(Ticket.findById(req.params.id));
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  const isOwner = ticket.user._id.toString() === req.user._id.toString();
  const isStaff = [ROLES.LEADER, ROLES.ADMIN].includes(req.user.role);
  if (!isOwner && !isStaff) throw new ApiError(403, 'Access denied');

  sendSuccess(res, { data: { ticket } });
};

// ── ADD MESSAGE ────────────────────────────────────────────────────────────
export const addMessage = async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) throw new ApiError(400, 'Message text is required');

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, 'Ticket not found');
  if (['RESOLVED', 'CLOSED', 'SOLVED', 'UNSOLVED'].includes(ticket.status)) {
    throw new ApiError(400, 'Cannot reply to a closed ticket');
  }

  const isOwner = ticket.user.toString() === req.user._id.toString();
  const isStaff = [ROLES.LEADER, ROLES.ADMIN].includes(req.user.role);
  if (!isOwner && !isStaff) throw new ApiError(403, 'Access denied');

  ticket.messages.push({ sender: req.user._id, text: text.trim() });
  await ticket.save();

  const populated = await populateFull(Ticket.findById(ticket._id));

  // Real-time: deliver the new message to the client and all staff
  const io = getIo();
  if (io) {
    io.to(ROOMS.user(ticket.user.toString()))
      .to(ROOMS.roleAdmin)
      .to(ROOMS.roleLeader)
      .emit(SOCKET_EVENTS.TICKET_MESSAGE, {
        ticketId: ticket._id.toString(),
        message:  ticket.messages[ticket.messages.length - 1],
      });
  }

  sendSuccess(res, { data: { ticket: populated }, message: 'Reply sent' });
};

// ── UPDATE STATUS ──────────────────────────────────────────────────────────
export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const VALID = ['OPEN', 'IN_PROGRESS', 'SOLVED', 'UNSOLVED', 'RESOLVED', 'CLOSED'];
  if (!VALID.includes(status)) throw new ApiError(400, `Status must be one of: ${VALID.join(', ')}`);

  const ticket = await populateFull(
    Ticket.findByIdAndUpdate(
      req.params.id,
      { status, resolvedBy: req.user._id, statusUpdatedAt: new Date() },
      { new: true }
    )
  );
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  // Real-time: push status update to the client and all staff
  const io = getIo();
  if (io) {
    const payload = {
      ticketId:        ticket._id.toString(),
      status:          ticket.status,
      resolvedBy:      ticket.resolvedBy,
      statusUpdatedAt: ticket.statusUpdatedAt,
    };

    // Deliver to the ticket owner's personal room
    io.to(ROOMS.user(ticket.user._id.toString()))
      .to(ROOMS.roleAdmin)
      .to(ROOMS.roleLeader)
      .emit(SOCKET_EVENTS.TICKET_STATUS_UPDATED, payload);

    // Also fire the specific solved/unsolved event for fine-grained listeners
    if (status === 'SOLVED')   io.to(ROOMS.user(ticket.user._id.toString())).emit(SOCKET_EVENTS.TICKET_SOLVED,   payload);
    if (status === 'UNSOLVED') io.to(ROOMS.user(ticket.user._id.toString())).emit(SOCKET_EVENTS.TICKET_UNSOLVED, payload);
  }

  sendSuccess(res, { data: { ticket }, message: `Ticket marked ${status.toLowerCase()}` });
};
