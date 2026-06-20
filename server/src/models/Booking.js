import mongoose from 'mongoose';
import { BOOKING_STATUS, BOOKING_STATUS_VALUES, PAYMENT_STATUS, PAYMENT_STATUS_VALUES } from '../constants/bookingStatus.js';

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client is required'],
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: BOOKING_STATUS_VALUES,
      default: BOOKING_STATUS.PENDING,
    },

    // Patient information
    patient: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientAge: {
      type: Number,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      default: 'OTHER',
    },
    relationship: {
      type: String,
      trim: true,
      default: '',
    },

    // Scheduling
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    shift: {
      type: String,
      trim: true,
      default: '',
    },
    shiftTime: {
      type: String,
      trim: true,
      default: '',
    },

    // Location
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },

    // Financials
    amount: {
      type: Number,
      min: 0,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUS.PENDING,
    },

    // Booking notes and outcome
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    completedAt: {
      type: Date,
    },

    // OTP for service completion
    otp: {
      hash:      { type: String, select: false }, // bcrypt hash — never exposed
      code:      { type: String, default: null }, // plain OTP — shown in client dashboard while pending
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Speed up role-scoped list queries
bookingSchema.index({ client: 1, status: 1 });
bookingSchema.index({ leader: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
