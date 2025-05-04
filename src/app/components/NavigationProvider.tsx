"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface NavigationContextType {
  isNavigating: boolean;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
});

export const useNavigation = () => useContext(NavigationContext);

export default function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

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
  }, [pathname, searchParams]);

  return (
    <NavigationContext.Provider value={{ isNavigating }}>
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-blue-500 w-full origin-left animate-[loader_2s_ease-in-out_infinite]"></div>
        </div>
      )}
      {children}
    </NavigationContext.Provider>
  );
}
