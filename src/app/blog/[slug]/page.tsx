import { fetchBySlug, fetchPageBlocks, notion } from "@/app/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionContentRenderer from "@/app/components/NotionContentRenderer";
import ShareButtons from "@/app/components/ShareButtons";
import "@/app/lib/notionBlockStyles.css";
import { Suspense } from "react";
import Image from "next/image";

// Update the params type to be a Promise
type PageParams = {
  slug: string;
};

type ParamsProps = {
  params: Promise<PageParams>;
};

type NotionTitle = {
  title: Array<{ plain_text: string }>;
};

type NotionSelect = {
  select: {
    name: string;
    color: string;
  };
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

// Update to handle async params
export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const pagePost = post as PageObjectResponse;
  const title = (pagePost.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
  const description = (pagePost.properties.Description as NotionRichText)?.rich_text?.[0]?.plain_text || "Explore spiritual knowledge and teachings on the Ismaili Path";

  // Get thumbnail for OG image
  const thumbnail = (pagePost.properties.Thumbnail as NotionFiles)?.files?.[0];
  const thumbnailUrl = thumbnail?.file?.url || thumbnail?.external?.url;

  return {
    title: `${title} | IsmailiPath`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: thumbnailUrl ? [thumbnailUrl] : [],
    },
  };
}

export default async function Page({ params }: ParamsProps) {
  const { slug } = await params;
  const post = await fetchBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = await fetchPageBlocks(post.id);
  const pagePost = post as PageObjectResponse;

  const title = (pagePost.properties.Title as NotionTitle)?.title?.[0]?.plain_text || "Untitled";
  const category = (pagePost.properties.Category as NotionSelect)?.select?.name;
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

  const renderer = new NotionRenderer({
    client: notion,
  });

  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);

  // Estimate read time (average reading speed: 200 words per minute)
  const wordCount = html.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-3xl mx-auto">
      <article className="bg-white rounded-xl shadow-sm overflow-hidden">
        {thumbnailUrl && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            {/* Replace img with Next.js Image component */}
            <div className="relative w-full h-full">
              <Image src={thumbnailUrl} alt={`Thumbnail for ${title}`} fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            <div className="absolute bottom-0 w-full p-6 text-white">
              {category && (
                <Link
                  href={`/categories/${encodeURIComponent(category)}`}
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--primary)] bg-opacity-80 hover:bg-opacity-100 transition-colors mb-3"
                  prefetch={true}
                >
                  {category}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-sm" style={{ fontFamily: "var(--font-cormorant)" }}>
                {title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 md:p-10">
          {/* Show title if no thumbnail */}
          {!thumbnailUrl && (
            <header className="mb-8">
              {category && (
                <Link
                  href={`/categories/${encodeURIComponent(category)}`}
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--primary-light)]/10 text-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-colors mb-3"
                  prefetch={true}
                >
                  {category}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                {title}
              </h1>
            </header>
          )}

          <div className="flex items-center text-sm text-gray-500 mb-8 pb-6 border-b border-[var(--neutral-200)]">
            {date && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {date}
              </span>
            )}

            <span className="mx-3">•</span>

            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              {readTime} min read
            </span>
          </div>

          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none notion-content">
            <Suspense
              fallback={
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              }
            >
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </Suspense>
            <Suspense fallback={null}>
              <NotionContentRenderer />
            </Suspense>
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--neutral-200)]">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Link href="/" className="text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors flex items-center mb-4 md:mb-0">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Home
              </Link>

              <ShareButtons title={title} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
