/**
 * Socket.IO client singleton.
 *
 * Purpose: Create and manage a single socket connection to the backend, with
 * the auth token attached to the handshake. Used by SocketContext.
 *
 * TODO (implementation): connect with auth, expose connect/disconnect helpers.
 */

import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    autoConnect: false,
    withCredentials: true,
    auth: { token },
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
