/**
 * Notification model — in-app notifications surfaced via Socket.IO.
 *
 * Planned fields:
 *   user      : ObjectId ref User, required (recipient)
 *   type      : String (booking | ticket | review | system)
 *   message   : String, required
 *   link      : String (deep link in the client app)
 *   isRead    : Boolean, default false
 *   timestamps: createdAt / updatedAt
 *
 * Relationships:
 *   - belongs to user (User)
 *
 * TODO (implementation): define mongoose schema, export model.
 */

export default null;
