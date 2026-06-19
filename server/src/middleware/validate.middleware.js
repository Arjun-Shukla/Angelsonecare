/**
 * Validation middleware.
 *
 * Purpose: Run a validator schema (from src/validators) against the request and
 * forward a 422 error on failure.
 * Usage: router.post('/', validate(bookingCreateSchema), handler)
 *
 * TODO (implementation): validate req.body/params/query, attach parsed values.
 */

export const validate = (schema) => (req, res, next) => {};
