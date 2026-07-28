"use client";

import Image from "next/image";
import { useParallax } from "@/lib/motion/useParallax";
import styles from "./ParallaxPlace.module.css";

type Layer = {
  image: { src: string; alt: string };
  eyebrow: string;
  title: string;
};

function ParallaxLayer({ image, eyebrow, title }: Layer) {
  const ref = useParallax<HTMLDivElement>(12);
  return (
    <div className={styles.layer}>
      <div className={styles.imageWrap} ref={ref}>
        <Image src={image.src} alt={image.alt} fill className={styles.image} sizes="100vw" />
      </div>
      <div className={styles.captionOverlay} />
      <div className={styles.caption}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
}

/** "El lugar" (brief §3.3): valle → lodge → interior, profundidad al scroll. */
export function ParallaxPlace({ layers }: { layers: Layer[] }) {
  return (
    <section className={styles.section}>
      {layers.map((layer) => (
        <ParallaxLayer key={layer.title} {...layer} />
      ))}
    </section>
  );
}
