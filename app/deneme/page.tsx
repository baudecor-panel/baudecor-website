import type { Metadata } from "next";
import PanelShowcase from "@/components/PanelShowcase";

export const metadata: Metadata = {
  title: "Baudecor — 3D Panel Deneme",
  robots: { index: false, follow: false },
};

export default function DenemePage() {
  return <PanelShowcase />;
}
