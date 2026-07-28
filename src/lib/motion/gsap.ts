import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Configuración compartida de easing/duración para toda animación GSAP del
 * sitio — principio del brief (§5): easings largos (power2.out, 1–1.4s),
 * nada de bounce/spin/efectos de template.
 */
export const MOTION = {
  ease: "power2.out",
  duration: 1.2,
  revealDistance: 32, // px — dentro del rango 30-40px que pide el brief
};

export { gsap, ScrollTrigger };
