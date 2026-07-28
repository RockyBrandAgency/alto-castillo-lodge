"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll global. Principio del brief (§5): motion al servicio de la
 * contemplación, nunca del espectáculo — easing largo, sin rebotes.
 * Desactivado por completo si el visitante pidió prefers-reduced-motion:
 * el scroll queda nativo, no una versión "más lenta" de lo mismo.
 */
export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
