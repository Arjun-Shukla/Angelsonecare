/**
 * User model — represents Clients, Leaders, and Admins/Founder.
 *
 * Planned fields:
 *   name        : String, required
 *   email       : String, required, unique, lowercase
 *   googleId    : String, unique sparse (set via Google OAuth)
 *   role        : String, enum ROLES, default CLIENT
 *   phone       : String
 *   avatar      : String (profile image URL)
 *   isActive    : Boolean, default true
 *   timestamps  : createdAt / updatedAt
 *
 * Relationships:
 *   - 1—N Bookings as client (Booking.client)
 *   - 1—N Bookings as assigned leader (Booking.leader)
 *   - 1—N Tickets (Ticket.user)
 *
 * TODO (implementation): define mongoose schema + indexes, export model.
 */

// import mongoose from 'mongoose';
// const userSchema = new mongoose.Schema({ ... }, { timestamps: true });
// export default mongoose.model('User', userSchema);

export default null;
