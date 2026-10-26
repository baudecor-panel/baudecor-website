"use client";

import Link from "next/link";
import { useLang } from "@/lib/useLang";
import type { WpSeries } from "@/lib/wallpapers";
import { SeriesCard, WpHeader, WpFooter } from "./Catalog";
import s from "./Catalog.module.css";

type Col = { id: string; name: string; series: (WpSeries & { collectionName: string })[] };

export default function CollectionPage({ col }: { col: Col }) {
  const [lang, setLang] = useLang();
  const L = (me: string, tr: string, en: string) => (lang === "me" ? me : lang === "tr" ? tr : en);
  const name = col.name.replace(/\s*\|\s*/, " ");
  const colors = col.series.reduce((a, x) => a + x.colors.length, 0);

  return (
    <div className={s.page}>
      <WpHeader lang={lang} setLang={setLang} crumbs={[
        { href: "/", label: L("Početna", "Ana sayfa", "Home") },
        { href: "/duvar-kagidi", label: L("Tapete", "Duvar Kağıdı", "Wallpaper") },
        { label: name },
      ]} />

      <section className={s.hero}>
        <Link href="/duvar-kagidi" className={s.back}>← {L("Sve kolekcije", "Tüm koleksiyonlar", "All collections")}</Link>
        <p className={s.kicker}>AdaWall · {L("kolekcija", "koleksiyon", "collection")}</p>
        <h1 className={s.title}>{name}</h1>
        <p className={s.lead}>
          {L(`${col.series.length} serija i ${colors} dezena. Izaberite seriju i pogledajte sve boje.`,
            `${col.series.length} seri ve ${colors} desen. Bir seri seçin, tüm renklerini görün.`,
            `${col.series.length} series and ${colors} designs. Pick a series to see all its colours.`)}
        </p>
      </section>

      <section className={s.grid}>
        {col.series.map((x) => <SeriesCard key={x.id} x={x} lang={lang} />)}
      </section>

      <WpFooter lang={lang} />
    </div>
  );
}
