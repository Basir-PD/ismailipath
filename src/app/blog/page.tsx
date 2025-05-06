import { Suspense } from "react";
import PostCard from "../components/PostCard";
import { fetchPages } from "../lib/notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Define types based on the Notion properties we need
type NotionTitle = {
  title: Array<{ plain_text: string }>;
};

type NotionRichText = {
  rich_text: Array<{ plain_text: string }>;
};

type NotionSelect = {
  select: {
    name: string;
  };
};

// Format date helper function
function formatDate(dateString: string | null) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const metadata = {
  title: "Blog | Basir Payenda",
  description: "Read the latest articles and blog posts from Basir Payenda.",
};

export default async function BlogPage() {
  const posts = await fetchPages();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Blog
        </h1>
        <div className="w-20 h-1 bg-[var(--primary)] mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">Explore my latest thoughts, ideas, and insights on development, design, and technology.</p>
      </div>

      <Suspense fallback={<div>Loading posts...</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const pagePost = post as PageObjectResponse;
            const title = (pagePost.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
            const slug = (pagePost.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "";
            const category = (pagePost.properties.Category as NotionSelect)?.select?.name || "Uncategorized";
            const date = formatDate(pagePost.created_time);

            return <PostCard key={pagePost.id} title={title} slug={slug} date={date} thumbnailUrl={undefined} category={category} />;
          })}
        </div>
      </Suspense>

      {posts.length === 0 && (
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
          <p className="text-sm text-gray-400">Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
}
