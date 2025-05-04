import Link from "next/link";
import MobileSidebarToggle from "./MobileSidebarToggle";
import { fetchCategories } from "../lib/notion";

export default async function Navbar() {
  const categories = await fetchCategories();

  return (
    <nav className="border-b py-4 bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <MobileSidebarToggle categories={categories} />
          <Link href="/" className="font-bold text-xl ml-2 md:ml-0">
            IsmailiPath
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
