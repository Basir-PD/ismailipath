"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id: string;
  name: string;
  color: string;
};

interface SidebarProps {
  categories: Category[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="hidden md:block w-64 bg-white border-r shrink-0 h-[calc(100vh-4rem)] sticky top-16" aria-label="Categories sidebar">
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4 text-gray-700 px-2">Categories</h2>

        <nav className="space-y-1" aria-label="Categories navigation">
          <Link
            href="/"
            className={`block px-2 py-2 rounded-md transition-colors ${isActive("/") && !pathname.startsWith("/categories/") ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100"}`}
            aria-current={isActive("/") && !pathname.startsWith("/categories/") ? "page" : undefined}
            prefetch={true}
          >
            All Articles
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${encodeURIComponent(category.name)}`}
              className={`block px-2 py-2 rounded-md transition-colors ${
                isActive(`/categories/${encodeURIComponent(category.name)}`) ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100"
              }`}
              aria-current={isActive(`/categories/${encodeURIComponent(category.name)}`) ? "page" : undefined}
              prefetch={true}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
