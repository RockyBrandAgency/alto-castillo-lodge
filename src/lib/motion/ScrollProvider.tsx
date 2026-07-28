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

    // Bug real encontrado en vivo (Sesión W1, /reservar): Lenis calcula el
    // alto scrolleable una sola vez al montar. Páginas cuyo contenido
    // crece después (datos que llegan por fetch, un formulario que se
    // expande) quedaban con scroll "corto" - el final de la página
    // quedaba inalcanzable aunque el DOM sí tuviera más alto. Un
    // ResizeObserver sobre <body> mantiene a Lenis al día con el alto
    // real en todo momento, no solo al cargar.
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
