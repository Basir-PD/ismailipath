"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", updateReadingProgress);

    // Call once to initialize
    updateReadingProgress();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  return (
    <div
      className="h-1 bg-[var(--primary)] fixed top-0 left-0 z-50 transition-all duration-100 ease-out"
      style={{ width: `${readingProgress}%` }}
      role="progressbar"
      aria-valuenow={readingProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
