"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[var(--neutral-200)] py-8 md:py-12">
      <div className="container-wide mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-10">
          <div className="space-y-4 md:max-w-md">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--primary)]" style={{ fontFamily: "var(--font-cormorant)" }}>
              B. Payenda
            </h2>
            <p className="text-sm text-gray-600 max-w-sm">Explore spiritual knowledge and teachings on the Ismaili Path through insightful articles on spirituality, history, and wisdom.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contact@ismailipath.com" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
                    Email
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 md:col-span-1">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Subscribe</h3>
              <p className="text-xs text-gray-600">Get notified about new articles and updates.</p>
              <form className="flex gap-2 mt-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-[var(--neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-transparent"
                  required
                />
                <button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white text-sm px-4 py-2 rounded-md transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--neutral-200)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">© {currentYear} B. Payenda. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-[var(--primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-[var(--primary)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
