import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-[var(--primary)] mb-4">Category Not Found</h1>
      <p className="text-gray-600 max-w-md mb-8">The category you&apos;re looking for doesn&apos;t exist or doesn&apos;t have any published articles yet.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/categories" className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors duration-300">
          Browse Categories
        </Link>
        <Link href="/blog" className="px-5 py-2.5 border border-[var(--neutral-300)] rounded-md hover:bg-[var(--neutral-100)] transition-colors duration-300">
          All Articles
        </Link>
      </div>
    </div>
  );
}
