"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./Header.module.css";

/** Header transparente sobre el hero → sólido al scroll (brief §2), con el CTA persistente "Reservar". */
export function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${solid ? styles.headerSolid : ""}`}>
      <Container>
        <div className={styles.row}>
          <Link href="/" className={styles.wordmark}>
            Alto Castillo
          </Link>
          <nav className={styles.nav}>
            <Link href="/#habitaciones" className={styles.navLink}>
              Habitaciones
            </Link>
            <Link href="/#experiencias" className={styles.navLink}>
              Experiencias
            </Link>
            <Button href="/reservar" variant={solid ? "primary" : "dark"}>
              Reservar
            </Button>
          </nav>
        </div>
      </Container>
    </header>
  );
}
