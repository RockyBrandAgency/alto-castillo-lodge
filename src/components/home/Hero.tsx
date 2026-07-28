import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./Hero.module.css";

type HeroProps = {
  image: { src: string; alt: string };
};

/**
 * Hero full-viewport (brief §3.1): escala épica del macizo, lodge diminuto,
 * titular Baskerville sobre degradado. El texto vive dentro del mismo
 * grid de 1250px que el resto del sitio, no pegado al borde del viewport.
 */
export function Hero({ image }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <Image src={image.src} alt={image.alt} fill priority className={styles.image} sizes="100vw" />
      </div>
      <div className={styles.overlay} />
      <div className={styles.contentRow}>
        <Container>
          <div className={styles.content}>
            <span className={styles.eyebrow}>Villa Cerro Castillo · Aysén · Patagonia</span>
            <h1 className={styles.title}>Desde la ventana se ve el cerro. No hay descripción que lo mejore.</h1>
          </div>
        </Container>
      </div>
      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollCueLine} />
      </div>
    </section>
  );
}
