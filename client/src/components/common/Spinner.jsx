export default function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <div
        role="status"
        aria-label="Loading"
        className={`${s} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
      />
    </div>
  );
}
