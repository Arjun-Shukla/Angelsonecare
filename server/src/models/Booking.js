/**
 * Booking model — a client's request for a service and its lifecycle.
 *
 * Planned fields:
 *   client        : ObjectId ref User, required
 *   service       : ObjectId ref Service, required
 *   leader        : ObjectId ref User (assigned by admin), nullable
 *   status        : String, enum BOOKING_STATUS, default PENDING
 *   scheduleDate  : Date
 *   address       : { line1, line2, city, state, pincode }
 *   amount        : Number
 *   paymentStatus : String, enum PAYMENT_STATUS, default PENDING
 *   otp           : { hash: String, expiresAt: Date }  // for completion verification
 *   notes         : String
 *   timestamps    : createdAt / updatedAt
 *
 * Relationships:
 *   - belongs to client (User) and service (Service)
 *   - assigned leader (User)
 *   - 1—1 Payment (Payment.booking)
 *   - 1—1 Review (Review.booking)
 *
 * Notes: OTP is stored hashed and cleared after successful verification.
 *
 * TODO (implementation): define mongoose schema + indexes, export model.
 */

export default null;
