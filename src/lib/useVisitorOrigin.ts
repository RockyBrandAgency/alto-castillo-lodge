"use client";

import { useEffect, useState } from "react";

type VisitorOrigin = {
  countryCode: string;
  countryName: string;
  continent: string;
};

/**
 * Geolocalización por IP (ipwho.is, gratis, sin key) para sugerir cómo
 * llegar al lodge según de dónde nos visitan. Nunca bloquea nada si falla
 * o tarda — es una mejora cosmética, no un dato crítico del formulario.
 * No guarda ni envía esta info a ningún lado, solo se usa para elegir qué
 * texto mostrar en esta página.
 */
export function useVisitorOrigin() {
  const [origin, setOrigin] = useState<VisitorOrigin | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success) return;
        setOrigin({ countryCode: data.country_code, countryName: data.country, continent: data.continent_code });
      })
      .catch(() => {
        /* silencioso a propósito - nunca bloquea el formulario */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return origin;
}
