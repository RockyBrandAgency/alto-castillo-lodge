"use client";

import Image from "next/image";
import { useParallax } from "@/lib/motion/useParallax";
import styles from "./RoomFullWidthPhoto.module.css";

export function RoomFullWidthPhoto({ image }: { image: { src: string; alt: string } }) {
  const ref = useParallax<HTMLDivElement>(10);
  return (
    <section className={styles.section}>
      <div className={styles.imageWrap} ref={ref}>
        <Image src={image.src} alt={image.alt} fill className={styles.image} sizes="100vw" />
      </div>
    </section>
  );
}
