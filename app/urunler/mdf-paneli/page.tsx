import type { Metadata } from "next";
import MdfPage from "@/components/mdf/MdfPage";

export const metadata: Metadata = {
  title: "MDF zidni paneli — 3 modela, 16 boja | Baudecor",
  description: "Medijapan MDF zidni paneli 18 × 118–121 × 2800 mm: kanalni, talasasti i polukružni modeli u dekorima drveta, jednobojni i patina. Salon u Ulcinju.",
};

export default function MdfPanelPage() {
  return <MdfPage />;
}
