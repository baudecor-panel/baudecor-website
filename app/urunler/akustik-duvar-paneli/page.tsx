import type { Metadata } from "next";
import AkustikPage from "@/components/akustik/AkustikPage";

export const metadata: Metadata = {
  title: "Akustični zidni paneli — Light Oak i Teak, 60 × 280 cm | Baudecor",
  description: "Drvene MDF lamele obložene sa tri strane na fleksibilnom akustičnom filcu (100% PET). Boje Light Oak i Teak, format 60 × 280 cm. Smanjuju odjek u prostoriji. Salon u Ulcinju.",
};

export default function AkustikDuvarPaneliPage() {
  return <AkustikPage />;
}
