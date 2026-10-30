"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/useLang";
import { PHONE, pick, type Txt } from "@/lib/site";
import { MOD_MODELS } from "@/lib/moduler";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import h from "../home/Home.module.css";
import s from "@/components/site/Product.module.css";
import k from "./Katalog.module.css";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

/* indirilebilir belge: PDF, video ya da sitedeki çevrim içi katalog */
/* soon: PDF kataloğu hazırlanıyor — bağlantısız satır; dosya gelince kind: "pdf" ve href ile değiştirilir */
type Doc = { label: string | Txt; href: string; kind: "pdf" | "web" | "soon"; size?: string };
type Group = { num: string; name: Txt; text: Txt; img: string; href: string; docs: Doc[] };

const ONLINE = (n: Txt): Doc => ({ label: n, href: "", kind: "web" });
const SOON: Doc = { label: T("PDF katalog", "PDF katalog", "PDF catalogue"), href: "", kind: "soon" };

const GROUPS: Group[] = [
  { num: "01", name: T("PVC paneli", "PVC paneller", "PVC panels"), img: "/anasayfa-pvc.webp", href: "/urunler/pvc-paneli",
    text: T("18 dezena mermera u pločama 122 × 280 cm, sa aluminijumskim profilima.", "122 × 280 cm levhalarda 18 mermer deseni, alüminyum profillerle.", "18 marble designs in 122 × 280 cm sheets, with aluminium profiles."),
    docs: [ONLINE(T("Online katalog — svi dezeni", "Çevrim içi katalog — tüm desenler", "Online catalogue — all designs")), SOON] },
  { num: "02", name: T("MDF paneli", "MDF paneller", "MDF panels"), img: "/anasayfa%20mdf.jpg", href: "/urunler/mdf-paneli",
    text: T("3 modela lamela u 16 boja, uz katalog dekora za posebne narudžbe.", "16 renkte 3 lamel model; özel siparişler için dekor kartelası.", "3 slat models in 16 colours, plus a decor catalogue for custom orders."),
    docs: [ONLINE(T("Online katalog — modeli i boje", "Çevrim içi katalog — modeller ve renkler", "Online catalogue — models and colours")), SOON] },
  { num: "03", name: T("Modularni 3D paneli", "Modüler 3D paneller", "Modular 3D panels"), img: "/KAPAK%20PENTA.jpg", href: "/urunler/moduler-duvar-paneli",
    text: T("10 reljefnih modela u 6 standardnih i svim RAL bojama. Tehnički list za svaki model.", "6 standart ve tüm RAL renklerinde 10 rölyefli model. Her model için teknik föy.", "10 relief models in 6 standard colours and any RAL colour. A technical sheet for every model."),
    docs: [
      ONLINE(T("Online katalog — 10 modela", "Çevrim içi katalog — 10 model", "Online catalogue — 10 models")),
      SOON,
      ...MOD_MODELS.filter((m) => m.docs.teknik).map((m): Doc => ({ label: T(`${m.name} — tehnički list`, `${m.name} — teknik föy`, `${m.name} — technical sheet`), href: m.docs.teknik!, kind: "pdf" })),
    ] },
  { num: "04", name: T("Akustični paneli", "Akustik paneller", "Acoustic panels"), img: "/anasayfa-akustik.webp", href: "/urunler/akustik-duvar-paneli",
    text: T("Drvene lamele na akustičnom filcu, 60 × 280 cm, u 4 boje.", "Akustik keçe üzerinde ahşap çıtalar, 60 × 280 cm, 4 renk.", "Wooden slats on acoustic felt, 60 × 280 cm, in 4 colours."),
    docs: [ONLINE(T("Online katalog — boje i detalji", "Çevrim içi katalog — renkler ve detaylar", "Online catalogue — colours and details")), SOON] },
  { num: "05", name: T("Tapete", "Duvar kağıdı", "Wallpaper"), img: "/duvar-kagidi/oda-kart/seven-7811-serie.webp", href: "/duvar-kagidi",
    text: T("15 AdaWall kolekcija, 191 serija i preko 1000 dezena — sa fotografijama prostorija.", "15 AdaWall koleksiyonu, 191 seri ve 1000'i aşkın desen — oda fotoğraflarıyla.", "15 AdaWall collections, 191 series and over 1000 designs — with room photos."),
    docs: [ONLINE(T("Online katalog — 15 kolekcija", "Çevrim içi katalog — 15 koleksiyon", "Online catalogue — 15 collections")), SOON] },
  { num: "06", name: T("Fleksibilni kamen", "Esnek taş", "Flexible stone"), img: "/clayton/oda/traverten-1.webp", href: "/urunler/esnek-tas-panel",
    text: T("21 Clayton serija i 56 dezena: kamen, mermer, škriljac, opeka i drvo.", "21 Clayton serisi ve 56 desen: taş, mermer, arduvaz, tuğla ve ahşap.", "21 Clayton series and 56 designs: stone, marble, slate, brick and wood."),
    docs: [
      ONLINE(T("Online katalog — 21 serija", "Çevrim içi katalog — 21 seri", "Online catalogue — 21 series")),
      { label: T("Clayton katalog 2026", "Clayton kataloğu 2026", "Clayton catalogue 2026"), href: "/katalog/clayton-katalog-2026.pdf", kind: "pdf", size: "33 str. · 7 MB" },
    ] },
];

