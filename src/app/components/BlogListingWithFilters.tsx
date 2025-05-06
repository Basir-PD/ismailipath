"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "./PostCard";

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

  // Sort and filter posts whenever dependencies change
  useEffect(() => {
    let result = [...posts];

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
  }, [posts, currentSort, currentFilter]);

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
      {/* Filters and sorting section - redesigned for better UX */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          {/* Mobile filter toggle button */}
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 md:hidden bg-white px-4 py-2.5 rounded-lg shadow-sm w-full mb-4 text-left">
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

          {/* Results count */}
          <p className="text-sm text-gray-500 md:text-right">
            Showing {filteredPosts.length === 0 ? 0 : (currentPage - 1) * postsPerPage + 1} - {Math.min(currentPage * postsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
          </p>
        </div>

        {/* Filter controls - now in a unified card */}
        <div className={`${showFilters ? "block" : "hidden md:block"}`}>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Category dropdown */}
              <div className="relative group flex-1">
                <label htmlFor="category-filter" className="text-xs text-gray-500 font-medium block mb-1.5 ml-1">
                  Filter by
                </label>
                <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--primary-light)] transition-colors">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="text-sm font-medium">{getCategoryDisplayName()}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="relative group flex-1">
                <label htmlFor="sort-by" className="text-xs text-gray-500 font-medium block mb-1.5 ml-1">
                  Sort by
                </label>
                <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--primary-light)] transition-colors">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    <span className="text-sm font-medium">{getSortDisplayName()}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <p className="text-sm text-gray-400">Try changing your filters or check back soon for new content.</p>
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
