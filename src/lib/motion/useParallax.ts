"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Parallax de imagen dentro de un contenedor con overflow:hidden (brief §5:
 * "parallax de imágenes, 10-15% de rango"). `range` es el desplazamiento
 * vertical máximo en % — la imagen debe estar escalada ~120% en CSS para
 * que el movimiento nunca revele un borde vacío.
 */
export function useParallax<T extends HTMLElement>(range = 12) {
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
        { yPercent: -range },
        {
          yPercent: range,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [range]);

  return ref;
}

export { ScrollTrigger };
