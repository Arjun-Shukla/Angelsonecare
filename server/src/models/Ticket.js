/**
 * Ticket model — support tickets with a message thread.
 *
 * Planned fields:
 *   user        : ObjectId ref User, required (the raiser)
 *   booking     : ObjectId ref Booking, optional (related booking)
 *   subject     : String, required
 *   description : String
 *   status      : String, enum TICKET_STATUS, default OPEN
 *   priority    : String, enum TICKET_PRIORITY, default MEDIUM
 *   assignedTo  : ObjectId ref User (leader/admin), nullable
 *   messages    : [{ sender: ObjectId ref User, text: String, at: Date }]
 *   timestamps  : createdAt / updatedAt
 *
 * Relationships:
 *   - belongs to user (User); optional booking link (Booking)
 *
 * TODO (implementation): define mongoose schema (with messages subdoc), export model.
 */

export default null;
