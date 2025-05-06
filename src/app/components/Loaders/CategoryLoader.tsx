"use client";

import { useEffect, useState } from "react";

type CategoryLoaderProps = {
  text?: string;
  colors?: string[];
};

export default function CategoryLoader({ text, colors = ["var(--primary)", "var(--secondary)", "#6366F1", "#10B981", "#F59E0B"] }: CategoryLoaderProps) {
  const [dots, setDots] = useState("");
  const [activeColor, setActiveColor] = useState(colors[0]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 300);

    const colorInterval = setInterval(() => {
      setActiveColor((prev) => {
        const currentIndex = colors.indexOf(prev);
        const nextIndex = (currentIndex + 1) % colors.length;
        return colors[nextIndex];
      });
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(colorInterval);
    };
  }, [colors]);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Minimalistic animated dots */}
      <div className="flex space-x-2 my-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: activeColor,
              animationDelay: `${i * 0.15}s`,
              opacity: dots.length > i ? 1 : 0.3,
            }}
          ></div>
        ))}
      </div>

      {/* Simple line loader */}
      <div className="w-24 h-0.5 bg-gray-200 rounded-full my-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((dots.length || 3) / 3) * 100}%`,
            backgroundColor: activeColor,
          }}
        ></div>
      </div>

      {text && (
        <div className="mt-2 text-center text-sm font-medium text-gray-700">
          {text}
          <span className="inline-block w-8">{dots}</span>
        </div>
      )}
    </div>
  );
}
