import Link from "next/link";

type CategoryHeaderProps = {
  title: string;
  count: number;
};

export default function CategoryHeader({ title, count }: CategoryHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--neutral-200)]">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-[var(--primary-light)]/10 flex items-center justify-center mr-3" aria-hidden="true">
          <span className="text-lg font-semibold text-[var(--primary)]" style={{ fontFamily: "var(--font-cormorant)" }}>
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: "var(--font-cormorant)" }}>
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            {count} {count === 1 ? "article" : "articles"}
          </p>
        </div>
      </div>
      <Link href={`/categories/${encodeURIComponent(title)}`} className="text-sm text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors flex items-center">
        View all
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
