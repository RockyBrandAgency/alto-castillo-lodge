import { MarketingCard } from "@/components/ui/MarketingCard";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./PressAndTestimonials.module.css";

/**
 * Prueba social (brief §3.6). Solo la mención de prensa confirmada (sin
 * inventar una cita textual que no tenemos) + 2 testimonios reales, ya
 * públicos en el sitio actual — recortados, no reescritos.
 */
export function PressAndTestimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.press}>
            <span className={styles.pressLabel}>Destacado en</span>
            <span className={styles.pressName}>Condé Nast Traveler — Julio 2026</span>
          </div>
        </Reveal>
        <Reveal>
          <div className={styles.grid}>
            <MarketingCard
              variant="quote"
              quote="Sorprende la vista y cercanía al imponente Cerro Castillo, rodeado de cascadas y bosques milenarios. La calidez de la atención y el buen gusto del lodge, en absoluta armonía con la naturaleza."
              author="José Miguel y Constanza"
              date="Abril 2023 · Chile"
            />
            <MarketingCard
              variant="quote"
              quote="Nos dieron el privilegio de ver huemules camino al lugar, el encanto del río Ibáñez y el Manso, caminar por el faldeo del Cerro Castillo. Sobre todo, la calidez y hospitalidad de Carola y Adrián."
              author="Eduardo y M. Alejandra"
              date="Diciembre 2023 · Argentina"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
