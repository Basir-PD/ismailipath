"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id: string;
  name: string;
  color?: string;
};

export default function CategoryDropdown({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getColorClass = (color?: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      yellow: "bg-yellow-100 text-yellow-800",
      purple: "bg-purple-100 text-purple-800",
      pink: "bg-pink-100 text-pink-800",
      orange: "bg-orange-100 text-orange-800",
      gray: "bg-gray-100 text-gray-800",
      brown: "bg-amber-100 text-amber-800",
      default: "bg-[var(--primary-light)]/10 text-[var(--primary)]",
    };

    return colorMap[color || "default"] || colorMap.default;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative px-3 py-2 rounded-md font-medium text-sm
          transition-all duration-200 flex items-center
          ${pathname?.startsWith("/categories") ? "text-[var(--primary)] bg-[var(--primary-light)]/10" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
        `}
      >
        Categories
        <svg className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {pathname?.startsWith("/categories") && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white border border-[var(--neutral-200)] overflow-hidden z-10">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-[var(--neutral-100)]">
              <h3 className="font-medium text-sm text-[var(--foreground)]">Browse Categories</h3>
            </div>
            <Link href="/categories" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[var(--neutral-100)] transition-colors" onClick={() => setIsOpen(false)}>
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--secondary)] mr-3"></span>
              All Categories
            </Link>
            <div className="px-3 py-2 max-h-80 overflow-y-auto">
              {categories.map((category) => {
                const isActive = pathname === `/categories/${encodeURIComponent(category.name)}`;
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${encodeURIComponent(category.name)}`}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm mb-1 last:mb-0
                      transition-all duration-200 
                      ${isActive ? "bg-[var(--primary-light)]/10 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={`flex-shrink-0 w-2 h-2 rounded-full mr-3 ${getColorClass(category.color)}`}></span>
                    <span className="truncate">{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
