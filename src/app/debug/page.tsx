import { fetchPages } from "../lib/notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type NotionRichText = {
  rich_text: Array<{ plain_text: string }>;
};

type NotionTitle = {
  title: Array<{ plain_text: string }>;
};

export default async function DebugPage() {
  const posts = await fetchPages();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
      <h2 className="text-xl font-semibold mb-4">Blog Posts and Slugs</h2>

      <div className="space-y-4">
        {posts.slice(0, 5).map((post, index) => {
          const pagePost = post as PageObjectResponse;

          const title = (pagePost.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
          const slug = (pagePost.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text || "";

          return (
            <div key={index} className="p-4 bg-gray-100 rounded-lg">
              <p>
                <span className="font-bold">Title:</span> {title}
              </p>
              <p>
                <span className="font-bold">Slug:</span> <code className="px-2 py-1 bg-gray-200 rounded">{slug}</code>
              </p>
              <p>
                <span className="font-bold">Test Links:</span>
              </p>
              <div className="mt-2 space-x-4">
                <a href={`/article/${slug}`} className="text-blue-600 hover:underline" target="_blank">
                  Article Link
                </a>
                <a href={`/blog/${slug}`} className="text-blue-600 hover:underline" target="_blank">
                  Blog Link
                </a>
                <a href={`/test/${slug}`} className="text-blue-600 hover:underline" target="_blank">
                  Test Link
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
