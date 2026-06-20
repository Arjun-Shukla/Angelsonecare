import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Singleton guard — only one settings doc
  _singleton: { type: String, default: 'global', unique: true },

  // General
  platformName:  { type: String, default: 'Angels One Healthcare Services' },
  tagline:       { type: String, default: 'Professional Care, Right at Home' },
  supportEmail:  { type: String, default: 'support@angelsone.com' },
  supportPhone:  { type: String, default: '+91 98100 00000' },

  // Operations
  otpExpiry:           { type: Number, default: 10 },
  maxBookingsPerLeader:{ type: Number, default: 3 },
  businessHours:       { type: String, default: 'Mon-Sat, 8 AM – 8 PM' },
  emergencyContact:    { type: String, default: '+91 98100 11111' },

  // Feature toggles
  googleSignIn:       { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  smsNotifications:   { type: Boolean, default: true },
  showReviews:        { type: Boolean, default: true },
  maintenanceMode:    { type: Boolean, default: false },

  // Email template toggles (non-sensitive)
  emailBookingConfirmation:   { type: Boolean, default: true },
  emailCaregiverAssignment:   { type: Boolean, default: true },
  emailOtpVerification:       { type: Boolean, default: true },
  emailServiceCompletion:     { type: Boolean, default: true },
  emailTicketAcknowledgement: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
