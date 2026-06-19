import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

// DEV MODE: Mock client user — replace with real auth when backend is implemented
const DEV_USER = {
  _id: 'mock-001',
  name: 'Arjun Shukla',
  email: 'arjunshukla489@gmail.com',
  phone: '9876543210',
  role: 'CLIENT',
  avatar: null,
  createdAt: '2024-01-15T10:00:00.000Z',
  address: {
    line1: 'Flat 402, Skyline Residency',
    area: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400068',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEV_USER);
  const [loading, setLoading] = useState(false);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    role: user?.role ?? null,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
