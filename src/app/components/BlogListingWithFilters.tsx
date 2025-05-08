"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { unstable_noStore } from "next/cache";
import PostCard from "./PostCard";
import BlogSearch from "./BlogSearch";

// Define the blog post type based on the properties we need
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
};

type BlogListingProps = {
  initialPosts: BlogPost[];
  categories: Array<{ id: string; name: string; color: string }>;
};

export default function BlogListingWithFilters({ initialPosts, categories }: BlogListingProps) {
  // Add this line to ensure this component is not cached
  unstable_noStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL params or set defaults
  const currentPage = Number(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "newest";
  const currentFilter = searchParams.get("category") || "";
  const postsPerPage = 9;

  const [posts] = useState<BlogPost[]>(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sort and filter posts whenever dependencies change
  useEffect(() => {
    let result = [...posts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((post) => post.title.toLowerCase().includes(query) || post.category.toLowerCase().includes(query));
    }

    // Apply category filter if selected
    if (currentFilter) {
      result = result.filter((post) => post.category === currentFilter);
    }

    // Apply sorting
    switch (currentSort) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredPosts(result);
    setTotalPages(Math.ceil(result.length / postsPerPage));
  }, [posts, currentSort, currentFilter, searchQuery]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Reset to page 1 when searching
    if (currentPage > 1) {
      updateParams({ page: "1" });
    }
  };

  // Current page posts
  const displayedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // Update URL with new parameters
  const updateParams = (params: { [key: string]: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or delete params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Always reset to page 1 when changing filters or sort
    if (params.sort || params.category) {
      newParams.set("page", "1");
    }

    router.push(`/blog?${newParams.toString()}`);
  };

  // Get display name for current sort
  const getSortDisplayName = () => {
    switch (currentSort) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "a-z":
        return "Title (A-Z)";
      case "z-a":
        return "Title (Z-A)";
      default:
        return "Sort By";
    }
  };

  // Get category display name
  const getCategoryDisplayName = () => {
    if (!currentFilter) return "All Categories";
    const category = categories.find((c) => c.name === currentFilter);
    return category ? category.name : "All Categories";
  };

  return (
    <div className="space-y-8">
      {/* Search and filters row */}
      <div className="mb-6">
        {/* Top row with search and post count */}
        <div className="relative w-full mb-4">
          {/* Search input - full width */}
          <BlogSearch onSearch={handleSearch} searchQuery={searchQuery} />

          {/* Results count and filters - desktop */}
          <div className="flex items-center mt-3 justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredPosts.length === 0 ? 0 : (currentPage - 1) * postsPerPage + 1} - {Math.min(currentPage * postsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
            </p>

            {/* Filter controls - desktop */}
            <div className="hidden md:flex items-center gap-6">
              {/* Category dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-2 text-gray-700 hover:text-[var(--primary)] transition-colors px-3 py-1.5 rounded-md">
                  <span className="text-sm font-medium">{getCategoryDisplayName()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <select
                  id="category-filter"
                  value={currentFilter}
                  onChange={(e) => updateParams({ category: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-2 text-gray-700 hover:text-[var(--primary)] transition-colors px-3 py-1.5 rounded-md">
                  <span className="text-sm font-medium">{getSortDisplayName()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <select
                  id="sort-by"
                  value={currentSort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Sort posts"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">Title (A-Z)</option>
                  <option value="z-a">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile filter toggle button */}
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 mt-3 bg-white px-4 py-2.5 rounded-lg border border-gray-200 w-full text-left">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="font-medium">Filters & Sorting</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ml-auto transform transition-transform ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mobile filter controls */}
          <div className={`md:hidden w-full ${showFilters ? "block" : "hidden"} mt-4`}>
            <div className="flex flex-col gap-4">
              {/* Category dropdown - mobile */}
              <div className="relative group flex-1">
                <label htmlFor="category-filter-mobile" className="text-xs text-gray-500 font-medium block mb-1.5 ml-1">
                  Filter by
                </label>
                <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--primary-light)] transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{getCategoryDisplayName()}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <select
                  id="category-filter-mobile"
                  value={currentFilter}
                  onChange={(e) => updateParams({ category: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort dropdown - mobile */}
              <div className="relative group flex-1">
                <label htmlFor="sort-by-mobile" className="text-xs text-gray-500 font-medium block mb-1.5 ml-1">
                  Sort by
                </label>
                <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--primary-light)] transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{getSortDisplayName()}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <select
                  id="sort-by-mobile"
                  value={currentSort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Sort posts"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">Title (A-Z)</option>
                  <option value="z-a">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts list */}
      {displayedPosts.length > 0 ? (
        <div className="space-y-6">
          {displayedPosts.map((post) => (
            <PostCard key={post.id} title={post.title} slug={post.slug} date={post.date} thumbnailUrl={undefined} category={post.category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--neutral-100)] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-2 text-lg">No articles found.</p>
          <p className="text-sm text-gray-400">
            {searchQuery.trim() ? "Try using different search terms or check your filters." : "Try changing your filters or check back soon for new content."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            {/* Previous button */}
            <button
              onClick={() => updateParams({ page: (currentPage - 1).toString() })}
              disabled={currentPage <= 1}
              className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                currentPage <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-[var(--primary-light)]/10 hover:text-[var(--primary)]"
              } border border-gray-300`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Previous</span>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => updateParams({ page: page.toString() })}
                aria-current={currentPage === page ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === page ? "z-10 bg-[var(--primary-light)]/10 border-[var(--primary)] text-[var(--primary)]" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                } border`}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => updateParams({ page: (currentPage + 1).toString() })}
              disabled={currentPage >= totalPages}
              className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                currentPage >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-[var(--primary-light)]/10 hover:text-[var(--primary)]"
              } border border-gray-300`}
            >
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
