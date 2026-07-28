import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./ClosingCTA.module.css";

type ClosingCTAProps = {
  image: { src: string; alt: string };
};

/**
 * Cierre (brief §3.8). El motor de reserva real es trabajo de la Sesión W3
 * — nada de calendario inventado acá (regla del brief, §8.6). Mientras
 * tanto el CTA real es WhatsApp, mismo patrón que el sitio actual.
 */
export function ClosingCTA({ image }: ClosingCTAProps) {
  return (
    <section className={styles.section}>
      <div className={styles.imageWrap}>
        <Image src={image.src} alt={image.alt} fill className={styles.image} sizes="100vw" />
      </div>
      <div className={styles.overlay} />
      <Reveal>
        <div className={styles.content}>
          <h2 className={styles.title}>72 km desde Balmaceda. El resto lo hace el silencio.</h2>
          <p className={styles.note}>
            Vuelo de dos horas desde Santiago hasta el aeropuerto de Balmaceda, 72 km pavimentados hasta Villa Cerro
            Castillo y un desvío de 3,5 km por el camino ripiado Sendero de Chile hasta la entrada del lodge.
          </p>
          <div className={styles.actions}>
            <Button variant="dark" href="https://api.whatsapp.com/send/?phone=56972673885">
              Consultar disponibilidad
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
