"use client";

import { useEffect, useState } from "react";

type CategoryLoaderProps = {
  text?: string;
  colors?: string[];
};

export default function CategoryLoader({ text, colors = ["var(--primary)", "var(--secondary)", "#6366F1", "#10B981", "#F59E0B"] }: CategoryLoaderProps) {
  const [dots, setDots] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 300);

    const animationInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % colors.length);
    }, 600);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(animationInterval);
    };
  }, [colors.length]);

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-64 flex flex-wrap justify-center gap-3 mb-5">
        {colors.map((color, index) => {
          const isActive = index === activeIndex;
          const delay = index * 0.1;

          return (
            <div
              key={index}
              className={`relative rounded-lg p-5 shadow-md transform transition-all duration-300 ${isActive ? "scale-110 z-10" : "scale-90"}`}
              style={{
                backgroundColor: color,
                transitionDelay: `${delay}s`,
                opacity: isActive ? 1 : 0.6,
              }}
            >
              {/* Tag content with growing line animation */}
              <div className="flex flex-col space-y-1.5">
                <div className="w-10 h-1.5 bg-white/80 rounded-full"></div>
                <div
                  className="w-16 h-1 bg-white/60 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? "16px" : "8px",
                    opacity: isActive ? 0.6 : 0.4,
                  }}
                ></div>
                <div
                  className="w-6 h-0.5 bg-white/40 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? "6px" : "4px",
                    opacity: isActive ? 0.4 : 0.2,
                  }}
                ></div>
              </div>

              {/* Pulsing dot indicator for active tag */}
              {isActive && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white animate-ping"></div>}
            </div>
          );
        })}
      </div>

      {/* Connecting underline that slides */}
      <div className="relative w-48 h-1 bg-gray-200 rounded-full my-4 overflow-hidden">
        <div
          className="absolute top-0 h-full bg-gradient-to-r from-transparent via-gray-500 to-transparent rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: "30%",
            left: `${(activeIndex / (colors.length - 1)) * 70}%`,
          }}
        ></div>
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
