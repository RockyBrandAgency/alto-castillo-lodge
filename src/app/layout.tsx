import type { Metadata } from "next";
import { Inter, Libre_Baskerville } from "next/font/google";
import ScrollProvider from "@/lib/motion/ScrollProvider";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Alto Castillo Lodge",
    default: "Alto Castillo Lodge — Refugio de Montaña en Cerro Castillo, Patagonia",
  },
  description:
    "Lodge de montaña boutique a los pies del Parque Nacional Cerro Castillo, Aysén, Patagonia chilena. El paisaje es el lujo; el lodge es el refugio.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${libreBaskerville.variable}`}>
      <body>
        <ScrollProvider>
          <Header />
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
