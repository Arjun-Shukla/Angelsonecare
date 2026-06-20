import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * ServiceSession — created when a booking is accepted.
 *
 * Connects: Booking ↔ Client ↔ Leader ↔ Admin.
 * Tracks the live progress of a care engagement via a timeline log.
 * Closed when the booking reaches COMPLETED status.
 *
 * Relationships:
 *   booking  1—1  ServiceSession  (unique index on booking)
 *   client   1—N  ServiceSession  (one client can have many sessions)
 *   leader   1—N  ServiceSession
 *   admin    1—N  ServiceSession  (the admin who accepted the booking)
 */

const SESSION_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
};

const timelineEntrySchema = new Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: '' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, _id: false }
);

const serviceSessionSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.ACTIVE,
    },
    timeline: [timelineEntrySchema],
    startedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

serviceSessionSchema.index({ client: 1 });
serviceSessionSchema.index({ leader: 1 });

export const SESSION_STATUS_VALUES = Object.values(SESSION_STATUS);
export default mongoose.model('ServiceSession', serviceSessionSchema);
