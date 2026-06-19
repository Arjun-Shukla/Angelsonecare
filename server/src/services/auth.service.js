import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendWelcomeEmail } from './email.service.js';
import { ApiError } from '../utils/apiResponse.js';

export const findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails?.[0]?.value;
  const googleId = profile.id;
  const name = profile.displayName;
  const profilePicture = profile.photos?.[0]?.value ?? '';

  // Search by googleId first, fall back to email (handles account linking)
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Back-fill googleId if the user was found by email but signed in via Google first time
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      if (!user.profilePicture) user.profilePicture = profilePicture;
      await user.save();
    }
  } else {
    user = await User.create({ name, email, googleId, profilePicture, authProvider: 'google' });
    // Fire-and-forget: don't await so OAuth redirect isn't delayed by SMTP
    sendWelcomeEmail(user);
  }

  return user;
};

export const issueTokens = (user) => {
  const payload = { sub: user._id.toString(), role: user.role, email: user.email };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const rotateAccessToken = (oldRefreshToken) => {
  const { sub, role, email } = verifyRefreshToken(oldRefreshToken);
  return signAccessToken({ sub, role, email });
};

export const registerUser = async ({ name, email, phone, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new ApiError(409, 'An account with this email already exists. Please sign in.');

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim() ?? '',
    password: hash,
    authProvider: 'local',
  });

  sendWelcomeEmail(user); // fire-and-forget — SMTP failure won't break signup
  return user;
};
