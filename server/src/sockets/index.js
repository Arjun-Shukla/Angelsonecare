import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { ROOMS } from '../constants/events.js';
import { ROLES } from '../constants/roles.js';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  // Authenticate every socket connection via the JWT passed in handshake auth
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No auth token provided'));
    try {
      socket.user = verifyAccessToken(token); // { sub, role, email }
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    // Every user joins their personal room: user:<userId>
    socket.join(ROOMS.user(socket.user.sub));

    // Role-based rooms so we can broadcast to all admins / all leaders at once
    if (socket.user.role === ROLES.ADMIN)  socket.join(ROOMS.roleAdmin);
    if (socket.user.role === ROLES.LEADER) socket.join(ROOMS.roleLeader);

    socket.on('disconnect', () => {});
  });

  return io;
};

export const getIo = () => io;
