"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/useLang";
import { PHONE, pick, type Txt } from "@/lib/site";
import { METAL_NAMES, METAL_SWATCH, PVC_PATTERNS, PVC_PROFILES, PVC_SHEET, type MetalId, type PvcPattern } from "@/lib/pvc";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import PvcStory from "./PvcStory";
import h from "../home/Home.module.css";
import s from "./Pvc.module.css";

const FEATURES: Txt[] = [
  { me: "Vodootporan", tr: "Su geçirmez", en: "Waterproof" },
  { me: "Antibakterijski", tr: "Antibakteriyel", en: "Antibacterial" },
  { me: "Sjajna površina", tr: "Parlak yüzey", en: "Gloss surface" },
  { me: "Lagan i fleksibilan", tr: "Hafif ve esnek", en: "Light and flexible" },
  { me: "Nezapaljiv", tr: "Alev almaz", en: "Flame retardant" },
  { me: "Laka montaža", tr: "Kolay montaj", en: "Easy to install" },
];

const USAGE: Txt[] = [
  { me: "Kupatilo", tr: "Banyo", en: "Bathroom" },
  { me: "Kuhinja", tr: "Mutfak", en: "Kitchen" },
  { me: "Dnevna soba", tr: "Oturma odası", en: "Living room" },
  { me: "Hotel", tr: "Otel", en: "Hotel" },
  { me: "Kancelarija", tr: "Ofis", en: "Office" },
  { me: "Restoran", tr: "Restoran", en: "Restaurant" },
];

const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  { icon: <path d="M12 2.5c3.5 4.2 6 7.6 6 11a6 6 0 01-12 0c0-3.4 2.5-6.8 6-11z" strokeLinejoin="round" />,
    title: { me: "100% vodootporni", tr: "%100 su geçirmez", en: "100% waterproof" },
    text: { me: "Potpuno otporni na vlagu i vodu — za kupatila, kuhinje i SPA, bez straha od buđi.", tr: "Neme ve suya tamamen dayanıklı — küf korkusu olmadan banyo, mutfak ve SPA için.", en: "Fully resistant to moisture and water — for bathrooms, kitchens and spas, with no fear of mould." } },
  { icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Laka montaža", tr: "Kolay montaj", en: "Easy installation" },
    text: { me: "Direktno na postojeći zid, bez rušenja i prašine. Prostorija je gotova za jedan dan.", tr: "Kırma ve toz olmadan doğrudan mevcut duvara. Bir oda bir günde biter.", en: "Straight onto the existing wall, no demolition or dust. A room is done in a day." } },
  { icon: <><circle cx="12" cy="12" r="9.5" /><path d="M8.5 12l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { me: "Jednostavno održavanje", tr: "Kolay bakım", en: "Easy care" },
    text: { me: "Briše se vlažnom krpom. Nema fugni ni pukotina u kojima se skuplja prljavština.", tr: "Nemli bezle silinir. Kir tutan derz veya çatlak yok.", en: "Wipe with a damp cloth. No grout or cracks for dirt to collect in." } },
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Antibakterijski", tr: "Antibakteriyel", en: "Antibacterial" },
    text: { me: "Specijalni premaz usporava rast bakterija i plijesni — higijenska površina.", tr: "Özel kaplama bakteri ve küf oluşumunu engeller — hijyenik yüzey.", en: "A special coating inhibits bacteria and mould — a hygienic surface." } },
  { icon: <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" strokeLinecap="round" /></>,
    title: { me: "UV otpornost", tr: "UV dayanımı", en: "UV resistant" },
    text: { me: "Boja i sjaj ostaju isti godinama, bez žućenja i blijeđenja.", tr: "Renk ve parlaklık yıllarca aynı kalır; sararma ve solma yok.", en: "Colour and gloss stay the same for years — no yellowing or fading." } },
  { icon: <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Vatrootpornost B-s1, d0", tr: "B-s1, d0 yangın sınıfı", en: "Fire class B-s1, d0" },
    text: { me: "Klasa vatrootpornosti B-s1, d0 u skladu sa EU građevinskim standardima.", tr: "AB yapı standartlarına uygun B-s1, d0 yangın dayanım sınıfı.", en: "B-s1, d0 fire class in line with EU building standards." } },
  { icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" strokeLinecap="round" /></>,
    title: { me: "Termička izolacija", tr: "Isı yalıtımı", en: "Thermal insulation" },
    text: { me: "Poboljšava izolaciju zida i smanjuje gubitak toplote.", tr: "Duvarın yalıtımını iyileştirir, ısı kaybını azaltır.", en: "Improves wall insulation and reduces heat loss." } },
  { icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    title: { me: "18 dezena", tr: "18 desen", en: "18 designs" },
    text: { me: "Bijeli, zlatni, tamni i mermer u boji — rješenje za svaki enterijer.", tr: "Beyaz, altın damarlı, koyu ve renkli mermer — her iç mekana bir çözüm.", en: "White, gold-veined, dark and coloured marble — something for every interior." } },
];

