"use client";

import { createContext, useContext, useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

const LenisContext = createContext<{
  stop: () => void;
  start: () => void;
}>({ stop: () => {}, start: () => {} });

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  return (
    <LenisContext.Provider value={{ stop, start }}>
      {children}
    </LenisContext.Provider>
  );
}
