"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
  isSidebarOpen: boolean;
  isDesktopSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleDesktopSidebar: () => void;
  closeSidebar: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  isSidebarOpen: false,
  isDesktopSidebarCollapsed: false,
  toggleSidebar: () => {},
  toggleDesktopSidebar: () => {},
  closeSidebar: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export default function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed((prev) => !prev);
    // Store preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("desktopSidebarCollapsed", String(!isDesktopSidebarCollapsed));
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Initialize desktop sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("desktopSidebarCollapsed");
      if (savedState !== null) {
        setIsDesktopSidebarCollapsed(savedState === "true");
      }
    }
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
    };

    const handleComplete = () => {
      setIsNavigating(false);
    };

    window.addEventListener("beforeunload", handleStart);

    // Navigation is complete on first render
    handleComplete();

    return () => {
      window.removeEventListener("beforeunload", handleStart);
    };
  }, []);

  // Reset navigation state when route changes
  useEffect(() => {
    setIsNavigating(false);
    // Close mobile sidebar on navigation
    closeSidebar();
  }, [pathname, searchParams]);

  // Close sidebar when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        isSidebarOpen,
        isDesktopSidebarCollapsed,
        toggleSidebar,
        toggleDesktopSidebar,
        closeSidebar,
      }}
    >
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-[var(--primary)] w-full origin-left animate-[loader_2s_ease-in-out_infinite]"></div>
        </div>
      )}
      {children}
    </NavigationContext.Provider>
  );
}
