"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MOTION } from "./gsap";

/**
 * Aparición por opacidad + desplazamiento corto al entrar en viewport —
 * la animación base del §5 del brief (apariciones de sección, no el reveal
 * por líneas del Manifiesto, que se arma en la Sesión W1 sobre este mismo
 * helper). No hace nada si el visitante pidió prefers-reduced-motion.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: MOTION.revealDistance },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

export { ScrollTrigger };
