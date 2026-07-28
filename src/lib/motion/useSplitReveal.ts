"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * Manifiesto (brief §3.2): "texto grande que respira, aparición por
 * líneas con ScrollTrigger". Espera a que las fuentes carguen antes de
 * partir el texto en líneas (si no, SplitText mide con la fuente de
 * respaldo y los saltos de línea quedan mal). No hace nada si el
 * visitante pidió prefers-reduced-motion.
 */
export function useSplitReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let split: SplitText | null = null;
    let ctx: gsap.Context | null = null;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled || !el) return;
      ctx = gsap.context(() => {
        split = new SplitText(el, { type: "lines", linesClass: "reveal-line" });
        gsap.set(split.lines, { overflow: "hidden" });
        gsap.from(split.lines, {
          opacity: 0,
          y: 28,
          duration: 1,
          ease: "power2.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      split?.revert();
    };
  }, []);

  return ref;
}

export { ScrollTrigger };
