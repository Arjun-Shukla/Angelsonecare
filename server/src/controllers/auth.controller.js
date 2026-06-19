import { issueTokens, rotateAccessToken, registerUser } from '../services/auth.service.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const REFRESH_COOKIE = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'name, email and password are required');

  const user = await registerUser({ name, email, phone, password });
  const { accessToken, refreshToken } = issueTokens(user);

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  sendSuccess(res, {
    status: 201,
    message: 'Account created successfully',
    data: {
      accessToken,
      user: {
        _id:  user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role:  user.role,
        profilePicture: user.profilePicture,
      },
    },
  });
};

// Called after Passport verifies the Google profile. Issues tokens and
// redirects the browser back to the frontend OAuthCallback page.
export const googleCallback = async (req, res) => {
  const { accessToken, refreshToken } = issueTokens(req.user);

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);

  // Pass the short-lived access token and role via URL so OAuthCallback.jsx
  // can store it and route the user to the correct dashboard.
  const params = new URLSearchParams({ token: accessToken, role: req.user.role });
  res.redirect(`${env.clientUrl}/oauth/callback?${params}`);
};

export const getMe = async (req, res) => {
  sendSuccess(res, { data: { user: req.user } });
};

export const refresh = async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw new ApiError(401, 'No refresh token provided');

  const accessToken = rotateAccessToken(token);
  sendSuccess(res, { data: { accessToken } });
};

export const logout = async (req, res) => {
  res.clearCookie(REFRESH_COOKIE, { httpOnly: true, sameSite: cookieOptions.sameSite, secure: cookieOptions.secure });
  sendSuccess(res, { message: 'Logged out successfully' });
};
