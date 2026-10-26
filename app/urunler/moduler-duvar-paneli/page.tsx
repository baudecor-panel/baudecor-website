import type { Metadata } from "next";
import ModulerPage from "@/components/moduler/ModulerPage";

export const metadata: Metadata = {
  title: "Modularni 3D zidni paneli — 10 modela | Baudecor",
  description: "Reljefni 3D zidni paneli od ABS polimera: PENTA, ZETA, NORM, MABEL, SPLINE, NAVA, SOHO, VAVA, SPACE i GRID. Standardne i RAL boje, tehnička dokumentacija i 3D modeli. Salon u Ulcinju.",
};

export default function ModulerDuvarPaneliPage() {
  return <ModulerPage />;
}
