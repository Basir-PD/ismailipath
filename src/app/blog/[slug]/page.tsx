import { fetchBySlug, fetchPageBlocks, notion } from "@/app/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionContentRenderer from "@/app/components/NotionContentRenderer";
import "@/app/lib/notionBlockStyles.css";
import { Suspense } from "react";

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBySlug(params.slug);

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

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await fetchBySlug(params.slug);

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
            <img src={thumbnailUrl} alt={`Thumbnail for ${title}`} className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
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

              <div className="flex space-x-4">
                <button
                  className="flex items-center text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
                  aria-label="Share on Twitter"
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button
                  className="flex items-center text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
                  aria-label="Share on Facebook"
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className="flex items-center text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
                  aria-label="Copy Link"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => {
                        alert("Link copied to clipboard!");
                      })
                      .catch((err) => {
                        console.error("Could not copy link: ", err);
                      });
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
