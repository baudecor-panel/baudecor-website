"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import { FEATURED, type WpCatalog, type WpCollection, type WpSeries } from "@/lib/wallpapers";
import { seriesName, seriesNum, seriesWord } from "@/lib/wallpaperInfo";
import s from "./Catalog.module.css";

const LANGS: { code: Lang; label: string }[] = [{ code: "me", label: "ME" }, { code: "en", label: "EN" }, { code: "tr", label: "TR" }];

/* Katalog ve seri sayfalarının ortak üst çubuğu */
export function WpHeader({ lang, setLang, crumbs }: { lang: Lang; setLang: (l: Lang) => void; crumbs: { href?: string; label: string }[] }) {
  return (
    <header className={s.top}>
      <Link href="/" aria-label="Baudecor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Baudecor" className={s.logo} />
      </Link>
      <nav className={s.crumbs}>
        {crumbs.map((c, i) => (
          <span key={i} className={s.crumb}>
            {i > 0 && <span>/</span>}
            {c.href ? <Link href={c.href}>{c.label}</Link> : <b>{c.label}</b>}
          </span>
        ))}
      </nav>
      <div className={s.topRight}>
        <div className={s.langs}>
          {LANGS.map((l) => <button key={l.code} className={lang === l.code ? s.on : ""} onClick={() => setLang(l.code)}>{l.label}</button>)}
        </div>
        <a href="tel:+38268361700" className={s.tel}>+382 68 361 700</a>
      </div>
    </header>
  );
}

export function WpFooter({ lang }: { lang: Lang }) {
  const L = (me: string, tr: string, en: string) => (lang === "me" ? me : lang === "tr" ? tr : en);
  return (
    <footer className={s.foot}>
      <p>{L("Dezeni i fotografije: AdaWall. Dostupnost i cijene provjerite u našem salonu.", "Desenler ve fotoğraflar: AdaWall. Stok ve fiyat için showroom'umuza danışın.", "Designs and photos: AdaWall. Ask our showroom for availability and prices.")}</p>
      <p>© 2026 Baudecor · Bratica bb, Ulcinj · <a href="tel:+38268361700">+382 68 361 700</a></p>
    </footer>
  );
}

type Series = WpSeries & { collectionName: string };

/* Seri kartı — koleksiyon sayfası ve "diğer seriler" bölümü */
export function SeriesCard({ x, lang }: { x: Series; lang: Lang }) {
  return (
    <Link href={`/duvar-kagidi/${x.collection}/${x.id}`} className={s.card}>
      <div className={s.cardImg}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={x.room ?? x.colors[0].img} alt={`${x.collectionName} ${x.code}`} loading="lazy" />
        {x.isNew && <span className={s.badge}>{lang === "me" ? "Novo" : lang === "tr" ? "Yeni" : "New"}</span>}
      </div>
      <div className={s.cardBody}>
        <span className={s.cardCol}>{x.collectionName.replace(/\s*\|\s*/, " ")} · {seriesWord(lang)}</span>
        <h3>{seriesNum(x.code)}</h3>
        <p>{seriesName(x, lang)}</p>
      </div>
    </Link>
  );
}

/* Koleksiyon kapağı: ana sayfada öne çıkan desen varsa onun oda fotoğrafı, yoksa ilk serininki */
const cover = (c: WpCollection) =>
  FEATURED.find((f) => f.collection === c.name)?.room ?? c.series.find((x) => x.room)?.room ?? c.series[0].colors[0].img;

export default function Catalog({ data }: { data: WpCatalog }) {
  const [lang, setLang] = useLang();
  const L = (me: string, tr: string, en: string) => (lang === "me" ? me : lang === "tr" ? tr : en);
  const seriesCount = data.collections.reduce((a, c) => a + c.series.length, 0);
  const totalColors = data.collections.reduce((a, c) => a + c.series.reduce((b, x) => b + x.colors.length, 0), 0);

  return (
    <div className={s.page}>
      <WpHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("Tapete", "Duvar Kağıdı", "Wallpaper") }]} />

      <section className={s.hero}>
        <p className={s.kicker}>AdaWall · {data.collections.length} {L("kolekcija", "koleksiyon", "collections")}</p>
        <h1 className={s.title}>{L("Kolekcija", "Duvar Kağıdı", "Wallpaper")} <em>{L("tapeta", "koleksiyonu", "collection")}</em></h1>
        <p className={s.lead}>
          {L(`${data.collections.length} kolekcija, ${seriesCount} serija i ${totalColors} dezena. Izaberite kolekciju i pogledajte sve serije.`,
            `${data.collections.length} koleksiyon, ${seriesCount} seri ve ${totalColors} desen. Bir koleksiyon seçin, tüm serilerini görün.`,
            `${data.collections.length} collections, ${seriesCount} series and ${totalColors} designs. Pick a collection to see all its series.`)}
        </p>
      </section>

      <section className={`${s.grid} ${s.colGrid}`}>
        {data.collections.map((c) => (
          <Link key={c.id} href={`/duvar-kagidi/${c.id}`} className={`${s.card} ${s.colCard}`}>
            <div className={s.cardImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover(c)} alt={`AdaWall ${c.name}`} loading="lazy" />
              {c.series.some((x) => x.isNew) && <span className={s.badge}>{L("Novo", "Yeni", "New")}</span>}
            </div>
            <div className={s.cardBody}>
              <h3>{c.name.replace(/\s*\|\s*/, " ")}</h3>
              <p>{c.series.length} {L("serija", "seri", "series")} · {c.series.reduce((a, x) => a + x.colors.length, 0)} {L("dezena", "desen", "designs")} <span>→</span></p>
            </div>
          </Link>
        ))}
      </section>

      <WpFooter lang={lang} />
    </div>
  );
}
