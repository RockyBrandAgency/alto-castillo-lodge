import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { RoomFeature } from "@/data/rooms";
import styles from "./RoomIntro.module.css";

type Props = {
  intro: string;
  features: RoomFeature[];
};

export function RoomIntro({ intro, features }: Props) {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <div className={styles.layout}>
            <div>
              <span className={styles.eyebrow}>La habitación</span>
              <p className={styles.introText}>{intro}</p>
            </div>
            <div className={styles.featuresBox}>
              {features.map((f) => (
                <div className={styles.featureRow} key={f.label}>
                  <span className={styles.featureDot} />
                  {f.label}
                </div>
              ))}
              <div className={styles.cta}>
                <Button href="/reservar" variant="primary">
                  Reservar esta habitación
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
