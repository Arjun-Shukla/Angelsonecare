import { ApiError } from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not found: ${req.method} ${req.originalUrl}`));
};
