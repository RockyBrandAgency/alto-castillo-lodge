"use client";

import type { ReactNode } from "react";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";

/** Envoltorio client-only para demostrar el helper de GSAP/ScrollTrigger del §5. */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRevealOnScroll<HTMLDivElement>();
  return <div ref={ref}>{children}</div>;
}
