"use client";

import { useSplitReveal } from "@/lib/motion/useSplitReveal";
import styles from "./Manifesto.module.css";

/** El alma de la marca (§1 corazón de marca), en su propia sección — sin foto, solo el texto respirando. */
export function Manifesto() {
  const ref = useSplitReveal<HTMLParagraphElement>();

  return (
    <section className={styles.section}>
      <p className={styles.text} ref={ref}>
        Un refugio donde la privacidad, la naturaleza y el confort conviven en perfecta armonía. El paisaje es el
        lujo; el lodge es el refugio.
      </p>
    </section>
  );
}
