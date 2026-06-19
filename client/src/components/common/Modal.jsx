/**
 * Modal — reusable dialog wrapper.
 * TODO (implementation): open/close, overlay, focus trap.
 */

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return <div className="modal">{children}</div>;
}
