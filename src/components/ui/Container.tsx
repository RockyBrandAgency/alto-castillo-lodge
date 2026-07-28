import type { ReactNode } from "react";
import styles from "./Container.module.css";

/** Grid centrado de 1250px (--container-width) — un solo lugar para todo el sitio. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[styles.container, className].filter(Boolean).join(" ")}>{children}</div>;
}
