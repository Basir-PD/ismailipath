"use client";

import { useNavigation } from "./NavigationProvider";

export default function MobileSidebarToggle() {
  const { isSidebarOpen, toggleSidebar } = useNavigation();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={toggleSidebar} aria-hidden="true" />}

      {/* Toggle button */}
      <button
        type="button"
        className="md:hidden p-2 mr-2 rounded-md text-[var(--primary)] hover:bg-[var(--neutral-100)] transition-colors"
        onClick={toggleSidebar}
        aria-expanded={isSidebarOpen}
        aria-controls="mobile-sidebar"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>
    </>
  );
}
