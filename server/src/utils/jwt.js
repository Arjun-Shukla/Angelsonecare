/**
 * JWT helpers — sign and verify access & refresh tokens.
 *
 * Purpose: Single source of truth for token creation/verification used by the
 * auth service, auth middleware, and refresh flow.
 *
 * TODO (implementation):
 *  - signAccessToken(payload)  -> short-lived token (env.jwt.accessExpiry)
 *  - signRefreshToken(payload) -> long-lived token (env.jwt.refreshExpiry)
 *  - verifyAccessToken(token)  -> decoded payload or throw
 *  - verifyRefreshToken(token) -> decoded payload or throw
 */

export const signAccessToken = (payload) => {};
export const signRefreshToken = (payload) => {};
export const verifyAccessToken = (token) => {};
export const verifyRefreshToken = (token) => {};
