import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b py-4">
      <div className="max-w-2xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          IsmailiPath
        </Link>
        <div className="flex gap-4">
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
