/**
 * Auth controller (thin HTTP layer).
 *
 * Endpoints:
 *   googleCallback  -> issue JWTs after Passport verifies Google login, redirect to client
 *   getMe           -> return the authenticated user
 *   refresh         -> rotate access token using refresh cookie
 *   logout          -> clear refresh cookie
 *
 * Delegates business logic to `auth.service.js`.
 * TODO (implementation): wire to auth.service + apiResponse.
 */

export const googleCallback = async (req, res) => {};
export const getMe = async (req, res) => {};
export const refresh = async (req, res) => {};
export const logout = async (req, res) => {};
