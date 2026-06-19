/**
 * Payment model — Razorpay transaction records.
 *
 * Planned fields:
 *   booking            : ObjectId ref Booking, required
 *   client             : ObjectId ref User, required
 *   razorpayOrderId    : String
 *   razorpayPaymentId  : String
 *   razorpaySignature  : String
 *   amount             : Number
 *   currency           : String, default 'INR'
 *   status             : String (created | paid | failed | refunded)
 *   timestamps         : createdAt / updatedAt
 *
 * Relationships:
 *   - 1—1 Booking (Payment.booking)
 *
 * TODO (implementation): define mongoose schema, export model.
 */

export default null;
