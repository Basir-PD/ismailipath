export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full min-h-[60vh]">
      <div className="animate-pulse flex flex-col space-y-8 w-full max-w-3xl">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="flex-grow">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
