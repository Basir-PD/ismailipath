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

  // Close dropdown when clicking outside
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

  // Close dropdown when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    <div className="relative group" ref={dropdownRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        className={`
          relative px-3 py-2 rounded-md font-medium text-sm
          transition-all duration-200 flex items-center
          ${pathname?.startsWith("/categories") ? "text-[var(--primary)] bg-[var(--primary-light)]/10" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
        `}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)} // Keep click functionality for accessibility
      >
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 8h14M5 16h14" />
          </svg>
          <span>Categories</span>
        </div>
        <svg
          className={`ml-1 h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {pathname?.startsWith("/categories") && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" aria-hidden="true" />}
      </button>

      <div
        className={`
          absolute right-0 mt-1 w-64 rounded-lg shadow-lg overflow-hidden z-10
          transform transition-all duration-300 origin-top-right
          bg-white/95 backdrop-blur-sm border border-[var(--neutral-200)]
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="p-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-1">
            {categories.map((category) => {
              const isActive = pathname === `/categories/${encodeURIComponent(category.name)}`;
              return (
                <Link
                  key={category.id}
                  href={`/categories/${encodeURIComponent(category.name)}`}
                  className={`
                    flex items-center px-3 py-2.5 rounded-md text-sm
                    transition-all duration-200 
                    ${isActive ? "bg-[var(--primary-light)]/15 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                  `}
                >
                  <span className={`flex-shrink-0 w-2 h-2 rounded-full mr-3 ${getColorClass(category.color)}`}></span>
                  <span className="truncate">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
