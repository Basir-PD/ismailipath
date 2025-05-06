"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[var(--neutral-200)] py-6">
      <div className="container-wide mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary)]" style={{ fontFamily: "var(--font-cormorant)" }}>
              B. Payenda
            </h2>
          </div>

          <div className="flex gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
              About
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--neutral-200)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">© {currentYear} B. Payenda. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="mailto:contact@ismailipath.com" className="text-xs text-gray-500 hover:text-[var(--primary)] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
