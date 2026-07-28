import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { ParallaxPlace } from "@/components/home/ParallaxPlace";
import { RoomsPreview } from "@/components/home/RoomsPreview";
import { SignatureExperiences } from "@/components/home/SignatureExperiences";
import { PressAndTestimonials } from "@/components/home/PressAndTestimonials";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import manifest from "../../public/images/manifest.json";

function toCard(src: string) {
  return src.replace("-hero.webp", "-card.webp");
}

export default function Home() {
  return (
    <main>
      <Hero image={manifest.exterior[3]} />

      <Manifesto />

      <ParallaxPlace
        layers={[
          { image: manifest.exterior[2], eyebrow: "El valle", title: "Río Ibáñez y el macizo, sin nadie más" },
          { image: manifest.exterior[4], eyebrow: "El lodge", title: "Tres módulos, madera nativa y vidrio" },
          { image: manifest["living-comun"][1], eyebrow: "El interior", title: "Lana gruesa, fuego, texturas locales" },
        ]}
      />

      <RoomsPreview
        rooms={[
          {
            slug: "suite-principal",
            title: "Suite Principal",
            text: "45m², cama Super King, baño privado en suite, estufa a leña, vistas panorámicas al Parque Nacional.",
            image: { src: toCard(manifest["suite-principal"][0].src), alt: manifest["suite-principal"][0].alt },
            priceLabel: "Desde $300.000 CLP / noche",
          },
          {
            slug: "deluxe-superior",
            title: "Deluxe Superior",
            text: "51m² + terraza de 13m², totalmente independiente, estufa a leña, para dos o tres personas.",
            image: { src: toCard(manifest["deluxe-superior"][0].src), alt: manifest["deluxe-superior"][0].alt },
            priceLabel: "Desde $280.000 CLP / noche",
          },
          {
            slug: "deluxe",
            title: "Habitación Deluxe",
            text: "34m², dos habitaciones conectadas por una terraza escénica compartida, baños privados.",
            image: { src: toCard(manifest.deluxe[0].src), alt: manifest.deluxe[0].alt },
            priceLabel: "Desde $250.000 CLP / noche",
          },
          {
            slug: "standard",
            title: "Habitación Standard",
            text: "Doble, baño privado, vistas a Cerro Castillo y Valle del Río Ibáñez.",
            image: { src: toCard(manifest.standard[0].src), alt: manifest.standard[0].alt },
            priceLabel: "Desde $235.000 CLP / noche",
          },
        ]}
      />

      <SignatureExperiences
        experiences={[
          { eyebrow: "Experiencia", title: "Golden Hour Circuit", image: manifest.exterior[16] },
          { eyebrow: "Experiencia", title: "Wild Wellness", image: manifest.exterior[0] },
          { eyebrow: "Experiencia", title: "Baqueano Fire Cooking", image: manifest["living-comun"][0] },
        ]}
      />

      <PressAndTestimonials />

      <ClosingCTA image={manifest.exterior[17]} />
    </main>
  );
}
