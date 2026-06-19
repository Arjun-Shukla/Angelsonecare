/**
 * Authentication middleware.
 *
 * Purpose: Verify the JWT access token (Authorization header or cookie), load
 * the user, and attach it to `req.user`. Rejects with 401 if missing/invalid.
 *
 * TODO (implementation): use utils/jwt.verifyAccessToken + models/User.
 */

export const protect = async (req, res, next) => {};
