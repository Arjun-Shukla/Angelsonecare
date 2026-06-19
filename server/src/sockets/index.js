/**
 * Socket.IO initialization + connection auth.
 *
 * Purpose: Create the io instance, authenticate each socket via JWT from the
 * handshake, join role/user rooms, and register feature handlers. Exposes a
 * getter so the rest of the app (emitters) can access io.
 *
 * Rooms joined on connect: user:{id}, role:admin | role:leader (by role).
 *
 * TODO (implementation):
 *  - io.use(authMiddleware) -> verify token, attach socket.user
 *  - on 'connection': join rooms, register handlers, handle disconnect
 */

import { registerBookingHandlers } from './handlers/booking.socket.js';
import { registerTicketHandlers } from './handlers/ticket.socket.js';
import { registerDashboardHandlers } from './handlers/dashboard.socket.js';

let io = null;

export const initSocket = (httpServer) => {
  // io = new Server(httpServer, { cors: { origin: env.clientUrl, credentials: true } });
  // io.use(socketAuthMiddleware);
  // io.on('connection', (socket) => {
  //   registerBookingHandlers(io, socket);
  //   registerTicketHandlers(io, socket);
  //   registerDashboardHandlers(io, socket);
  // });
  return io;
};

export const getIo = () => io;
