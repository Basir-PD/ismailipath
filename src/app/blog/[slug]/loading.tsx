export default function BlogLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-8 pb-6 border-b">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="flex items-center gap-3">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full h-48 bg-gray-200 rounded-md"></div>
        </div>

        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
}
