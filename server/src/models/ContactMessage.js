import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, trim: true, lowercase: true, default: '' },
  phone:   { type: String, required: true, trim: true },
  service: { type: String, trim: true, default: '' },
  message: { type: String, required: true, trim: true },
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
