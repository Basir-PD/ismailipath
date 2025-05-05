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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      <ReadingProgressBar />
      <nav className={`bg-white/95 backdrop-blur-sm border-b border-[var(--neutral-200)] py-3 md:py-4 transition-all ${isScrolled ? "md:py-3" : ""}`}>
        <div className="container-wide mx-auto flex justify-between items-center">
          <div className="flex items-center">
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[var(--neutral-200)] shadow-md">
            <div className="container-wide py-4 flex flex-col space-y-3">
              <Link href="/" className="px-4 py-2 rounded-md hover:bg-[var(--neutral-100)] font-medium text-[var(--foreground)]" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/blog" className="px-4 py-2 rounded-md hover:bg-[var(--neutral-100)] font-medium text-[var(--foreground)]" onClick={() => setIsMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/about" className="px-4 py-2 rounded-md hover:bg-[var(--neutral-100)] font-medium text-[var(--foreground)]" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <div className="px-4 py-2">
                <p className="font-medium text-sm text-gray-500 mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${encodeURIComponent(category.name)}`}
                      className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--primary-light)]/10 text-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
