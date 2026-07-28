import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./RoomHero.module.css";

type Props = {
  title: string;
  tagline: string;
  image: { src: string; alt: string };
};

export function RoomHero({ title, tagline, image }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <Image src={image.src} alt={image.alt} fill priority className={styles.image} sizes="100vw" />
      </div>
      <div className={styles.overlay} />
      <Container>
        <div className={styles.content}>
          <span className={styles.tagline}>{tagline}</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </Container>
    </section>
  );
}
