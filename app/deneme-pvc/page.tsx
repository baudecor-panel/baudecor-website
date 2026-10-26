import type { Metadata } from "next";
import PvcShowcase from "@/components/PvcShowcase";

export const metadata: Metadata = {
  title: "Baudecor — 3D PVC Panel Deneme",
  robots: { index: false, follow: false },
};

export default function DenemePvcPage() {
  return <PvcShowcase />;
}
