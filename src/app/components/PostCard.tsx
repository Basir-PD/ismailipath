import Link from "next/link";
import Image from "next/image";

type PostCardProps = {
  title: string;
  slug: string;
  date: string | null;
  thumbnailUrl: string | undefined;
  category: string;
};

export default function PostCard({ title, slug, date, thumbnailUrl, category }: PostCardProps) {
  return (
    <article className="card group transition-all duration-300 h-full flex flex-col">
      <Link href={`/blog/${slug}`} className="block flex-grow">
        <div className="aspect-video overflow-hidden relative">
          {thumbnailUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={thumbnailUrl}
                alt={`Thumbnail for ${title}`}
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--primary-light)]/30 to-[var(--secondary-light)]/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--primary)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-[var(--primary)]">{category}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-medium mb-2 group-hover:text-[var(--primary)] transition-colors duration-200" style={{ fontFamily: "var(--font-cormorant)" }}>
            {title}
          </h3>

          {date && (
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {date}
            </p>
          )}
        </div>
      </Link>

      <div className="px-5 pb-5 mt-auto">
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
