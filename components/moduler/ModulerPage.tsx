"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/useLang";
import { PHONE, pick, type Txt } from "@/lib/site";
import { MOD_COLORS, MOD_MATERIAL, MOD_MODELS } from "@/lib/moduler";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import h from "../home/Home.module.css";
import s from "@/components/site/Product.module.css";
import m from "./Moduler.module.css";

const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Lagani ABS polimer", tr: "Hafif ABS polimer", en: "Lightweight ABS polymer" },
    text: { me: "Lagani za rukovanje, otporni na udarce i dugotrajni.", tr: "Kolay taşınır, darbelere dayanıklı ve uzun ömürlü.", en: "Easy to handle, impact-resistant and long-lasting." } },
  { icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Laka montaža", tr: "Kolay montaj", en: "Easy installation" },
    text: { me: "Direktno na zid, bez rušenja. Jedan majstor završava prostoriju za jedan dan.", tr: "Yıkım olmadan doğrudan duvara. Tek usta bir odayı bir günde bitirir.", en: "Straight onto the wall, no demolition. One fitter finishes a room in a day." } },
  { icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    title: { me: "Modularni sistem", tr: "Modüler sistem", en: "Modular system" },
    text: { me: "Okrećite i kombinujte komade — svaki zid dobija svoj raspored.", tr: "Parçaları döndürün ve birleştirin — her duvar kendi dizilimini alır.", en: "Rotate and combine pieces — every wall gets its own layout." } },
  { icon: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Pravi 3D reljef", tr: "Gerçek 3D rölyef", en: "Real 3D relief" },
    text: { me: "Pravi reljef daje zidu stvarnu dubinu, za razliku od 3D tapeta.", tr: "Gerçek rölyef, 3D duvar kağıdının aksine duvara gerçek derinlik verir.", en: "Real relief gives the wall true depth, unlike 3D wallpaper." } },
  { icon: <><circle cx="12" cy="12" r="9.5" /><path d="M8.5 12l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { me: "RAL boje", tr: "RAL renkleri", en: "RAL colours" },
    text: { me: "Pored standardnih boja, po narudžbi u svim RAL bojama.", tr: "Standart renklerin yanında sipariş üzerine tüm RAL renklerinde.", en: "Beyond the standard colours, any RAL colour to order." } },
  { icon: <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Akrilna završna obrada", tr: "Akrilik kaplama", en: "Acrylic finish" },
    text: { me: "Kvalitetna akrilna boja otporna na ogrebotine i UV zrake.", tr: "Çizilmeye ve UV ışınlarına dayanıklı kaliteli akrilik boya.", en: "Quality acrylic paint resistant to scratches and UV light." } },
  { icon: <><path d="M4 9v6M8 6v12M12 4v16M16 7v10M20 10v4" strokeLinecap="round" /></>,
    title: { me: "Bolja akustika", tr: "Daha iyi akustik", en: "Better acoustics" },
    text: { me: "Reljefna površina rasipa zvuk i smanjuje odjek u prostoru.", tr: "Rölyefli yüzey sesi dağıtır, mekândaki yankıyı azaltır.", en: "The relief surface scatters sound and reduces echo." } },
  { icon: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" /></>,
    title: { me: "Široka primjena", tr: "Geniş kullanım", en: "Wide application" },
    text: { me: "Lobiji, restorani, kancelarije, showroomi — svaki prostor dobija karakter.", tr: "Lobiler, restoranlar, ofisler, showroomlar — her mekâna karakter katar.", en: "Lobbies, restaurants, offices, showrooms — character for every space." } },
];

