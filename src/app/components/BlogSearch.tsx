"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Use useEffect for debouncing instead of a custom hook
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          value={searchQuery}
          onChange={handleSearch}
          className="block w-full pl-10 pr-3 py-3 border-0 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[var(--primary)] sm:text-sm"
          placeholder="Search articles..."
          aria-label="Search articles"
        />
      </div>
    </div>
  );
}
