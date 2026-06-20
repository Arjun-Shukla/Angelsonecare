import Settings from '../models/Settings.js';
import { sendSuccess } from '../utils/apiResponse.js';

const UPSERT_OPTS = { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true };

// GET /api/settings
export const getSettings = async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { _singleton: 'global' },
    { $setOnInsert: { _singleton: 'global' } },
    UPSERT_OPTS
  );
  sendSuccess(res, { data: { settings } });
};

// PATCH /api/settings
export const updateSettings = async (req, res) => {
  const ALLOWED = [
    'platformName', 'tagline', 'supportEmail', 'supportPhone',
    'otpExpiry', 'maxBookingsPerLeader', 'businessHours', 'emergencyContact',
    'googleSignIn', 'emailNotifications', 'smsNotifications', 'showReviews', 'maintenanceMode',
    'emailBookingConfirmation', 'emailCaregiverAssignment', 'emailOtpVerification',
    'emailServiceCompletion', 'emailTicketAcknowledgement',
  ];

  const update = {};
  ALLOWED.forEach(key => {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  });

  const settings = await Settings.findOneAndUpdate(
    { _singleton: 'global' },
    { $set: update },
    UPSERT_OPTS
  );
  sendSuccess(res, { data: { settings }, message: 'Settings saved successfully' });
};
