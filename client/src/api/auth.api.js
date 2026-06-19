/**
 * Auth API calls.
 *   getMe()    -> GET /auth/me
 *   refresh()  -> POST /auth/refresh
 *   logout()   -> POST /auth/logout
 *   googleLoginUrl() -> builds the backend Google OAuth entry URL
 * TODO (implementation).
 */

// import api from './axios.js';

export const getMe = async () => {};
export const refresh = async () => {};
export const logout = async () => {};
export const googleLoginUrl = () => `${import.meta.env.VITE_API_URL}/api/auth/google`;
