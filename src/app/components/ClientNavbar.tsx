"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MobileSidebarToggle from "@/app/components/MobileSidebarToggle";
import ReadingProgressBar from "@/app/components/ReadingProgressBar";
import NavLink from "@/app/components/NavLink";
import CategoryDropdown from "@/app/components/CategoryDropdown";

interface Category {
  id: string;
  name: string;
}

interface ClientNavbarProps {
  categories: Category[];
}

export default function ClientNavbar({ categories }: ClientNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      <ReadingProgressBar />
      <nav className={`bg-white/95 backdrop-blur-sm border-b border-[var(--neutral-200)] py-3 md:py-4 transition-all ${isScrolled ? "md:py-3" : ""}`}>
        <div className="container-wide mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <MobileSidebarToggle />
            </div>
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

          {/* Desktop Navigation */}
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

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-[var(--neutral-100)] text-[var(--primary)] transition-colors"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[calc(100%_-_1px)] bg-white/95 backdrop-blur-sm z-50 transition-all overflow-y-auto animate-slideIn">
            <div className="container-wide py-6 px-4 flex flex-col space-y-5">
              <Link
                href="/"
                className="text-lg px-4 py-3 rounded-lg hover:bg-[var(--neutral-100)] font-medium text-[var(--foreground)] transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Home
              </Link>
              <Link
                href="/blog"
                className="text-lg px-4 py-3 rounded-lg hover:bg-[var(--neutral-100)] font-medium text-[var(--foreground)] transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Blog
              </Link>
              <Link
                href="/about"
                className="text-lg px-4 py-3 rounded-lg hover:bg-[var(--neutral-100)] font-medium text-[var(--foreground)] transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                About
              </Link>
              <div className="px-4 py-3">
                <p className="font-medium text-lg text-gray-700 mb-3">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${encodeURIComponent(category.name)}`}
                      className="inline-block px-4 py-2 text-sm font-medium rounded-md bg-[var(--primary-light)]/10 text-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <button className="mt-6 mx-4 py-4 text-center rounded-md bg-[var(--neutral-100)] text-[var(--foreground)]" onClick={() => setIsMobileMenuOpen(false)}>
                Close Menu
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