export default function ModulerPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const [open, setOpen] = useState<number | null>(null);
  const [img, setImg] = useState<string | null>(null);

  // kaydırınca beliren bölümler
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(h.in); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // model penceresi: klavye ve kaydırma kilidi
  useEffect(() => {
    if (open === null) return;
    const n = MOD_MODELS.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") { setOpen((i) => (i === null ? i : (i - 1 + n) % n)); setImg(null); }
      if (e.key === "ArrowRight") { setOpen((i) => (i === null ? i : (i + 1) % n)); setImg(null); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const openModel = (i: number) => { setOpen(i); setImg(null); };
  const step = (d: number) => { setOpen((i) => (i === null ? i : (i + d + MOD_MODELS.length) % MOD_MODELS.length)); setImg(null); };

  const cur = open === null ? null : MOD_MODELS[open];
  const main = cur ? img ?? cur.info : null;

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("Modularni paneli", "Modüler paneller", "Modular panels") }]} />

      {/* ===== MODELLER ===== */}
      <section id="modeli" className={`${h.section} ${m.first}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Kolekcija", "Koleksiyon", "Collection")}</p>
            <h1 className={h.h2}>{L("Modularni 3D paneli —", "Modüler 3D paneller —", "Modular 3D panels —")} <em>{MOD_MODELS.length} {L("modela", "model", "models")}</em></h1>
          </div>
          <p className={h.headDesc}>{L("Kliknite na model za opis, boje, galeriju i tehničku dokumentaciju.", "Açıklama, renkler, galeri ve teknik belgeler için bir modele tıklayın.", "Click a model for its description, colours, gallery and technical documents.")}</p>
        </header>
        <div className={m.grid}>
          {MOD_MODELS.map((md, i) => (
            <button key={md.id} className={m.card} onClick={() => openModel(i)} data-reveal style={{ transitionDelay: `${(i % 4) * 0.06}s` }}>
              <span className={m.cardImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={md.cover} alt={md.name} loading="lazy" />
                {md.isNew && <em className={m.badge}>{L("Novo", "Yeni", "New")}</em>}
              </span>
              <span className={m.cardBody}>
                <small>{md.shape[lang]}</small>
                <b>{md.name}</b>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== RAL ===== */}
      <section className={h.section}>
        <div className={`${s.feature} ${s.flip}`} data-reveal>
          <div className={s.featureImg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/RAL%20RENK%20KARTELASI.jpg" alt={L("RAL katalog boja", "RAL renk kartelası", "RAL colour chart")} loading="lazy" />
          </div>
          <div className={s.featureText}>
            <p className={h.kicker}>{L("Posebna boja", "Özel renk", "Custom colour")}</p>
            <h2 className={h.h2}>{L("Svaka", "Her", "Any")} <em>{L("RAL boja", "RAL rengi", "RAL colour")}</em></h2>
            <p>{L("Pored standardnih boja — bijele, vizon, crne, zlatne, srebrne i dimljene — svaki model izrađujemo po narudžbi u bilo kojoj boji iz RAL kataloga, usklađenoj sa vašim enterijerom.", "Standart renklerin — beyaz, vizon, siyah, altın, gümüş ve füme — yanında her modeli sipariş üzerine RAL kartelasındaki dilediğiniz renkte, iç mekânınıza uygun üretiyoruz.", "Alongside the standard colours — white, mink, black, gold, silver and smoke — every model can be made to order in any colour from the RAL chart, matched to your interior.")}</p>
          </div>
        </div>
      </section>

      {/* ===== AVANTAJLAR ===== */}
      <section className={`${h.section} ${s.advSection}`}>
        <header className={`${h.head} ${h.headCenter}`} data-reveal>
          <div>
            <p className={h.kicker}>{L("Zašto modularni panel", "Neden modüler panel", "Why modular panels")}</p>
            <h2 className={h.h2}>{L("8 ključnih", "8 temel", "8 key")} <em>{L("prednosti", "avantaj", "advantages")}</em></h2>
          </div>
        </header>
        <div className={h.features}>
          {ADVANTAGES.map((a, i) => (
            <div key={a.title.en} className={h.feature} data-reveal style={{ transitionDelay: `${(i % 4) * 0.07}s` }}>
              <span className={h.featureNum}>0{i + 1}</span>
              <svg viewBox="0 0 24 24" className={h.featureIcon}>{a.icon}</svg>
              <h3>{a.title[lang]}</h3>
              <p>{a.text[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactSection
        lang={lang}
        title={lang === "me" ? <>Zainteresovani za <em>modularne panele</em>?</> : lang === "tr" ? <><em>Modüler paneller</em> ilginizi mi çekti?</> : <>Interested in <em>modular panels</em>?</>}
        text={L("Posjetite naš salon u Ulcinju i pogledajte modele uživo. Pomoći ćemo vam da izaberete model, boju i raspored za vaš zid.", "Ulcinj'deki showroom'umuzda modelleri yerinde görün. Duvarınız için model, renk ve dizilim seçiminde yardımcı oluruz.", "Visit our showroom in Ulcinj to see the models in person. We'll help you choose the model, colour and layout for your wall.")}
      />
      <SiteFooter lang={lang} />

      {/* ===== MODEL PENCERESİ ===== */}
      {cur && main && open !== null && (
        <div className={s.sheet} role="dialog" aria-modal="true" aria-label={cur.name} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className={`${s.sheetBox} ${m.sheetBox}`}>
            <button className={s.close} onClick={() => setOpen(null)} aria-label={L("Zatvori", "Kapat", "Close")}>✕</button>
            <div className={m.viewer}>
              <div className={m.viewerMain}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={main} src={main} alt={cur.name} />
              </div>
              <div className={m.thumbs}>
                {[cur.info, ...cur.gallery].map((src) => (
                  <button key={src} className={src === main ? m.thumbOn : ""} onClick={() => setImg(src)} style={{ backgroundImage: `url("${src}")` }} aria-label={cur.name} />
                ))}
              </div>
            </div>
            <div className={s.sheetInfo}>
              <p className={h.kicker}>{cur.shape[lang]}</p>
              <h2>{cur.name}</h2>
              <dl>
                <div><dt>{L("Materijal", "Malzeme", "Material")}</dt><dd>{MOD_MATERIAL[lang]}</dd></div>
              </dl>

              <p className={m.label}>{L("Boje", "Renkler", "Colours")}</p>
              <div className={m.swatches}>
                {cur.colors.map((c) => (
                  <button key={c.id} className={c.img === main ? m.swOn : ""} onClick={() => setImg(c.img)}>
                    <span style={{ backgroundImage: `url("${c.img}")` }} />
                    <small>{MOD_COLORS[c.id].name[lang]}</small>
                  </button>
                ))}
              </div>

              {cur.layouts && (
                <>
                  <p className={m.label}>{L("Primjeri rasporeda", "Dizilim örnekleri", "Layout ideas")}</p>
                  <div className={m.swatches}>
                    {cur.layouts.map((src, i) => (
                      <button key={src} className={src === main ? m.swOn : ""} onClick={() => setImg(src)}>
                        <span style={{ backgroundImage: `url("${src}")` }} />
                        <small>{L("Raspored", "Dizilim", "Layout")} {i + 1}</small>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p className={m.desc}>{cur.desc[lang]}</p>

              <div className={m.docs}>
                {cur.docs.teknik && <a href={cur.docs.teknik} target="_blank" rel="noopener noreferrer"><b>{L("Tehnički list", "Teknik föy", "Technical sheet")}</b><small>PDF</small></a>}
                {cur.docs.montaj && <a href={cur.docs.montaj} target="_blank" rel="noopener noreferrer"><b>{L("Montaža", "Montaj", "Installation")}</b><small>{cur.docs.montajVideo ? L("Video", "Video", "Video") : "PDF"}</small></a>}
                {cur.docs.model3d && <a href={cur.docs.model3d} download><b>{L("3D model", "3D model", "3D model")}</b><small>ZIP</small></a>}
              </div>

              <div className={s.sheetBtns}>
                <a className={h.btnPrimary} href={`${PHONE.wa}?text=${encodeURIComponent(`${L("Modularni panel", "Modüler panel", "Modular panel")} ${cur.name}`)}`} target="_blank" rel="noopener noreferrer">{L("Pitajte na WhatsApp-u", "WhatsApp'tan sorun", "Ask on WhatsApp")} <span>→</span></a>
                <a className={h.btnGhost} href={PHONE.href}>{L("Pozovite nas", "Bizi arayın", "Call us")}</a>
              </div>
              <div className={s.sheetNav}>
                <button onClick={() => step(-1)}>← {MOD_MODELS[(open - 1 + MOD_MODELS.length) % MOD_MODELS.length].name}</button>
                <span>{open + 1} / {MOD_MODELS.length}</span>
                <button onClick={() => step(1)}>{MOD_MODELS[(open + 1) % MOD_MODELS.length].name} →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
