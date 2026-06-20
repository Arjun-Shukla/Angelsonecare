import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, getMe, refresh } from '../api/auth.api.js';
import { setAuthToken } from '../api/axios.js';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [accessToken, setTok] = useState(() => localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true); // true until initial auth check finishes

  // Sync the token to the axios default headers whenever it changes
  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  const storeToken = useCallback((token) => {
    setTok(token);
    if (token) localStorage.setItem('accessToken', token);
    else        localStorage.removeItem('accessToken');
  }, []);

  // On mount: restore session from stored token → getMe → if 401 → try refresh → if still fails → log out
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      const stored = localStorage.getItem('accessToken');
      if (!stored) { setLoading(false); return; }

      setAuthToken(stored);
      try {
        const res = await getMe();
        if (!cancelled) {
          setUser(res.data.user);
          storeToken(stored);
        }
      } catch {
        try {
          const refreshRes = await refresh();
          const newToken = refreshRes.data.accessToken;
          setAuthToken(newToken);
          const meRes = await getMe();
          if (!cancelled) {
            storeToken(newToken);
            setUser(meRes.data.user);
          }
        } catch {
          if (!cancelled) {
            storeToken(null);
            setUser(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    restore();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    const res = await apiLogin(email, password);
    const { accessToken: token, user: loggedInUser } = res.data;
    storeToken(token);
    setAuthToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  }, [storeToken]);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    storeToken(null);
    setUser(null);
  }, [storeToken]);

  const value = {
    user,
    setUser,
    accessToken,
    loading,
    login,
    logout,
    role: user?.role ?? null,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
