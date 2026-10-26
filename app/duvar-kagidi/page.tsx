import type { Metadata } from "next";
import data from "@/data/wallpapers.json";
import type { WpCatalog } from "@/lib/wallpapers";
import Catalog from "@/components/wallpaper/Catalog";

export const metadata: Metadata = {
  title: "Tapete — AdaWall kolekcije | Baudecor",
  description: "Preko 1000 dezena tapeta iz 15 AdaWall kolekcija. Pogledajte dezene na zidu i posjetite naš salon u Ulcinju.",
};

export default function WallpaperPage() {
  return <Catalog data={data as WpCatalog} />;
}
