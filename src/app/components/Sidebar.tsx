"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "./NavigationProvider";
import { useRef, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

interface SidebarProps {
  categories: Category[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen, isDesktopSidebarCollapsed, toggleDesktopSidebar } = useNavigation();
  const [sidebarWidth, setSidebarWidth] = useState(224); // Default width 56*4 = 224px
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      // Set min and max width constraints
      if (newWidth >= 180 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = () => {
    setIsResizing(true);
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          fixed md:sticky
          top-0 md:top-[73px]
          h-screen md:h-[calc(100vh-73px)]
          z-40 md:z-0
          transition-all duration-300 ease-in-out
          bg-white
          border-r border-[var(--neutral-200)]
          overflow-y-auto
          py-6 px-4
          flex flex-col
          ${isDesktopSidebarCollapsed ? "md:w-16 md:px-2" : ""}
        `}
        style={{ width: isDesktopSidebarCollapsed ? undefined : `${sidebarWidth}px` }}
      >
        {/* Desktop sidebar toggle button */}
        <button
          onClick={toggleDesktopSidebar}
          className="hidden md:flex absolute right-2 top-2 p-1.5 rounded-md text-gray-500 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)] transition-colors"
          aria-label={isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            {isDesktopSidebarCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            )}
          </svg>
        </button>

        <div className={`mb-8 ${isDesktopSidebarCollapsed ? "md:mt-6" : ""}`}>
          <div className={`flex items-center justify-between mb-3 ${isDesktopSidebarCollapsed ? "md:justify-center md:px-0" : "px-3"}`}>
            <h3 className={`font-cormorant text-lg font-semibold text-[var(--secondary)] ${isDesktopSidebarCollapsed ? "md:hidden" : ""}`}>Categories</h3>
            <button
              onClick={toggleCategoryDropdown}
              className={`text-gray-500 hover:text-[var(--primary)] transition-colors ${isDesktopSidebarCollapsed ? "md:hidden" : ""}`}
              aria-expanded={categoryDropdownOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDesktopSidebarCollapsed && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden md:block w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </div>
          <nav className={`${categoryDropdownOpen ? "block" : "hidden md:block"}`}>
            <ul className="space-y-1">
              {categories.map((category: Category) => {
                const isActive = pathname?.includes(`/categories/${encodeURIComponent(category.name)}`);
                return (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${encodeURIComponent(category.name)}`}
                      className={`
                        flex items-center px-3 py-2 rounded-md text-sm
                        transition-all duration-200 
                        ${isDesktopSidebarCollapsed ? "md:justify-center md:px-2" : ""}
                        ${isActive ? "bg-[var(--primary-light)]/10 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                      `}
                      title={isDesktopSidebarCollapsed ? category.name : undefined}
                    >
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--secondary-light)] mr-3"></span>
                      <span className={`truncate ${isDesktopSidebarCollapsed ? "md:hidden" : ""}`}>{category.name}</span>
                      {isActive && !isDesktopSidebarCollapsed && <span className="ml-auto w-1 h-5 bg-[var(--primary)]" aria-hidden="true"></span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className={`mb-6 ${isDesktopSidebarCollapsed ? "md:px-0" : "px-3"}`}>
          <h3 className={`font-cormorant text-lg font-semibold text-[var(--secondary)] mb-3 ${isDesktopSidebarCollapsed ? "md:text-center md:hidden" : ""}`}>Quick Links</h3>
          {isDesktopSidebarCollapsed && (
            <div className="hidden md:flex justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            </div>
          )}
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/blog"
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm
                    transition-all duration-200
                    ${isDesktopSidebarCollapsed ? "md:justify-center md:px-2" : ""}
                    ${pathname === "/blog" ? "bg-[var(--primary-light)]/10 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                  `}
                  title={isDesktopSidebarCollapsed ? "All Articles" : undefined}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <span className={`${isDesktopSidebarCollapsed ? "md:hidden" : ""}`}>All Articles</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm
                    transition-all duration-200
                    ${isDesktopSidebarCollapsed ? "md:justify-center md:px-2" : ""}
                    ${pathname === "/about" ? "bg-[var(--primary-light)]/10 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                  `}
                  title={isDesktopSidebarCollapsed ? "About" : undefined}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`${isDesktopSidebarCollapsed ? "md:hidden" : ""}`}>About</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={`mt-auto py-4 ${isDesktopSidebarCollapsed ? "md:hidden" : "px-3"}`}>
          <div className="p-4 bg-[var(--neutral-100)] rounded-lg">
            <h4 className="font-medium text-sm mb-2 text-[var(--foreground)]">Explore Wisdom</h4>
            <p className="text-xs text-gray-600 mb-3">Discover spiritual knowledge and teachings on the Ismaili Path.</p>
            <Link href="/blog" className="text-xs text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors font-medium flex items-center">
              Start Reading
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Resizer */}
        {!isDesktopSidebarCollapsed && <div className="absolute top-0 right-0 h-full w-1 cursor-ew-resize md:hover:bg-[var(--primary)] md:hover:opacity-50" onMouseDown={startResizing} />}
      </aside>
    </>
  );
}
