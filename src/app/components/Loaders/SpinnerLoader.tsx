"use client";

import { useEffect, useState } from "react";

type SpinnerLoaderProps = {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
};

export default function SpinnerLoader({ size = "md", color = "var(--primary)", text }: SpinnerLoaderProps) {
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

  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClass[size]} relative`} style={{ color }}>
        <div className="absolute inset-0 border-t-4 border-r-4 border-b-4 border-l-4 border-current rounded-full opacity-25"></div>
        <div className="absolute inset-0 border-t-4 border-transparent border-current rounded-full animate-spin"></div>
      </div>
      {text && (
        <div className="mt-4 text-center font-medium text-gray-700">
          {text}
          {dots}
        </div>
      )}
    </div>
  );
}