const METALS: MetalId[] = ["krom", "altin", "siyah"];

export default function PvcPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const [pattern, setPattern] = useState<PvcPattern>(PVC_PATTERNS[0]);
  const [open, setOpen] = useState<number | null>(null);
  const [metals, setMetals] = useState<MetalId[]>(PVC_PROFILES.map(() => "krom"));
  const storyRef = useRef<HTMLDivElement>(null);

  // kaydırınca beliren bölümler
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(h.in); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // desen penceresi: klavye ve kaydırma kilidi
  useEffect(() => {
    if (open === null) return;
    const n = PVC_PATTERNS.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + n) % n));
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % n));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const seeAll = () => document.getElementById("dezeni")?.scrollIntoView({ behavior: "smooth" });

  // galeriden seçilen deseni 3D banyoda göster
  const tryIn3d = (p: PvcPattern) => {
    setPattern(p);
    setOpen(null);
    const el = storyRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + el.offsetHeight - window.innerHeight, behavior: "smooth" });
  };

  const oi = open ?? 0;
  const cur = open === null ? null : PVC_PATTERNS[oi];
  const step = (d: number) => setOpen((i) => (i === null ? i : (i + d + PVC_PATTERNS.length) % PVC_PATTERNS.length));

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("PVC paneli", "PVC paneller", "PVC panels") }]} />

      <div ref={storyRef}>
        <PvcStory lang={lang} pattern={pattern} onPattern={setPattern} onSeeAll={seeAll} />
      </div>

      {/* ===== DESENLER ===== */}
      <section id="dezeni" className={h.section}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Kolekcija dezena", "Desen koleksiyonu", "Design collection")}</p>
            <h2 className={h.h2}>{L("18 dezena", "18 mermer", "18 marble")} <em>{L("mermera", "deseni", "designs")}</em></h2>
          </div>
          <p className={h.headDesc}>{L("Kliknite na dezen da ga vidite u punoj veličini ili ga isprobajte u 3D kupatilu.", "Tam boyutunu görmek için desene tıklayın ya da 3D banyoda deneyin.", "Click a design to see the full sheet, or try it in the 3D bathroom.")}</p>
        </header>
        <div className={s.grid}>
          {PVC_PATTERNS.map((p, i) => (
            <button key={p.code} className={s.card} onClick={() => setOpen(i)} data-reveal style={{ transitionDelay: `${(i % 6) * 0.05}s` }}>
              <span className={s.cardImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.name} loading="lazy" />
              </span>
              <span className={s.cardBody}>
                <small>{p.code} · {p.tone[lang]}</small>
                <b>{p.name}</b>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== TEKNİK ÖZELLİKLER ===== */}
      <section className={s.specBand}>
        <div className={s.specInner} data-reveal>
          <div className={s.specIntro}>
            <p className={h.kicker}>{L("Tehničke karakteristike", "Teknik özellikler", "Specifications")}</p>
            <h2 className={h.h2}>{L("Jedna ploča,", "Tek levha,", "One sheet,")} <em>{L("cijeli zid", "koca duvar", "a whole wall")}</em></h2>
            <p>{L("PVC (polivinilhlorid) paneli su lagana, vodootporna obloga za zidove i plafone. Zahvaljujući štampi visoke rezolucije vjerno imitiraju prirodni mermer, a postavljaju se direktno na postojeću površinu.", "PVC (polivinil klorür) paneller duvar ve tavan için hafif, su geçirmez bir kaplamadır. Yüksek çözünürlüklü baskı sayesinde doğal mermeri aslına uygun taklit eder ve doğrudan mevcut yüzeye uygulanır.", "PVC (polyvinyl chloride) panels are a light, waterproof covering for walls and ceilings. High-resolution printing gives them a faithful natural-marble look, and they go straight onto the existing surface.")}</p>
          </div>
          <dl className={s.specNums}>
            <div><dt>{L("Širina", "Genişlik", "Width")}</dt><dd>{PVC_SHEET.width}<small>cm</small></dd></div>
            <div><dt>{L("Dužina", "Uzunluk", "Length")}</dt><dd>{PVC_SHEET.height}<small>cm</small></dd></div>
            <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{PVC_SHEET.thickness}<small>mm</small></dd></div>
            <div><dt>{L("Jedna ploča pokriva", "Bir levha kaplar", "One sheet covers")}</dt><dd>{PVC_SHEET.area}<small>m²</small></dd></div>
          </dl>
          <div className={s.chips}>
            <div>
              <span>{L("Karakteristike", "Özellikler", "Features")}</span>
              <p>{FEATURES.map((f) => <i key={f.en}>{f[lang]}</i>)}</p>
            </div>
            <div>
              <span>{L("Primjena", "Kullanım alanları", "Where to use")}</span>
              <p>{USAGE.map((u) => <i key={u.en}>{u[lang]}</i>)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROFİLLER ===== */}
      <section className={h.section}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Dodaci", "Tamamlayıcı ürünler", "Accessories")}</p>
            <h2 className={h.h2}>{L("Aluminijumski", "Alüminyum", "Aluminium")} <em>{L("profili", "profiller", "profiles")}</em></h2>
          </div>
          <p className={h.headDesc}>{L("Za spojeve, uglove i završetke — u hrom, zlatnoj i crnoj boji.", "Birleşimler, köşeler ve kenarlar için — krom, altın ve siyah.", "For joints, corners and edges — in chrome, gold and black.")}</p>
        </header>
        <div className={s.profiles}>
          {PVC_PROFILES.map((pr, i) => {
            const m = pr.imgs[metals[i]] ? metals[i] : "krom";
            return (
              <article key={pr.type.en} className={s.profile} data-reveal style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className={s.profileImg}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img key={m} src={pr.imgs[m]} alt={`${pr.type[lang]} — ${METAL_NAMES[m][lang]}`} loading="lazy" />
                  <span>{pr.size}</span>
                </div>
                <h3>{pr.type[lang]}</h3>
                <p>{pr.text[lang]}</p>
                <div className={s.metals}>
                  {METALS.filter((id) => pr.imgs[id]).map((id) => (
                    <button key={id} className={id === m ? s.metalOn : ""} onClick={() => setMetals((a) => a.map((v, j) => (j === i ? id : v)))} title={METAL_NAMES[id][lang]}>
                      <span style={{ background: METAL_SWATCH[id] }} />{METAL_NAMES[id][lang]}
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== AVANTAJLAR ===== */}
      <section className={`${h.section} ${s.advSection}`}>
        <header className={`${h.head} ${h.headCenter}`} data-reveal>
          <div>
            <p className={h.kicker}>{L("Zašto PVC panel", "Neden PVC panel", "Why PVC panels")}</p>
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
        title={lang === "me" ? <>Zainteresovani za <em>PVC panele</em>?</> : lang === "tr" ? <><em>PVC paneller</em> ilginizi mi çekti?</> : <>Interested in <em>PVC panels</em>?</>}
        text={L("Posjetite naš salon u Ulcinju i pogledajte ploče uživo. Pomoći ćemo vam da izaberete dezen i izračunamo potreban broj ploča.", "Ulcinj'deki showroom'umuzda levhaları yerinde görün. Desen seçiminde yardımcı olur, gereken levha sayısını hesaplarız.", "Visit our showroom in Ulcinj to see the sheets in person. We'll help you choose a design and work out how many sheets you need.")}
      />
      <SiteFooter lang={lang} />

      {/* ===== DESEN PENCERESİ ===== */}
      {cur && (
        <div className={s.sheet} role="dialog" aria-modal="true" aria-label={cur.name} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className={s.sheetBox}>
            <button className={s.close} onClick={() => setOpen(null)} aria-label={L("Zatvori", "Kapat", "Close")}>✕</button>
            <div className={s.sheetImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={cur.code} src={cur.img} alt={cur.name} />
            </div>
            <div className={s.sheetInfo}>
              <p className={h.kicker}>{cur.code} · {cur.tone[lang]}</p>
              <h2>{cur.name}</h2>
              <dl>
                <div><dt>{L("Dimenzije", "Ölçüler", "Size")}</dt><dd>{PVC_SHEET.width} × {PVC_SHEET.height} cm</dd></div>
                <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{PVC_SHEET.thickness} mm</dd></div>
                <div><dt>{L("Pokriva", "Kaplama", "Covers")}</dt><dd>{PVC_SHEET.area} m²</dd></div>
                <div><dt>{L("Površina", "Yüzey", "Finish")}</dt><dd>{L("Visoki sjaj", "Yüksek parlak", "High gloss")}</dd></div>
              </dl>
              <p className={s.sheetChips}>{FEATURES.map((f) => <i key={f.en}>{f[lang]}</i>)}</p>
              <div className={s.sheetBtns}>
                <button className={h.btnPrimary} onClick={() => tryIn3d(cur)}>{L("Isprobaj u 3D", "3D'de dene", "Try in 3D")} <span>→</span></button>
                <a className={h.btnGhost} href={`${PHONE.wa}?text=${encodeURIComponent(`PVC ${cur.name} (${cur.code})`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
              <div className={s.sheetNav}>
                <button onClick={() => step(-1)}>← {PVC_PATTERNS[(oi - 1 + PVC_PATTERNS.length) % PVC_PATTERNS.length].name}</button>
                <span>{oi + 1} / {PVC_PATTERNS.length}</span>
                <button onClick={() => step(1)}>{PVC_PATTERNS[(oi + 1) % PVC_PATTERNS.length].name} →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
