import Link from "next/link";

type PostCardProps = {
  title: string;
  slug: string;
  date: string | null;
  thumbnailUrl: string | undefined;
  category: string;
};

export default function PostCard({ title, slug, date, category }: PostCardProps) {
  return (
    <article className="card group transition-all duration-300 h-full flex flex-col">
      <div className="p-5">
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--primary-light)]/10 text-[var(--primary)]">{category}</span>
        </div>

        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-medium mb-3 group-hover:text-[var(--primary)] transition-colors duration-200" style={{ fontFamily: "var(--font-cormorant)" }}>
            {title}
          </h3>
        </Link>

        {date && (
          <p className="text-sm text-gray-500 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </p>
        )}
      </div>

      <div className="px-5 pb-5 mt-auto border-t border-gray-100 pt-3">
        <Link href={`/blog/${slug}`} className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-light)] flex items-center transition-colors">
          Read Article
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
