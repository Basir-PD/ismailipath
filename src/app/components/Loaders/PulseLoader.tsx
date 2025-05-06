"use client";

import { useEffect, useState } from "react";

type PulseLoaderProps = {
  primaryColor?: string;
  secondaryColor?: string;
  text?: string;
};

export default function PulseLoader({ primaryColor = "var(--primary)", secondaryColor = "var(--secondary)", text }: PulseLoaderProps) {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 300);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 5;
      });
    }, 150);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Minimalistic spinner */}
      <div className="relative w-10 h-10 mb-3">
        {/* Background circle */}
        <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>

        {/* Animated arc */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            borderWidth: "2px",
            borderColor: `${primaryColor} transparent transparent transparent`,
            borderStyle: "solid",
            transform: `rotate(${progress * 3.6}deg)`,
            transition: "transform 0.15s linear",
          }}
        ></div>

        {/* Center dot with secondary color */}
        <div className="absolute w-2 h-2 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: secondaryColor }}></div>
      </div>

      {text && (
        <div className="text-center text-sm font-medium text-gray-700">
          {text}
          <span className="inline-block w-8">{dots}</span>
        </div>
      )}
    </div>
  );
}
