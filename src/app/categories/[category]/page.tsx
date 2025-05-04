import { fetchPages } from "@/app/lib/notion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type NotionTitle = {
  title: Array<{ plain_text: string }>;
};

type NotionRichText = {
  rich_text: Array<{ plain_text: string }>;
};

type NotionFiles = {
  files: Array<{
    file?: { url: string };
    external?: { url: string };
    name: string;
  }>;
};

// Define the correct params type
type PageProps = {
  params: {
    category: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = decodeURIComponent(params.category);

  return {
    title: `${category} Articles | IsmailiPath`,
    description: `Browse all articles in the ${category} category`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = decodeURIComponent(params.category);
  const posts = await fetchPages(category);

  if (!posts || posts.length === 0) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category}</h1>
        <p className="text-gray-600">Browse all articles in this category</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="divide-y">
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

            // Get thumbnail property
            const thumbnail = (pagePost.properties.Thumbnail as NotionFiles)?.files?.[0];
            const thumbnailUrl = thumbnail?.file?.url || thumbnail?.external?.url;

            return (
              <article key={pagePost.id} className="py-6 first:pt-0 last:pb-0">
                <div className="flex gap-4">
                  {thumbnailUrl && (
                    <div className="flex-shrink-0">
                      <Link href={`/blog/${slug}`} className="block relative w-24 h-24" prefetch={true}>
                        <Image src={thumbnailUrl} alt={`Thumbnail for ${title}`} className="object-cover rounded" fill sizes="96px" />
                      </Link>
                    </div>
                  )}
                  <div className={thumbnailUrl ? "flex-grow" : ""}>
                    <h3 className="text-xl font-semibold mb-2">
                      {slug ? (
                        <Link href={`/blog/${slug}`} className="hover:text-blue-600 transition-colors" prefetch={true}>
                          {title}
                        </Link>
                      ) : (
                        title
                      )}
                    </h3>
                    {date && <p className="text-sm text-gray-500">{date}</p>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
