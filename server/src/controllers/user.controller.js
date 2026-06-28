import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import { ROLES } from '../constants/roles.js';

// GET /api/users?role=LEADER&isActive=true
// Admin only — returns users filtered by optional query params
export const listUsers = async (req, res) => {
  const filter = {};
  if (req.query.role)     filter.role     = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive !== 'false';

  const users = await User.find(filter)
    .select('-__v')
    .sort({ createdAt: -1 });

  sendSuccess(res, { data: { users }, message: 'Users fetched successfully' });
};

// GET /api/users/:id — Admin only
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v');
  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, { data: { user } });
};

// POST /api/users/leaders — Admin creates a leader account
export const createLeader = async (req, res) => {
  const { name, email, phone, password, experience, location, specializations, bio } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new ApiError(409, 'A user with this email already exists');

  const hash = await bcrypt.hash(password, 12);

  const leader = await User.create({
    name:            name.trim(),
    email:           email.toLowerCase().trim(),
    phone:           phone?.trim() ?? '',
    password:        hash,
    role:            ROLES.LEADER,
    authProvider:    'local',
    experience:      experience?.trim() ?? '',
    location:        location?.trim()   ?? '',
    specializations: Array.isArray(specializations) ? specializations : [],
    bio:             bio?.trim()        ?? '',
  });

  sendSuccess(res, {
    status: 201,
    message: 'Leader account created successfully',
    data: { user: { _id: leader._id, name: leader.name, email: leader.email, phone: leader.phone, role: leader.role, experience: leader.experience, location: leader.location, specializations: leader.specializations, bio: leader.bio } },
  });
};

// PATCH /api/users/:id — Admin updates user fields
export const updateUser = async (req, res) => {
  const { name, phone, isActive, role, experience, location, specializations, bio } = req.body;
  const update = {};
  if (name            !== undefined) update.name            = name;
  if (phone           !== undefined) update.phone           = phone;
  if (isActive        !== undefined) update.isActive        = isActive;
  if (role            !== undefined) update.role            = role;
  if (experience      !== undefined) update.experience      = experience;
  if (location        !== undefined) update.location        = location;
  if (specializations !== undefined) update.specializations = specializations;
  if (bio             !== undefined) update.bio             = bio;

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-__v');
  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, { data: { user }, message: 'User updated successfully' });
};

// DELETE /api/users/:id — Admin soft-deletes by deactivating
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, { message: 'User deactivated successfully' });
};
