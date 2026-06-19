/**
 * Rating — star rating display/input (1-5) for reviews.
 * TODO (implementation): readOnly display + interactive input modes.
 */

export default function Rating({ value = 0, onChange }) {
  return <div className="rating" data-value={value}>{/* stars */}</div>;
}
