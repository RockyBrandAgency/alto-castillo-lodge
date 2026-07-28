import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RoomHero } from "@/components/room/RoomHero";
import { RoomIntro } from "@/components/room/RoomIntro";
import { RoomGallery } from "@/components/room/RoomGallery";
import { RoomFullWidthPhoto } from "@/components/room/RoomFullWidthPhoto";
import { ROOMS, getRoomBySlug } from "@/data/rooms";

export function generateStaticParams() {
  return ROOMS.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) return {};
  return {
    title: room.title,
    description: room.intro,
  };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  if (!room) notFound();

  return (
    <main>
      <RoomHero title={room.title} tagline={room.tagline} image={room.heroImage} />
      <RoomIntro intro={room.intro} features={room.features} />
      <RoomGallery images={room.galleryImages} />
      <RoomFullWidthPhoto image={room.fullWidthImage} />
    </main>
  );
}
