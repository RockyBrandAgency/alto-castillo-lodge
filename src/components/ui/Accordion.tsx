"use client";

import { useId, useState } from "react";
import styles from "./Accordion.module.css";

export type AccordionEntry = {
  question: string;
  answer: string;
};

/**
 * 09 — Acordeones (Figma). Cubre el bloque de FAQ real que pide la
 * estrategia AEO del brief (§7.3) — respuestas citables por un motor de
 * respuesta, no solo un adorno visual.
 */
export function Accordion({ items }: { items: AccordionEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const triggerId = `${baseId}-trigger-${index}`;
        return (
          <div className={styles.item} key={item.question}>
            <button
              id={triggerId}
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.question}</span>
              <span className={styles.chevron} aria-hidden="true">
                ›
              </span>
            </button>
            <div className={styles.panel} data-open={isOpen}>
              <div className={styles.panelInner}>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={styles.content}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
