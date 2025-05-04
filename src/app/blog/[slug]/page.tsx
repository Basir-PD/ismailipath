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

  return {
    title: `${title} | IsmailiPath`,
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

  return (
    <div>
      <article className="bg-white p-6 rounded-lg shadow-sm">
        <header className="mb-8 pb-6 border-b">
          <h1 className="text-3xl font-bold mb-3">{title}</h1>
          <div className="flex items-center gap-3">
            {category && (
              <Link href={`/categories/${encodeURIComponent(category)}`} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors" prefetch={true}>
                {category}
              </Link>
            )}
            {date && <p className="text-sm text-gray-500">{date}</p>}
          </div>
        </header>

        {thumbnailUrl && (
          <div className="mb-6">
            <img src={thumbnailUrl} alt={`Thumbnail for ${title}`} className="w-full h-auto rounded-md shadow-sm" loading="eager" fetchPriority="high" />
          </div>
        )}

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
      </article>
    </div>
  );
}
