"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  category: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setResults(data.results);
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong while searching. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>
        <h1 className="text-3xl md:text-4xl font-semibold mt-4 mb-2">Search Results for &ldquo;{query}&rdquo;</h1>
        <p className="text-gray-600">{isLoading ? "Searching..." : `Found ${results.length} result${results.length !== 1 ? "s" : ""}`}</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">{error}</div>}

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {results.map((result) => (
            <article key={result.id} className="border border-[var(--neutral-200)] rounded-lg p-6 hover:shadow-md transition-shadow">
              <Link href={`/blog/${result.slug}`}>
                <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">{result.title}</h2>
              </Link>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span>{formatDate(result.date)}</span>
                <span className="mx-2">•</span>
                <Link href={`/categories/${encodeURIComponent(result.category)}`} className="text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors">
                  {result.category}
                </Link>
              </div>
              <p className="text-gray-600 mb-4">{result.excerpt}</p>
              <Link href={`/blog/${result.slug}`} className="text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors text-sm font-medium inline-flex items-center">
                Read Article
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
          <p className="text-gray-500 max-w-md mx-auto">We couldn&apos;t find any articles matching your search. Please try different keywords or browse our categories.</p>
          <div className="mt-6">
            <Link href="/blog" className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-light)] transition-colors">
              Browse All Articles
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
