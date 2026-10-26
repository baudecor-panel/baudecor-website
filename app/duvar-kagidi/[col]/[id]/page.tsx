import type { Metadata } from "next";
import { notFound } from "next/navigation";
import data from "@/data/wallpapers.json";
import type { WpCatalog } from "@/lib/wallpapers";
import { seriesName, seriesNum } from "@/lib/wallpaperInfo";
import SeriesPage from "@/components/wallpaper/SeriesPage";

const catalog = data as WpCatalog;
const all = catalog.collections.flatMap((c) => c.series.map((x) => ({ ...x, collectionName: c.name })));

export function generateStaticParams() {
  return all.map((x) => ({ col: x.collection, id: x.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ col: string; id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const x = all.find((v) => v.id === id);
  if (!x) return {};
  return {
    title: `${x.collectionName} ${seriesNum(x.code)} — ${seriesName(x, "me")} | Tapete Baudecor`,
    description: `AdaWall ${x.collectionName}, serija ${seriesNum(x.code)}: ${seriesName(x, "me")} · ${x.colors.length} boja. Pogledajte u našem salonu u Ulcinju.`,
  };
}

export default async function Page({ params }: { params: Promise<{ col: string; id: string }> }) {
  const { col, id } = await params;
  const list = all.filter((v) => v.collection === col);
  const i = list.findIndex((v) => v.id === id);
  if (i < 0) notFound();
  const x = list[i];
  const siblings = list.filter((v) => v.id !== x.id).slice(0, 4);
  const prev = list[i - 1] ? { id: list[i - 1].id, code: seriesNum(list[i - 1].code) } : null;
  const next = list[i + 1] ? { id: list[i + 1].id, code: seriesNum(list[i + 1].code) } : null;
  return <SeriesPage x={x} siblings={siblings} prev={prev} next={next} />;
}
