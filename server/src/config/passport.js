/**
 * Passport Google OAuth 2.0 strategy configuration.
 *
 * Purpose: Configure the Google OAuth strategy used by the auth routes.
 * On successful Google login, find-or-create the User and pass it through to
 * the auth controller which issues JWTs.
 *
 * TODO (implementation):
 *  - new GoogleStrategy({ clientID, clientSecret, callbackURL }, verify)
 *  - verify(): upsert User by googleId/email, default role = CLIENT
 *  - No sessions (stateless JWT) — session: false on the route
 */

export const configurePassport = (passport) => {};
