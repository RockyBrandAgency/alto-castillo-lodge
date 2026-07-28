import manifest from "../../public/images/manifest.json";

export type RoomFeature = { label: string };

export type RoomData = {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  features: RoomFeature[];
  heroImage: { src: string; alt: string };
  fullWidthImage: { src: string; alt: string };
  galleryImages: { src: string; alt: string }[];
};

function toCard(src: string) {
  return src.replace("-hero.webp", "-card.webp");
}

export const ROOMS: RoomData[] = [
  {
    slug: "suite-principal",
    title: "Suite Principal",
    tagline: "El módulo principal, envuelto en ventanales",
    intro:
      "45m² rodeados de ventanales de piso a techo. La cama Super King mira directo al Cerro Castillo y al valle del Río Ibáñez — el paisaje entra a la habitación sin que haya que buscarlo. Baño privado en suite, estufa a leña para las noches frías.",
    features: [
      { label: "45m²" },
      { label: "Cama Super King" },
      { label: "Baño privado en suite" },
      { label: "Estufa a leña" },
      { label: "Vistas al Parque Nacional" },
    ],
    heroImage: manifest["suite-principal"][0],
    fullWidthImage: manifest["suite-principal"][9],
    galleryImages: manifest["suite-principal"].slice(1, 9).map((img) => ({ src: toCard(img.src), alt: img.alt })),
  },
  {
    slug: "deluxe-superior",
    title: "Deluxe Superior",
    tagline: "Independiente, con terraza propia",
    intro:
      "51m² más una terraza de 13m², en un módulo totalmente independiente del resto del lodge. Pensada para dos o tres personas, con estufa a leña y agua caliente propia. Desde la cama, el macizo llena la ventana — no hace falta levantarse para verlo.",
    features: [
      { label: "51m² + terraza de 13m²" },
      { label: "Módulo independiente" },
      { label: "Estufa a leña" },
      { label: "Agua caliente propia" },
      { label: "2-3 personas" },
    ],
    heroImage: manifest["deluxe-superior"][3],
    fullWidthImage: manifest["deluxe-superior"][0],
    galleryImages: manifest["deluxe-superior"]
      .filter((_, i) => i !== 3 && i !== 0)
      .map((img) => ({ src: toCard(img.src), alt: img.alt })),
  },
  {
    slug: "deluxe",
    title: "Habitación Deluxe",
    tagline: "Dos habitaciones, una terraza compartida",
    intro:
      "Dos habitaciones de 34m² cada una, conectadas por una terraza escénica compartida — ideal para dos parejas o una familia que quiere estar cerca sin compartir habitación. Baños privados, estufa a leña, calentador de agua en cada una.",
    features: [
      { label: "34m² cada habitación" },
      { label: "Terraza escénica compartida" },
      { label: "Baño privado" },
      { label: "Estufa a leña" },
    ],
    heroImage: manifest.deluxe[8],
    fullWidthImage: manifest.deluxe[2],
    galleryImages: manifest.deluxe.filter((_, i) => i !== 8 && i !== 2).map((img) => ({ src: toCard(img.src), alt: img.alt })),
  },
  {
    slug: "standard",
    title: "Habitación Standard",
    tagline: "Lo esencial, con la misma vista",
    intro:
      "Habitación doble con baño privado — la opción más sencilla del lodge, sin dejar de mirar al Cerro Castillo y al valle del Río Ibáñez. Misma calidez, misma vista, un espacio más compacto.",
    features: [{ label: "Doble" }, { label: "Baño privado" }, { label: "Vistas a Cerro Castillo" }],
    heroImage: manifest.standard[0],
    fullWidthImage: manifest.standard[1],
    galleryImages: manifest.standard.map((img) => ({ src: toCard(img.src), alt: img.alt })),
  },
];

export function getRoomBySlug(slug: string) {
  return ROOMS.find((r) => r.slug === slug);
}
