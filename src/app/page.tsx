import { fetchPages, fetchCategories } from "./lib/notion";
import { Metadata } from "next";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import HeroSection from "./components/HeroSection";
import PostCard from "./components/PostCard";
import CategoryHeader from "./components/CategoryHeader";

export const metadata: Metadata = {
  title: "IsmailiPath | Spiritual Knowledge & Teachings",
  description: "Discover spiritual knowledge and teachings on the Ismaili Path - Explore insightful articles on spirituality, history, and wisdom",
  keywords: ["Ismaili", "spirituality", "knowledge", "teachings", "wisdom", "guidance"],
};

type NotionTitle = {
  title: Array<{ plain_text: string }>;
};

type NotionRichText = {
  rich_text: Array<{ plain_text: string }>;
};

type NotionSelect = {
  select: {
    name: string;
    color: string;
  };
};

type NotionFiles = {
  files: Array<{
    file?: { url: string };
    external?: { url: string };
    name: string;
  }>;
};

type GroupedPosts = {
  [category: string]: PageObjectResponse[];
};

function formatDate(dateString: string | null) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Home() {
  const allPosts = await fetchPages();
  const categories = await fetchCategories();

  // Group posts by category
  const groupedPosts: GroupedPosts = {};

  // Initialize with empty arrays for all categories
  categories.forEach((category) => {
    groupedPosts[category.name] = [];
  });

  // Group posts by their categories
  allPosts.forEach((post) => {
    const pagePost = post as PageObjectResponse;
    const category = (pagePost.properties.Category as NotionSelect)?.select?.name;

    if (category && groupedPosts[category]) {
      groupedPosts[category].push(pagePost);
    } else if (category) {
      // If the category exists but wasn't in our initial list
      groupedPosts[category] = [pagePost];
    } else {
      // Posts without a category
      if (!groupedPosts["Uncategorized"]) {
        groupedPosts["Uncategorized"] = [];
      }
      groupedPosts["Uncategorized"].push(pagePost);
    }
  });

  // Filter out empty categories and sort by number of posts
  const sortedCategories = Object.entries(groupedPosts)
    .filter(([, posts]) => posts.length > 0)
    .sort(([, postsA], [, postsB]) => postsB.length - postsA.length);

  // Get featured posts (first 3 from all categories)
  const featuredPosts = allPosts.slice(0, 3);

  return (
    <div>
      <HeroSection />

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Featured Articles
            </h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => {
              const pagePost = post as PageObjectResponse;
              const title = (pagePost.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
              const slug = (pagePost.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "";
              const thumbnail = (pagePost.properties.Thumbnail as NotionFiles)?.files?.[0];
              const thumbnailUrl = thumbnail?.file?.url || thumbnail?.external?.url;
              const category = (pagePost.properties.Category as NotionSelect)?.select?.name || "Uncategorized";
              const date = formatDate(pagePost.created_time);

              return <PostCard key={pagePost.id} title={title} slug={slug} date={date} thumbnailUrl={thumbnailUrl} category={category} />;
            })}
          </div>
        </section>
      )}

      {/* Categories Sections */}
      <div className="space-y-16">
        {sortedCategories.map(([category, posts]) => (
          <section key={category} className="bg-white p-6 rounded-lg shadow-sm">
            <CategoryHeader title={category} count={posts.length} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.slice(0, 4).map((post) => {
                const title = (post.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
                const slug = (post.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "";
                const thumbnail = (post.properties.Thumbnail as NotionFiles)?.files?.[0];
                const thumbnailUrl = thumbnail?.file?.url || thumbnail?.external?.url;
                const date = formatDate(post.created_time);

                return <PostCard key={post.id} title={title} slug={slug} date={date} thumbnailUrl={thumbnailUrl} category={category} />;
              })}
            </div>
          </section>
        ))}

        {sortedCategories.length === 0 && (
          <div className="text-center py-12 bg-white p-6 rounded-lg shadow-sm">
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
            <p className="text-sm text-gray-400">Check back soon for new content.</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="mt-20 mb-10 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/10 p-8 rounded-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">Subscribe to receive our latest articles and spiritual insights directly to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-md border border-[var(--neutral-300)] focus:ring-[var(--primary)] focus:border-[var(--primary)]"
              required
            />
            <button type="submit" className="btn btn-primary py-3 px-6 rounded-md font-medium">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
}
