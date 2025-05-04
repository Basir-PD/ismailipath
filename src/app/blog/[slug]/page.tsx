import { fetchBySlug, fetchPageBlocks, notion } from "@/app/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import hljsPlugin from "@notion-render/hljs-plugin";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = (post as any).properties.Title?.title?.[0]?.plain_text || "Untitled";

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
  const title = (post as any).properties.Title?.title?.[0]?.plain_text || "Untitled";
  const date = post.created_time
    ? new Date(post.created_time).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const renderer = new NotionRenderer({
    client: notion,
  });

  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {date && <p className="text-gray-500">{date}</p>}
        </header>
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
    </main>
  );
}
