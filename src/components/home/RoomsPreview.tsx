import { MarketingCard } from "@/components/ui/MarketingCard";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import styles from "./RoomsPreview.module.css";

type Room = {
  slug: string;
  title: string;
  text: string;
  image: { src: string; alt: string };
};

/** Habitaciones — preview (brief §3.4): 4 tarjetas → landings. */
export function RoomsPreview({ rooms }: { rooms: Room[] }) {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <div className={styles.header}>
            <div>
              <span className={styles.eyebrow}>5 habitaciones · 3 módulos</span>
              <h2 className={styles.title}>Cada módulo, su propia vista al cerro</h2>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className={styles.grid}>
            {rooms.map((room) => (
              <MarketingCard
                key={room.slug}
                variant="room"
                image={room.image}
                title={room.title}
                text={room.text}
                priceLabel="Tarifa: consultar"
                ctaLabel="Ver habitación"
                ctaHref={`/habitaciones/${room.slug}`}
              />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
