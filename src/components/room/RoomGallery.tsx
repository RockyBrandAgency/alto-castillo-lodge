import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./RoomGallery.module.css";

export function RoomGallery({ images }: { images: { src: string; alt: string }[] }) {
  if (images.length === 0) return null;
  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <div className={styles.grid}>
            {images.map((img) => (
              <div className={styles.item} key={img.src}>
                <Image src={img.src} alt={img.alt} fill className={styles.image} sizes="(max-width: 720px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