const KIND: Record<Doc["kind"], Txt> = { pdf: T("PDF", "PDF", "PDF"), web: T("Stranica", "Sayfa", "Page"), soon: T("U pripremi", "Hazırlanıyor", "Coming soon") };

export default function KatalogPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const label = (x: string | Txt) => (typeof x === "string" ? x : x[lang]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(h.in); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("Katalog", "Katalog", "Catalogue") }]} />

      <section className={`${h.section} ${s.first}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Katalozi i dokumentacija", "Kataloglar ve belgeler", "Catalogues & documents")}</p>
            <h1 className={h.h2}>{L("Sve kolekcije", "Tüm koleksiyonlar", "Every collection")} <em>{L("na jednom mjestu", "tek yerde", "in one place")}</em></h1>
          </div>
          <p className={h.headDesc}>{L("Pregledajte online kataloge i preuzmite tehničke listove. PDF katalozi za preuzimanje su u pripremi i uskoro će biti ovdje — do tada ih možete vidjeti u našem salonu u Ulcinju.", "Çevrim içi katalogları inceleyin, teknik föyleri indirin. İndirilebilir PDF kataloglar hazırlanıyor, yakında burada olacak — o zamana kadar Ulcinj'deki showroom'umuzda görebilirsiniz.", "Browse the online catalogues and download technical sheets. Downloadable PDF catalogues are being prepared and will be here soon — until then, see them at our Ulcinj showroom.")}</p>
        </header>

        <div className={k.list}>
          {GROUPS.map((g) => (
            <article key={g.num} className={k.row} data-reveal>
              <Link href={g.href} className={k.img}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.name[lang]} loading="lazy" />
              </Link>
              <div className={k.info}>
                <span className={k.num}>{g.num}</span>
                <h2>{g.name[lang]}</h2>
                <p>{g.text[lang]}</p>
              </div>
              <ul className={k.docs}>
                {g.docs.map((d) => {
                  if (d.kind === "soon") return (
                    <li key="soon"><span className={k.soon}><b>{label(d.label)}</b><small>{KIND.soon[lang]}</small><i aria-hidden>…</i></span></li>
                  );
                  const href = d.kind === "web" ? g.href : d.href;
                  const inner = (<><b>{label(d.label)}</b><small>{KIND[d.kind][lang]}{d.size ? ` · ${d.size}` : ""}</small><i aria-hidden>{d.kind === "pdf" ? "↓" : "→"}</i></>);
                  return (
                    <li key={href + label(d.label)}>
                      {d.kind === "web" ? <Link href={href}>{inner}</Link> : <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>

        <div className={k.ask} data-reveal>
          <p>{L("Trebate štampani katalog, uzorak ili cjenovnik?", "Basılı katalog, numune ya da fiyat listesi mi lazım?", "Need a printed catalogue, a sample or a price list?")}</p>
          <a className={h.btnPrimary} href={`${PHONE.wa}?text=${encodeURIComponent(L("Zdravo, želim katalog", "Merhaba, katalog istiyorum", "Hello, I'd like a catalogue"))}`} target="_blank" rel="noopener noreferrer">{L("Pitajte na WhatsApp-u", "WhatsApp'tan sorun", "Ask on WhatsApp")} <span>→</span></a>
        </div>
      </section>

      <ContactSection lang={lang} />
      <SiteFooter lang={lang} />
    </div>
  );
}
