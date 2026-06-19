/**
 * Standard API response shape.
 *
 * Purpose: Keep all success/error responses consistent so the client can rely
 * on a predictable envelope: { success, message, data, meta }.
 *
 * TODO (implementation):
 *  - sendSuccess(res, { data, message, status = 200, meta })
 *  - ApiError class (statusCode, message, details) used with error middleware
 */

export const sendSuccess = (res, { data = null, message = 'OK', status = 200, meta } = {}) => {
  const body = { success: true, message, data };
  if (meta !== undefined) body.meta = meta;
  return res.status(status).json(body);
};

export class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
