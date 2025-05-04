"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id: string;
  name: string;
  color: string;
};

interface MobileSidebarToggleProps {
  categories: Category[];
}

export default function MobileSidebarToggle({ categories }: MobileSidebarToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Main menu"
      >
        <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
        {/* Hamburger icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} aria-hidden="true"></div>

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Categories sidebar">
            <div className="px-4 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" id="mobile-menu-heading">
                  Categories
                </h2>
                <button type="button" onClick={() => setIsOpen(false)} className="p-2 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Close menu">
                  <span className="sr-only">Close menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="mt-5 space-y-1" aria-labelledby="mobile-menu-heading">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/") && !pathname.startsWith("/categories/") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-current={isActive("/") && !pathname.startsWith("/categories/") ? "page" : undefined}
                >
                  All Articles
                </Link>

                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${encodeURIComponent(category.name)}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(`/categories/${encodeURIComponent(category.name)}`) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-current={isActive(`/categories/${encodeURIComponent(category.name)}`) ? "page" : undefined}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
