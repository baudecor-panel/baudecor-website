import type { Metadata } from "next";
import AkustikPage from "@/components/akustik/AkustikPage";

export const metadata: Metadata = {
  title: "Akustični zidni paneli — 4 boje, 60 × 280 cm | Baudecor",
  description: "Drvene MDF lamele obložene sa tri strane na fleksibilnom akustičnom filcu (100% PET). Boje Light Oak, Teak, bijela i crna, format 60 × 280 cm; za veće narudžbe sve boje iz kataloga. Smanjuju odjek u prostoriji. Salon u Ulcinju.",
};

export default function AkustikDuvarPaneliPage() {
  return <AkustikPage />;
}
