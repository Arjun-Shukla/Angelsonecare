/**
 * Review service — review business logic.
 *
 * Responsibilities:
 *   - createReview(clientId, payload)   // only after booking COMPLETED, one per booking
 *   - listApproved()                    // public website reviews
 *   - listByClient(clientId)
 *   - approve(reviewId)
 *   - remove(reviewId)
 *
 * Collaborators: models/Review, models/Booking, sockets/emitters.
 * TODO (implementation).
 */

export const createReview = async (clientId, payload) => {};
export const listApproved = async () => {};
export const listByClient = async (clientId) => {};
export const approve = async (reviewId) => {};
export const remove = async (reviewId) => {};
