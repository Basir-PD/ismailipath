import { Suspense } from "react";
import { fetchPages, fetchCategories, fetchBySlug } from "./lib/notion";
import { Metadata } from "next";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import BlogListingWithFilters from "./components/BlogListingWithFilters";

export const metadata: Metadata = {
  title: "B. Payenda | Spiritual Knowledge & Teachings",
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

export default async function Home() {
  const posts = await fetchPages();
  const categories = await fetchCategories();

  // Test: Fetch the first article directly to verify functionality
  if (posts.length > 0) {
    const firstPost = posts[0] as PageObjectResponse;
    const slug = (firstPost.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "";
    if (slug) {
      console.log("Testing article fetch with slug:", slug);
      const article = await fetchBySlug(slug);
      console.log("Article fetch test result:", article ? "Success" : "Failed");
    }
  }

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
          <span className="text-[var(--primary)]">B. Payenda</span>
        </h1>
        <div className="w-20 h-1 bg-[var(--primary)] mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">Explore the spiritual journey through insightful articles, historical narratives, and wisdom teachings.</p>
      </div>

      <Suspense fallback={<div>Loading posts...</div>}>
        <BlogListingWithFilters initialPosts={formattedPosts} categories={categories} />
      </Suspense>
    </div>
  );
}
