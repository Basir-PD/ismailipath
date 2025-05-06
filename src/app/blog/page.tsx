import { Suspense } from "react";
import { fetchPages, fetchCategories } from "../lib/notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import BlogListingWithFilters from "../components/BlogListingWithFilters";
import BlogSearch from "../components/BlogSearch";

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
  const categories = await fetchCategories();

  // Transform posts to the format expected by BlogListingWithFilters
  const formattedPosts = posts.map((post) => {
    const pagePost = post as PageObjectResponse;
    const title = (pagePost.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
    const slug = (pagePost.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "";
    const category = (pagePost.properties.Category as NotionSelect)?.select?.name || "Uncategorized";
    const date = pagePost.created_time || "";

    return {
      id: pagePost.id,
      title,
      slug,
      category,
      date,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Blog
        </h1>
        <div className="w-20 h-1 bg-[var(--primary)] mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">Explore my latest thoughts, ideas, and insights on development, design, and technology.</p>
      </div>

      <BlogSearch />

      <Suspense fallback={<div>Loading posts...</div>}>
        <BlogListingWithFilters initialPosts={formattedPosts} categories={categories} />
      </Suspense>
    </div>
  );
}
