"use client";

import { useVisitorOrigin } from "@/lib/useVisitorOrigin";
import styles from "./FlightRouteSuggestion.module.css";

/**
 * Sugerencia de cómo llegar según el país del visitante (detectado por
 * IP). Solo geografía real (Santiago SCL es el hub internacional de
 * Chile, Balmaceda BBA es el aeropuerto real del brief) — nunca se
 * inventan aerolíneas, horarios ni precios de vuelos que no tenemos.
 */
export function FlightRouteSuggestion() {
  const origin = useVisitorOrigin();
  if (!origin) return null;

  const message =
    origin.countryCode === "CL" ? (
      <>
        Nos visitás desde <strong>Chile</strong>. La ruta más directa es volar a{" "}
        <strong>Balmaceda (BBA)</strong> — desde ahí son 72 km hasta el lodge.
      </>
    ) : origin.continent === "SA" ? (
      <>
        Nos visitás desde <strong>{origin.countryName}</strong>. La ruta más simple suele ser conectar en{" "}
        <strong>Santiago (SCL)</strong> y de ahí tomar un vuelo doméstico a <strong>Balmaceda (BBA)</strong>, a 72 km
        del lodge.
      </>
    ) : (
      <>
        Nos visitás desde <strong>{origin.countryName}</strong>. La mayoría de las conexiones internacionales llegan
        a <strong>Santiago (SCL)</strong> — desde ahí, un vuelo doméstico te deja en <strong>Balmaceda (BBA)</strong>,
        a 72 km del lodge.
      </>
    );

  return (
    <div className={styles.box}>
      <span className={styles.icon} aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 16l20-8-8 20-3-8-8-3 -1-1Z" />
        </svg>
      </span>
      <span className={styles.text}>
        {message}
        <span className={styles.small}>Sugerencia orientativa según tu ubicación — no reemplaza cotizar tu vuelo.</span>
      </span>
    </div>
  );
}
