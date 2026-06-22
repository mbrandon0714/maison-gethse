"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (!visible) setVisible(true);
  }, [visible]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input[type='submit'], .cursor-pointer")) {
        setHovering(true);
      }
    };
    const onOut = () => setHovering(false);

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isMobile]);

  if (isMobile || !visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      animate={{
        x: pos.x - (hovering ? 16 : 6),
        y: pos.y - (hovering ? 16 : 6),
        width: hovering ? 32 : 12,
        height: hovering ? 32 : 12,
      }}
      transition={{ type: "spring", stiffness: 1200, damping: 40, mass: 0.2 }}
      style={{
        borderRadius: "50%",
        background: hovering ? "transparent" : "var(--gold)",
        border: hovering ? "1.5px solid var(--gold)" : "none",
        boxShadow: hovering
          ? "0 0 12px rgba(200,146,42,0.3)"
          : "0 0 6px rgba(200,146,42,0.4)",
        mixBlendMode: "difference" as const,
      }}
    />
  );
}
