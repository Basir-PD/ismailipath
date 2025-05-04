export default function CategoryLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="divide-y">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-6 first:pt-0 last:pb-0">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
