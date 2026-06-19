import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authentication token missing');

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub).select('-__v');
    if (!user) throw new ApiError(401, 'User no longer exists');
    if (!user.isActive) throw new ApiError(403, 'Account is deactivated');

    req.user = user;
    next();
  } catch (err) {
    // Re-throw ApiErrors as-is; wrap jwt errors as 401
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
