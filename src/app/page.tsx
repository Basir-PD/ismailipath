import { fetchPages, fetchCategories } from "./lib/notion";
import Link from "next/link";
import { Metadata } from "next";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const metadata: Metadata = {
  title: "Home | IsmailiPath",
  description: "Discover spiritual knowledge and teachings",
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

type GroupedPosts = {
  [category: string]: PageObjectResponse[];
};

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

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">IsmailiPath</h1>
        <p className="text-lg text-gray-600">Discover spiritual knowledge and teachings</p>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedPosts).map(([category, posts]) => {
          // Skip empty categories
          if (posts.length === 0) return null;

          return (
            <section key={category} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
                <Link href={`/categories/${encodeURIComponent(category)}`} className="text-sm text-blue-600 hover:text-blue-800">
                  View all
                </Link>
              </div>

              <div className="space-y-6">
                {posts.map((post) => {
                  const title = (post.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
                  const slug = (post.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text;
                  const date = post.created_time
                    ? new Date(post.created_time).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : null;

                  return (
                    <article key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="text-lg font-medium mb-1">
                        {slug ? (
                          <Link href={`/blog/${slug}`} className="hover:text-blue-600 transition-colors">
                            {title}
                          </Link>
                        ) : (
                          title
                        )}
                      </h3>
                      {date && <p className="text-sm text-gray-500">{date}</p>}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {Object.keys(groupedPosts).length === 0 && (
          <div className="text-center py-12 bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-500 mb-2">No articles found.</p>
            <p className="text-sm text-gray-400">Check back soon for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
