"use client";

import { ReactNode } from "react";

type LoaderContainerProps = {
  children: ReactNode;
  fullScreen?: boolean;
  withBackground?: boolean;
  className?: string;
};

export default function LoaderContainer({ children, fullScreen = false, withBackground = false, className = "" }: LoaderContainerProps) {
  return (
    <div
      className={`
        flex items-center justify-center
        ${fullScreen ? "fixed inset-0 z-50" : "h-full w-full"}
        ${withBackground ? "bg-white/80 backdrop-blur-sm" : ""}
        ${className}
      `}
    >
      <div className="transform transition-all">{children}</div>
    </div>
  );
}
