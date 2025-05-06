"use client";

import { useState } from "react";

type BlogSearchProps = {
  onSearch: (query: string) => void;
  searchQuery: string;
};

export default function BlogSearch({ onSearch, searchQuery }: BlogSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="w-full relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className={`h-5 w-5 transition-colors duration-200 ${isFocused ? "text-[var(--primary)]" : "text-gray-400"}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        name="search"
        id="search"
        value={searchQuery}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none sm:text-sm transition-all duration-200 ${
          isFocused ? "border-[var(--primary)] ring-1 ring-[var(--primary)]" : "hover:border-gray-300"
        }`}
        placeholder="Search articles..."
        aria-label="Search articles"
      />
    </div>
  );
}
