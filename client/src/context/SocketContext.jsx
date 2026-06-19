import { createContext, useRef } from 'react';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  // socket will be connected once AuthContext provides a token (see auth implementation)
  const socketRef = useRef(null);

  const value = { socket: socketRef.current };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
