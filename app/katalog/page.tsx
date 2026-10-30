import type { Metadata } from "next";
import KatalogPage from "@/components/katalog/KatalogPage";

export const metadata: Metadata = {
  title: "Katalog — sve kolekcije i tehnička dokumentacija | Baudecor",
  description: "Online katalozi PVC i MDF panela, modularnih i akustičnih panela, tapeta i fleksibilnog kamena. Tehnički listovi i Clayton katalog za preuzimanje. Salon u Ulcinju.",
};

export default function Katalog() {
  return <KatalogPage />;
}
