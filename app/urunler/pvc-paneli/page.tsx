import type { Metadata } from "next";
import PvcPage from "@/components/pvc/PvcPage";

export const metadata: Metadata = {
  title: "PVC zidni paneli sa izgledom mermera | Baudecor",
  description: "18 dezena PVC mermer panela 122 × 280 cm, debljine 2,8 mm. Vodootporni, laki za montažu, sa aluminijumskim profilima. Salon u Ulcinju.",
};

export default function PvcPanelPage() {
  return <PvcPage />;
}
