"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "./NavigationProvider";

type Category = {
  id: string;
  name: string;
};

interface SidebarProps {
  categories: Category[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen } = useNavigation();

  return (
    <aside
      className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        fixed md:sticky
        top-0 md:top-[73px]
        h-screen md:h-[calc(100vh-73px)]
        w-64 md:w-56
        z-40 md:z-0
        transition-transform duration-300 ease-in-out
        bg-white
        border-r border-[var(--neutral-200)]
        overflow-y-auto
        py-6 px-4
      `}
    >
      <div className="mb-8">
        <h3 className="font-cormorant text-lg font-semibold text-[var(--secondary)] mb-3 px-3">Categories</h3>
        <nav>
          <ul className="space-y-1">
            {categories.map((category: Category) => {
              const isActive = pathname?.includes(`/categories/${category.id}`);
              return (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm
                      transition-all duration-200 
                      ${isActive ? "bg-[var(--primary-light)]/10 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                    `}
                  >
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--secondary-light)] mr-3"></span>
                    <span className="truncate">{category.name}</span>
                    {isActive && <span className="ml-auto w-1 h-5 bg-[var(--primary)]" aria-hidden="true"></span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="mb-6 px-3">
        <h3 className="font-cormorant text-lg font-semibold text-[var(--secondary)] mb-3">Quick Links</h3>
        <nav>
          <ul className="space-y-1">
            <li>
              <Link
                href="/blog"
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm
                  transition-all duration-200
                  ${pathname === "/blog" ? "bg-[var(--primary-light)]/10 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                All Articles
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm
                  transition-all duration-200
                  ${pathname === "/about" ? "bg-[var(--primary-light)]/10 text-[var(--primary)] font-medium" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-auto px-3 py-4">
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
    </aside>
  );
}
