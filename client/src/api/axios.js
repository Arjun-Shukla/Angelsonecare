/**
 * Axios instance — shared HTTP client.
 *
 * Purpose: Pre-configured axios with baseURL (VITE_API_URL), credentials, and
 * interceptors for attaching the access token and handling 401 -> token refresh.
 *
 * TODO (implementation): request interceptor (auth header) + response
 * interceptor (refresh-on-401, redirect on failure).
 */

import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

export default api;
