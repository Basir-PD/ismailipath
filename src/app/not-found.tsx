import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-[var(--primary)] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors duration-300">
          Go Home
        </Link>
        <Link href="/" className="px-5 py-2.5 border border-[var(--neutral-300)] rounded-md hover:bg-[var(--neutral-100)] transition-colors duration-300">
          Browse Articles
        </Link>
      </div>
    </div>
  );
}
