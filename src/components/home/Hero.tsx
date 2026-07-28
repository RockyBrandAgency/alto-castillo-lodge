import Image from "next/image";
import styles from "./Hero.module.css";

type HeroProps = {
  image: { src: string; alt: string };
};

/**
 * Hero full-viewport (brief §3.1): escala épica del macizo, lodge diminuto,
 * titular Baskerville sobre degradado. Copy aprobado del guideline.
 */
export function Hero({ image }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <Image src={image.src} alt={image.alt} fill priority className={styles.image} sizes="100vw" />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.eyebrow}>Villa Cerro Castillo · Aysén · Patagonia</span>
        <h1 className={styles.title}>Desde la ventana se ve el cerro. No hay descripción que lo mejore.</h1>
      </div>
      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollCueLine} />
      </div>
    </section>
  );
}
