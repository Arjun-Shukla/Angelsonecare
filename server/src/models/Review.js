/**
 * Review model — client feedback submitted after service completion.
 *
 * Planned fields:
 *   client     : ObjectId ref User, required
 *   booking    : ObjectId ref Booking, required (one review per booking)
 *   rating     : Number, 1–5, required
 *   comment    : String
 *   isApproved : Boolean, default false (admin moderates before public display)
 *   timestamps : createdAt / updatedAt
 *
 * Relationships:
 *   - 1—1 Booking (Review.booking, unique)
 *
 * TODO (implementation): define mongoose schema + unique index on booking, export model.
 */

export default null;
