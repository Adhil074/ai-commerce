export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="h-125 bg-gray-200 rounded-lg" />
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 w-2/3 rounded" />
          <div className="h-4 bg-gray-200 w-full rounded" />
          <div className="h-4 bg-gray-200 w-5/6 rounded" />
          <div className="h-6 bg-gray-200 w-1/4 rounded" />
          <div className="h-10 bg-gray-200 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
}