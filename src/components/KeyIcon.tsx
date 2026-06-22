"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";

interface KeyIconProps {
  className?: string;
  size?: number;
  gold?: boolean;
  forceDark?: boolean;
}

export function KeyIcon({ className = "", size = 48, gold = false, forceDark = false }: KeyIconProps) {
  const { theme } = useTheme();
  const isLight = theme === "light" && !forceDark;

  return (
    <Image
      src="/images/mg-key-transparent.png"
      alt="Maison Gethse Key"
      width={size}
      height={size * 2}
      className={className}
      style={{
        objectFit: "contain",
        width: `${size}px`,
        height: "auto",
        filter: gold
          ? "sepia(1) saturate(3) hue-rotate(5deg) brightness(0.85)"
          : isLight
            ? "brightness(0) opacity(0.8)"
            : undefined,
        opacity: gold ? 0.9 : 1,
      }}
    />
  );
}
