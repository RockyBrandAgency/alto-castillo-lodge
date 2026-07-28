import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { MarketingCard } from "@/components/ui/MarketingCard";
import { Accordion } from "@/components/ui/Accordion";
import { Tabs } from "@/components/ui/Tabs";
import { Reveal } from "@/components/ui/Reveal";
import manifest from "../../../public/images/manifest.json";

/**
 * Referencia interna del design system — no es una página del sitio
 * público (sin link desde la navegación). Prueba que tokens + componentes
 * portados + fotos reales + Lenis/GSAP funcionan juntos.
 */
export default function DesignSystemPage() {
  const heroPhoto = manifest.exterior[0];
  const suitePhoto = manifest["suite-principal"][0];
  const standardPhoto = manifest.standard[0];
  const experiencePhoto = manifest.exterior[3] ?? manifest.exterior[0];

  return (
    <main>
      <section className={styles.hero}>
        <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority className={styles.heroImage} sizes="100vw" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Referencia interna · Design system</span>
          <h1 className={styles.heroTitle}>Desde la ventana se ve el cerro. No hay descripción que lo mejore.</h1>
        </div>
      </section>

      <div className={styles.wrap}>
        <section className={styles.section}>
          <Reveal>
            <h2>Botones — 07</h2>
            <p className={styles.sectionNote}>
              Primario sólido, secundario con borde, variante sobre fondo oscuro. Rotulado siempre discreto.
            </p>
            <div className={styles.buttonRow}>
              <Button variant="primary">Consultar disponibilidad</Button>
              <Button variant="secondary">Ver temporadas</Button>
              <Button variant="primary" disabled>
                Consultar disponibilidad
              </Button>
            </div>
            <div className={styles.buttonRow}>
              <div className={styles.darkSwatch}>
                <Button variant="dark">Explorar temporadas</Button>
              </div>
            </div>
          </Reveal>
        </section>

        <section className={styles.section}>
          <Reveal>
            <h2>Tarjetas de marketing — 11</h2>
            <p className={styles.sectionNote}>Las 4 variantes del design system, con fotos reales ya procesadas (AVIF/WebP).</p>
            <div className={styles.cardGrid}>
              <MarketingCard variant="photo" image={experiencePhoto} eyebrow="Experiencia" title="Golden Hour Circuit" />
              <MarketingCard
                variant="info"
                eyebrow="Actividad de temporada"
                title="Pesca con mosca"
                text="Temporada oficial de pesca en Chile, octubre a abril. Guía, traslados, bote y almuerzo incluidos."
                ctaLabel="Más información"
                ctaHref="#"
              />
              <MarketingCard
                variant="quote"
                quote="El silencio de la primera mañana fue el regalo más inesperado. No sabía que necesitaba esa quietud hasta que la encontré."
                author="Carolina M."
                date="Enero 2024"
              />
              <MarketingCard
                variant="room"
                image={suitePhoto}
                title="Suite Principal"
                text="45m², cama Super King, baño privado en suite, estufa a leña, vistas panorámicas al Parque Nacional."
                priceLabel="Tarifa: consultar"
                ctaLabel="Ver habitación"
                ctaHref="#"
              />
            </div>
          </Reveal>
        </section>

        <section className={styles.section}>
          <Reveal>
            <h2>Acordeón — 09</h2>
            <p className={styles.sectionNote}>El bloque de FAQ real que pide la estrategia AEO (§7.3 del brief).</p>
            <Accordion
              items={[
                {
                  question: "¿Cómo llego desde Balmaceda?",
                  answer:
                    "72 km en vehículo por camino pavimentado hasta Villa Cerro Castillo, luego un desvío de 3,5 km por el camino ripiado \"Sendero de Chile\" hasta la entrada del lodge.",
                },
                {
                  question: "¿Cuál es la estadía mínima?",
                  answer:
                    "Dos noches. Reservas de una noche tienen un recargo del 40% sobre el Plan Básico, sujeto a autorización de administración.",
                },
                {
                  question: "¿El lodge tiene WiFi?",
                  answer: "No hay WiFi en las cabañas. Hay una chimenea y el cerro.",
                },
              ]}
            />
          </Reveal>
        </section>

        <section className={styles.section}>
          <Reveal>
            <h2>Pestañas — 10</h2>
            <p className={styles.sectionNote}>Minimalistas, sin cajas contenedoras — máximo 5 elementos del mismo nivel.</p>
            <Tabs
              items={[
                {
                  label: "Habitaciones",
                  content: (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h3 style={{ fontSize: "24px", fontStyle: "italic", fontFamily: "var(--font-display)" }}>
                        Refugios construidos con madera local
                      </h3>
                      <MarketingCard
                        variant="room"
                        image={standardPhoto}
                        title="Habitación Standard"
                        text="30m², doble, baño privado, vistas a Cerro Castillo y Valle del Río Ibáñez."
                        priceLabel="Tarifa: consultar"
                        ctaLabel="Ver habitación"
                        ctaHref="#"
                      />
                    </div>
                  ),
                },
                { label: "Experiencias", content: <p className={styles.sectionNote}>Hub de experiencias — Sesión W2.</p> },
                { label: "Temporadas", content: <p className={styles.sectionNote}>Tarifas por temporada — Sesión W2.</p> },
              ]}
            />
          </Reveal>
        </section>

        <section className={styles.section} style={{ borderBottom: "none" }}>
          <h2>Estado del design system</h2>
          <div className={styles.checklist}>
            <span>
              <strong>✓</strong> Tokens reales del Figma (paleta, tipografía, espaciado 8px)
            </span>
            <span>
              <strong>✓</strong> Componentes portados: Button, FormField, Accordion, Tabs, MarketingCard
            </span>
            <span>
              <strong>✓</strong> Lenis + GSAP/ScrollTrigger configurados (prefers-reduced-motion respetado)
            </span>
            <span>
              <strong>✓</strong> 67 fotos reales procesadas — AVIF + WebP, 2 anchos responsive
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
