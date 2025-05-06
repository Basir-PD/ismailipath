import { fetchPages } from "@/app/lib/notion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type NotionTitle = {
  title: Array<{ plain_text: string }>;
};

type NotionRichText = {
  rich_text: Array<{ plain_text: string }>;
};

type CategoryParams = {
  category: string;
};

type ParamsProps = {
  params: Promise<CategoryParams>;
};

// Define the correct params type
export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { category } = await params;

  return {
    title: `${category} Articles | B. Payenda`,
    description: `Browse all articles in the ${category} category`,
  };
}

export default async function CategoryPage({ params }: ParamsProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = await fetchPages(decodedCategory);

  if (!posts || posts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-[var(--primary-light)]/10 text-[var(--primary)] rounded-md mb-3">Category</span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          {category}
        </h1>
        <div className="w-20 h-1 bg-[var(--primary)] mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">Browse all articles in this category</p>
      </div>

      <div className="space-y-6">
        {posts?.map((post) => {
          const pagePost = post as PageObjectResponse;

          const title = (pagePost.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
          const slug = (pagePost.properties.Slug as NotionRichText)?.rich_text?.[0]?.plain_text;
          const date = pagePost.created_time
            ? new Date(pagePost.created_time).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null;

          return (
            <article key={pagePost.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {date}
                </span>
                <span className="bg-[var(--primary-light)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full text-xs">{category}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 group" style={{ fontFamily: "var(--font-cormorant)" }}>
                <Link href={`/blog/${slug}`} className="hover:text-[var(--primary)] transition-colors duration-200" prefetch={true}>
                  {title}
                </Link>
              </h3>

              <div className="mt-4 flex">
                <Link
                  href={`/blog/${slug}`}
                  className="inline-flex items-center text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors group"
                  prefetch={true}
                >
                  Read Article
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
