"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./Tabs.module.css";

export type TabEntry = {
  label: string;
  content: ReactNode;
};

/**
 * 10 — Pestañas (Figma): minimalista, sin cajas contenedoras. Reservada
 * para conjuntos de máximo 5 elementos del mismo nivel jerárquico — si hay
 * más, el guideline pide una lista lateral en vez de tabs.
 */
export function Tabs({ items }: { items: TabEntry[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  return (
    <div>
      <div className={styles.list} role="tablist">
        {items.map((item, index) => {
          const isSelected = index === active;
          return (
            <button
              key={item.label}
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${index}`}
              className={styles.tab}
              onClick={() => setActive(index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== active}
          className={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
