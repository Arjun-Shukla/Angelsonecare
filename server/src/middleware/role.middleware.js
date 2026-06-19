/**
 * Role-based authorization middleware (RBAC).
 *
 * Purpose: Guard routes by role. Use after `protect`.
 * Usage: router.get('/', protect, authorize(ROLES.ADMIN), handler)
 *
 * TODO (implementation): check req.user.role against allowed roles, 403 otherwise.
 */

export const authorize = (...allowedRoles) => (req, res, next) => {};
