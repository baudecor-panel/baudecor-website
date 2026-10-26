"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/useLang";
import { label, type WpSeries } from "@/lib/wallpapers";
import { COLLECTION_INFO, colorName, seriesName, seriesNum, seriesWord, specRows } from "@/lib/wallpaperInfo";
import { SeriesCard, WpHeader, WpFooter } from "./Catalog";
import s from "./Catalog.module.css";

type Series = WpSeries & { collectionName: string };
type Nav = { id: string; code: string } | null;

export default function SeriesPage({ x, siblings, prev, next }: { x: Series; siblings: Series[]; prev: Nav; next: Nav }) {
  const [lang, setLang] = useLang();
  const L = (me: string, tr: string, en: string) => (lang === "me" ? me : lang === "tr" ? tr : en);
  const [ci, setCi] = useState(0);
  const c = x.colors[ci];
  const colName = x.collectionName.replace(/\s*\|\s*/, " ");
  const no = seriesNum(x.code);
  const cName = colorName(c.name, lang);
  const info = COLLECTION_INFO[x.collection];

  return (
    <div className={s.page}>
      <WpHeader lang={lang} setLang={setLang} crumbs={[
        { href: "/", label: L("Početna", "Ana sayfa", "Home") },
        { href: "/duvar-kagidi", label: L("Tapete", "Duvar Kağıdı", "Wallpaper") },
        { href: `/duvar-kagidi/${x.collection}`, label: colName },
        { label: `${seriesWord(lang)} ${no}` },
      ]} />

      <section className={s.series}>
        <div className={s.seriesStage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={c.code} src={c.img} alt={`${x.code} ${c.code}`} />
          <span className={s.seriesCode}>{c.code}{cName ? ` · ${cName}` : ""}</span>
        </div>

        <div className={s.seriesInfo}>
          <Link href={`/duvar-kagidi/${x.collection}`} className={s.back}>← {colName}</Link>
          <span className={s.cardCol}>{colName} · {seriesWord(lang)}</span>
          <h1>{no}</h1>
          <p className={s.infoTitle}>{seriesName(x, lang)}</p>

          <p className={s.infoLabel}>{L("Boje", "Renkler", "Colours")} · {x.colors.length}</p>
          <div className={s.swatches}>
            {x.colors.map((cc, i) => (
              <button key={cc.code + i} className={i === ci ? s.swOn : ""} onClick={() => setCi(i)} title={cc.code}>
                <span style={{ backgroundImage: `url("${cc.thumb}")` }} />
                <small>{cc.code}{cc.name ? ` · ${colorName(cc.name, lang)}` : ""}</small>
              </button>
            ))}
          </div>

          <dl className={s.tags}>
            {x.styles.length > 0 && <div><dt>{L("Stil", "Stil", "Style")}</dt><dd>{x.styles.map((t) => label(t, lang)).join(", ")}</dd></div>}
            {x.rooms.length > 0 && <div><dt>{L("Prostorije", "Odalar", "Rooms")}</dt><dd>{x.rooms.map((t) => label(t, lang)).join(", ")}</dd></div>}
            {x.repeat && <div><dt>{L("Raport", "Desen tekrarı", "Pattern repeat")}</dt><dd>{label(x.repeat, lang)}</dd></div>}
            {info && specRows(info.specs, lang).filter((_, i) => !info.specs.range || i > 0).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>

          <div className={s.infoBtns}>
            <a href="tel:+38268361700" className={s.btnDark}>{L("Pozovite nas", "Bizi arayın", "Call us")} <span>→</span></a>
            <a href={`https://wa.me/38268361700?text=${encodeURIComponent(`AdaWall ${colName} ${c.code}`)}`} target="_blank" rel="noopener noreferrer" className={s.btnLine}>WhatsApp</a>
          </div>

          <div className={s.pager}>
            {prev ? <Link href={`/duvar-kagidi/${x.collection}/${prev.id}`}>← {prev.code}</Link> : <span />}
            {next ? <Link href={`/duvar-kagidi/${x.collection}/${next.id}`}>{next.code} →</Link> : <span />}
          </div>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className={s.related}>
          <h2>{L("Još iz kolekcije", "Koleksiyondan diğer seriler", "More from the collection")} <em>{colName}</em></h2>
          <div className={s.relatedGrid}>
            {siblings.map((y) => <SeriesCard key={y.id} x={y} lang={lang} />)}
          </div>
        </section>
      )}

      <WpFooter lang={lang} />
    </div>
  );
}
