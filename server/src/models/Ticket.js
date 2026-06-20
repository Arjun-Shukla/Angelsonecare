import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text:   { type: String, required: true, trim: true },
  at:     { type: Date, default: Date.now },
}, { _id: true });

const ticketSchema = new Schema({
  ticketId: { type: String, unique: true, sparse: true },
  user:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking:  { type: Schema.Types.ObjectId, ref: 'Booking', default: null },
  category: {
    type: String,
    enum: ['Service Issue', 'Billing Query', 'Information Update', 'Caregiver Feedback', 'General Inquiry', 'Emergency'],
    default: 'General Inquiry',
  },
  subject:     { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  status:          { type: String, enum: ['OPEN', 'IN_PROGRESS', 'SOLVED', 'UNSOLVED', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  priority:        { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  resolvedBy:      { type: Schema.Types.ObjectId, ref: 'User', default: null },
  statusUpdatedAt: { type: Date, default: null },
  messages:        [messageSchema],
}, { timestamps: true });

ticketSchema.pre('save', function (next) {
  if (this.isNew && !this.ticketId) {
    this.ticketId = `TKT-${Date.now().toString().slice(-6)}`;
  }
  next();
});

ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ status: 1 });

export default mongoose.model('Ticket', ticketSchema);
