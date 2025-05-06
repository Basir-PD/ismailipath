"use client";

import { useMemo } from "react";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
};

type BlogStatisticsProps = {
  posts: BlogPost[];
  categories: Array<{ id: string; name: string; color: string }>;
};

export default function BlogStatistics({ posts, categories }: BlogStatisticsProps) {
  const stats = useMemo(() => {
    // Calculate post counts per category
    const categoryCounts: Record<string, number> = {};

    posts.forEach((post) => {
      if (categoryCounts[post.category]) {
        categoryCounts[post.category]++;
      } else {
        categoryCounts[post.category] = 1;
      }
    });

    // Sort categories by count
    const sortedCategories = categories
      .map((category) => ({
        ...category,
        count: categoryCounts[category.name] || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Only get top 5 categories

    // Calculate newest post
    const newestPost = posts.length > 0 ? [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

    return {
      totalPosts: posts.length,
      topCategories: sortedCategories,
      newestPost,
      avgPostsPerMonth: Math.round(posts.length / 6), // Assuming active for 6 months
    };
  }, [posts, categories]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Blog Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-[var(--primary-light)]/10 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Posts</p>
          <p className="text-2xl font-bold text-[var(--primary)]">{stats.totalPosts}</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Categories</p>
          <p className="text-2xl font-bold text-blue-500">{categories.length}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Avg. Posts per Month</p>
          <p className="text-2xl font-bold text-green-500">{stats.avgPostsPerMonth}</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Last Updated</p>
          <p className="text-2xl font-bold text-purple-500">{stats.newestPost ? new Date(stats.newestPost.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}</p>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-3">Popular Categories</h3>
        <div className="flex flex-wrap gap-2">
          {stats.topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${encodeURIComponent(category.name)}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                bg-[var(--primary-light)]/10 text-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-colors"
            >
              {category.name}
              <span className="ml-1.5 bg-white px-1.5 py-0.5 rounded-full text-xs">{category.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
