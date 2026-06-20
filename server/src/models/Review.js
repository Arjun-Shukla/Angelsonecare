import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  reviewId:   { type: String, unique: true, sparse: true },
  client:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking:    { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  rating:     { type: Number, min: 1, max: 5, required: true },
  title:      { type: String, trim: true, default: '' },
  comment:    { type: String, trim: true, default: '' },
  isApproved:  { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.pre('save', function (next) {
  if (this.isNew && !this.reviewId) {
    this.reviewId = `REV-${Date.now().toString().slice(-8)}`;
  }
  next();
});

reviewSchema.index({ client: 1, createdAt: -1 });
reviewSchema.index({ isApproved: 1, rating: -1 });

export default mongoose.model('Review', reviewSchema);
