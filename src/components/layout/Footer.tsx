import Link from "next/link";
import { Container } from "@/components/ui/Container";
import styles from "./Footer.module.css";

/** Footer global (brief §2): logo negativo, contacto, IG/Facebook, T&C, crédito. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/alto-castillo-logo-white.svg" alt="Alto Castillo Lodge" className={styles.logo} />

          <div className={styles.col}>
            <span className={styles.colTitle}>Contacto</span>
            <Link href="https://api.whatsapp.com/send/?phone=56972673885" className={styles.link}>
              +56 9 7267 3885
            </Link>
            <Link href="mailto:contacto@altocastillo.cl" className={styles.link}>
              contacto@altocastillo.cl
            </Link>
          </div>

          <div className={styles.col}>
            <span className={styles.colTitle}>Ubicación</span>
            <span className={styles.link}>Villa Cerro Castillo, Río Ibáñez, Aysén, Chile</span>
          </div>

          <div className={styles.col}>
            <span className={styles.colTitle}>Seguir</span>
            <Link href="https://www.instagram.com/altocastillopatagonia/" className={styles.link}>
              Instagram
            </Link>
            <Link href="https://www.facebook.com/profile.php?id=100095549920686" className={styles.link}>
              Facebook
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Alto Castillo Lodge</span>
          <div className={styles.bottomLinks}>
            <Link href="/terminos-y-condiciones">Términos y condiciones</Link>
            <span>Diseñado por RockyBrand</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
