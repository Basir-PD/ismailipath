import Link from "next/link";
import MobileSidebarToggle from "@/app/components/MobileSidebarToggle";
import ReadingProgressBar from "@/app/components/ReadingProgressBar";
import NavLink from "@/app/components/NavLink";
import CategoryDropdown from "@/app/components/CategoryDropdown";
import { fetchCategories } from "@/app/lib/notion";

export default async function Navbar() {
  const categories = await fetchCategories();

  return (
    <header className="sticky top-0 z-50">
      <ReadingProgressBar />
      <nav className="bg-white/95 backdrop-blur-sm border-b border-[var(--neutral-200)] shadow-sm py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <MobileSidebarToggle />
            <Link href="/" className="group flex items-center">
              <span
                className="text-xl md:text-2xl font-bold text-[var(--primary)] group-hover:text-[var(--primary-light)] transition-colors duration-300"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                B. Payenda
              </span>
              <span className="ml-1 text-xs text-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">• enlightenment</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <CategoryDropdown categories={categories} />
            <NavLink href="/about">About</NavLink>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-[var(--neutral-100)] text-[var(--primary)] transition-colors" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
