"use client";

import { useEffect, useState } from "react";

type PulseLoaderProps = {
  primaryColor?: string;
  secondaryColor?: string;
  text?: string;
};

export default function PulseLoader({ primaryColor = "var(--primary)", secondaryColor = "var(--secondary)", text }: PulseLoaderProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-24 h-32">
        {/* Book/paper background */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-md transform translate-x-1 translate-y-1"></div>

        {/* Main page with pulse effect */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-start p-3">
            {/* Lines of text with pulse animation */}
            <div className="h-2 w-3/4 rounded bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-2 w-full rounded bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-2 w-2/3 rounded bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-2 w-5/6 rounded bg-gray-200 animate-pulse mb-2"></div>
            <div className="h-2 w-4/5 rounded bg-gray-200 animate-pulse mb-2"></div>

            {/* Bookmark with primary color */}
            <div className="absolute -right-1 top-0 w-6 h-12 rounded-b-lg" style={{ backgroundColor: primaryColor }}></div>
          </div>
        </div>

        {/* Animated page corner fold */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gray-100" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}>
          <div
            className="absolute top-0 right-0 w-8 h-8 animate-pulse"
            style={{
              clipPath: "polygon(100% 0, 75% 0, 100% 25%)",
              backgroundColor: secondaryColor,
            }}
          ></div>
        </div>
      </div>

      {text && (
        <div className="mt-6 text-center font-medium text-gray-700">
          {text}
          {dots}
        </div>
      )}
    </div>
  );
}
