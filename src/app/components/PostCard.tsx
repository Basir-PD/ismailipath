import Link from "next/link";

type PostCardProps = {
  title: string;
  slug: string;
  date: string | null;
  thumbnailUrl: string | undefined;
  category: string;
  compact?: boolean;
};

export default function PostCard({ title, slug, date, category, compact = false }: PostCardProps) {
  // Check if the post is new (published in the last 7 days)
  const isNewPost = date ? new Date(date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 : false;

  // Format date for display if available
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className={`group transition-all duration-300 flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden border border-gray-100 ${compact ? "h-full" : ""}`}>
      <div className={`p-6 ${compact ? "p-4" : ""}`}>
        <div className="flex justify-between items-center mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary-light)]/10 text-[var(--primary)] ${compact ? "text-xs" : ""}`}>
            {category}
          </span>

          {isNewPost && <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">New</span>}
        </div>

        <Link href={`/blog/${slug}`} className="block group-hover:text-[var(--primary)] transition-colors duration-200">
          <h3 className={`font-semibold mb-2 ${compact ? "text-lg" : "text-xl md:text-2xl mb-3"}`} style={{ fontFamily: "var(--font-cormorant)" }}>
            {title}
          </h3>
        </Link>

        {formattedDate && (
          <p className="text-sm text-gray-500 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </p>
        )}

        {!compact && (
          <div className="mt-4">
            <Link
              href={`/blog/${slug}`}
              className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-light)] flex items-center transition-colors w-fit"
              aria-label={`Read more about ${title}`}
            >
              Read Article
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
