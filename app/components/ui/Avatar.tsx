"use client";

import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const initials = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white/20 to-white/10 font-bold text-white ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={size === "xs" ? "24px" : size === "sm" ? "32px" : size === "md" ? "40px" : size === "lg" ? "64px" : "96px"}
        />
      ) : (
        <span>{initials || <User className="h-1/2 w-1/2" />}</span>
      )}
    </div>
  );
}
