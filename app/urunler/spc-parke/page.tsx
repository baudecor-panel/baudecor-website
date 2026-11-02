import type { Metadata } from "next";
import SpcPage from "@/components/spc/SpcPage";

export const metadata: Metadata = {
  title: "SPC parket — 7 kolekcija, 71 dezen | Baudecor",
  description: "100% vodootporan SPC parket na klik, u daskama i kao riblja kost. Za podno grijanje, sa integrisanom IXPE podlogom i garancijom do 20 godina. Salon u Ulcinju.",
};

export default function SpcParkePage() {
  return <SpcPage />;
}
