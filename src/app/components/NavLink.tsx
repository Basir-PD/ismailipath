"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
};

export default function NavLink({ href, children, className = "", exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : href !== "/" && pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        relative px-3 py-2 rounded-md font-medium text-sm
        transition-all duration-200
        ${isActive ? "text-[var(--primary)] bg-[var(--primary-light)]/10" : "text-gray-600 hover:text-[var(--primary)] hover:bg-[var(--neutral-100)]"}
        ${className}
      `}
    >
      {children}
      {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" aria-hidden="true" />}
    </Link>
  );
}
