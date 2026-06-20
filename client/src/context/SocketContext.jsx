import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { connectSocket, disconnectSocket, getSocket } from '../socket/socket.js';

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, accessToken } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (user && accessToken) {
      if (!connectedRef.current) {
        const s = connectSocket(accessToken);
        s.connect();
        connectedRef.current = true;
        setSocket(s);
      }
    } else {
      if (connectedRef.current) {
        disconnectSocket();
        connectedRef.current = false;
        setSocket(null);
      }
    }
  }, [user, accessToken]);

  // If user logs in again with a different token, reconnect with the new token
  useEffect(() => {
    const existing = getSocket();
    if (existing && accessToken) {
      existing.auth = { token: accessToken };
    }
  }, [accessToken]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
