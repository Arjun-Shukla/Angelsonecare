import mongoose from 'mongoose';
import { ROLES, ROLE_VALUES } from '../constants/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      select: false, // never returned in queries unless explicitly requested
    },
    profilePicture: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.CLIENT,
    },
    authProvider: {
      type: String,
      enum: ['google', 'local'],
      default: 'local',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    // Leader-specific profile fields
    bio:             { type: String, default: '' },
    location:        { type: String, default: '' },
    experience:      { type: String, default: '' },
    specializations: { type: [String], default: [] },
    address: {
      line1:   { type: String, default: '' },
      area:    { type: String, default: '' },
      city:    { type: String, default: '' },
      state:   { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Compound index for the find-or-create lookup in auth.service.js
userSchema.index({ googleId: 1, email: 1 });

export default mongoose.model('User', userSchema);
