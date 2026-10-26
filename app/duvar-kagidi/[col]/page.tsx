import type { Metadata } from "next";
import { notFound } from "next/navigation";
import data from "@/data/wallpapers.json";
import type { WpCatalog } from "@/lib/wallpapers";
import CollectionPage from "@/components/wallpaper/CollectionPage";

const catalog = data as WpCatalog;
const find = (id: string) => {
  const c = catalog.collections.find((v) => v.id === id);
  return c && { ...c, series: c.series.map((x) => ({ ...x, collectionName: c.name })) };
};

export function generateStaticParams() {
  return catalog.collections.map((c) => ({ col: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ col: string }> }): Promise<Metadata> {
  const c = find((await params).col);
  if (!c) return {};
  return {
    title: `${c.name} — AdaWall tapete | Baudecor`,
    description: `AdaWall ${c.name}: ${c.series.length} serija tapeta. Pogledajte sve dezene u našem salonu u Ulcinju.`,
  };
}

export default async function Page({ params }: { params: Promise<{ col: string }> }) {
  const c = find((await params).col);
  if (!c) notFound();
  return <CollectionPage col={c} />;
}
