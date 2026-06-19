/**
 * Async handler wrapper.
 *
 * Purpose: Wrap async controller functions so thrown errors / rejected promises
 * are forwarded to the central error middleware without try/catch boilerplate.
 *
 * Usage: router.post('/', asyncHandler(controller.create))
 */

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
