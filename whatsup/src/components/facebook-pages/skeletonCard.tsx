export default function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  );
}
