import { MarketingCard } from "@/components/ui/MarketingCard";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./SignatureExperiences.module.css";

type Experience = {
  eyebrow: string;
  title: string;
  image: { src: string; alt: string };
};

/** Experiencias firma (brief §3.5): layout editorial asimétrico, imagen dominante. */
export function SignatureExperiences({ experiences }: { experiences: Experience[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.header}>
            <span className={styles.eyebrow}>Ritual & experiencia</span>
            <h2 className={styles.title}>Lo que se hace acá, no se hace en cualquier lugar</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className={styles.grid}>
            {experiences.map((exp) => (
              <MarketingCard key={exp.title} variant="photo" image={exp.image} eyebrow={exp.eyebrow} title={exp.title} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
