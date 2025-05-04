import { fetchPages } from "./lib/notion";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | IsmailiPath",
  description: "Discover spiritual knowledge and teachings",
};

export default async function Home() {
  const posts = await fetchPages();

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">IsmailiPath</h1>
        <p className="text-lg text-gray-600">Discover spiritual knowledge and teachings</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Latest Articles</h2>

      <div className="space-y-8">
        {posts?.map((post: any) => {
          // Safely access properties with optional chaining
          const title = post.properties.Title?.title?.[0]?.plain_text || "Untitled";
          const slug = post.properties.Slug?.rich_text?.[0]?.plain_text;
          const date = post.created_time
            ? new Date(post.created_time).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null;

          return (
            <article key={post.id} className="border-b pb-6 hover:bg-gray-50 p-4 -mx-4 rounded-lg transition-colors">
              <h3 className="text-xl font-semibold mb-2">
                {slug ? (
                  <Link href={`/blog/${slug}`} className="hover:underline">
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

        {posts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No articles found.</p>
            <p className="text-sm text-gray-400">Check back soon for new content.</p>
          </div>
        )}
      </div>
    </main>
  );
}
