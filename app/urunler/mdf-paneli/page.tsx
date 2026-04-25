"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";

type Txt = { tr: string; me: string; en: string };
function tx(key: Txt, lang: Lang): string { return key[lang]; }

const LANGS: { code: Lang; label: string }[] = [
  { code: "me", label: "ME" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
];

const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Visoka Gustoća i Čvrstoća",  tr: "Yüksek Yoğunluk ve Sağlamlık",  en: "High Density & Strength"       },
    text:  { me: "MDF je izrađen od fino mljevenih drvenih vlakana pod visokim pritiskom. Rezultat je homogena, iznimno čvrsta ploča koja se lako obrađuje i ne puca.", tr: "MDF, yüksek basınç altında ince öğütülmüş ahşap liflerinden üretilir. Sonuç; homojen, son derece sağlam ve işlenmesi kolay, çatlamayan bir levhadır.", en: "MDF is made from finely ground wood fibers under high pressure. The result is a homogeneous, extremely sturdy board that is easy to process and does not crack." },
  },
  {
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Laka Montaža",               tr: "Kolay Montaj",                   en: "Easy Installation"             },
    text:  { me: "Montira se direktno na zid bez lomljenja ili rušenja. Jedan majstor završava prostoriju za jedan dan uz minimalne troškove.", tr: "Kırma veya yıkım olmadan doğrudan duvara monte edilir. Tek usta minimum maliyetle bir günde odayı tamamlar.", en: "Installs directly on the wall without demolition. One worker completes a room in one day at minimal cost." },
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { me: "Prirodan Izgled Drveta",      tr: "Doğal Ahşap Görünümü",           en: "Natural Wood Appearance"       },
    text:  { me: "Napredne tehnike štampanja savršeno oponašaju drvo, kamen i beton. Dobijate toplinu prirodnih materijala bez njihovih mana.", tr: "Gelişmiş baskı teknikleri ahşap, taş ve betonu mükemmel taklit eder. Doğal malzemelerin sıcaklığını dezavantajları olmadan elde edersiniz.", en: "Advanced printing techniques perfectly imitate wood, stone and concrete. You get the warmth of natural materials without their drawbacks." },
  },
  {
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" strokeLinecap="round" /></>,
    title: { me: "Termička Izolacija",          tr: "Isı Yalıtımı",                   en: "Thermal Insulation"            },
    text:  { me: "Poboljšava toplotnu izolaciju prostorije i smanjuje gubitke energije. MDF ima nizak koeficijent toplinske provodljivosti.", tr: "Odanın ısı yalıtımını iyileştirir ve enerji kayıplarını azaltır. MDF düşük ısıl iletkenlik katsayısına sahiptir.", en: "Improves room thermal insulation and reduces energy losses. MDF has a low thermal conductivity coefficient." },
  },
  {
    icon: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /></>,
    title: { me: "Akustične Karakteristike",    tr: "Akustik Özellikler",             en: "Acoustic Properties"           },
    text:  { me: "Apsorbuje zvučne valove i značajno smanjuje odjek unutar prostora. Idealan za kancelarije, studije i stambene prostore.", tr: "Ses dalgalarını emer ve mekandaki yankıyı önemli ölçüde azaltır. Ofisler, stüdyolar ve konut alanları için idealdir.", en: "Absorbs sound waves and significantly reduces echo. Ideal for offices, studios and residential spaces." },
  },
  {
    icon: <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Ekološki Prihvatljiv",        tr: "Çevre Dostu",                    en: "Eco-Friendly"                  },
    text:  { me: "Proizveden od recikliranih drvenih vlakana uz minimalan uticaj na životnu sredinu. Sertifikovano prema evropskim ekološkim standardima.", tr: "Çevre üzerinde minimum etki ile geri dönüştürülmüş ahşap liflerinden üretilmiştir. Avrupa ekoloji standartlarına göre sertifikalıdır.", en: "Made from recycled wood fibers with minimal environmental impact. Certified to European ecological standards." },
  },
  {
    icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    title: { me: "Raznovrsna Primjena",         tr: "Çok Yönlü Kullanım",             en: "Versatile Application"         },
    text:  { me: "Savršen za dnevne sobe, spavaće sobe, TV niše, kancelarije i hotele. Kombinujte boje i teksture za jedinstveni enterijer.", tr: "Oturma odaları, yatak odaları, TV nişleri, ofisler ve oteller için mükemmeldir. Benzersiz bir iç mekan için renk ve dokuları birleştirin.", en: "Perfect for living rooms, bedrooms, TV niches, offices and hotels. Combine colors and textures for a unique interior." },
  },
  {
    icon: <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" /><path d="M8 12l3-6 3 6M9 10h4" strokeLinecap="round" /></>,
    title: { me: "Jednostavno Održavanje",      tr: "Kolay Bakım",                    en: "Easy Maintenance"              },
    text:  { me: "Čisti se vlažnom krpom ili blagim deterdžentom. Površina je otporna na ogrebotine i svakodnevno habanje.", tr: "Nemli bez veya hafif deterjanla temizlenir. Yüzey çiziklere ve günlük aşınmaya karşı dayanıklıdır.", en: "Clean with a damp cloth or mild detergent. The surface is resistant to scratches and everyday wear." },
  },
];

type MdfDim    = { label: Txt; value: string };
type MdfVariant = { color: string; img: string };
type MdfModel   = { name: Txt; code: string; dims: MdfDim[]; variants: MdfVariant[] };

const MDF_MODELS: MdfModel[] = [
  {
    name: { me: "Medijapan Zidni Panel", tr: "Medijapan Duvar Paneli", en: "Medijapan Wall Panel" },
    code: "Model 18121",
    dims: [
      { label: { me: "Širina",   tr: "Genişlik",  en: "Width"     }, value: "12,1 cm" },
      { label: { me: "Dužina",   tr: "Uzunluk",   en: "Length"    }, value: "280 cm"  },
      { label: { me: "Debljina", tr: "Kalınlık",  en: "Thickness" }, value: "18 mm"   },
    ],
    variants: [
      { color: "LMD 322 Antik Walnut",  img: "/mdf-lmd-322-antik-walnut.jpg"  },
      { color: "LMD 249 Antik Walnut",  img: "/mdf-lmd-249-antik-walnut.jpg"  },
      { color: "Soft Touch White",      img: "/mdf-soft-touch-white.jpg"      },
      { color: "Teak",                  img: "/mdf-teak.jpg"                  },
      { color: "Soft Touch Siyah",      img: "/mdf-soft-touch-siyah.jpg"      },
      { color: "Asos",                  img: "/mdf-asos.jpg"                  },
      { color: "Soft Touch Antrasit",   img: "/mdf-soft-touch-antrasit.jpg"   },
      { color: "Light Oak Black",       img: "/mdf-light-oak-black.jpg"       },
      { color: "Teak Black",            img: "/mdf-teak-black.jpg"            },
    ],
  },
  {
    name: { me: "Medijapan Zidni Panel", tr: "Medijapan Duvar Paneli", en: "Medijapan Wall Panel" },
    code: "Model 18118Y",
    dims: [
      { label: { me: "Širina",   tr: "Genişlik",  en: "Width"     }, value: "11,8 cm" },
      { label: { me: "Dužina",   tr: "Uzunluk",   en: "Length"    }, value: "280 cm"  },
      { label: { me: "Debljina", tr: "Kalınlık",  en: "Thickness" }, value: "18 mm"   },
    ],
    variants: [
      { color: "Water Green",         img: "/21.jpg" },
      { color: "İzlanda Blue",        img: "/22.jpg" },
      { color: "Soft Touch Antrasit", img: "/23.jpg" },
      { color: "Kiremit",             img: "/24.jpg" },
    ],
  },
  {
    name: { me: "Medijapan Zidni Panel", tr: "Medijapan Duvar Paneli", en: "Medijapan Wall Panel" },
    code: "Model 18118B",
    dims: [
      { label: { me: "Širina",   tr: "Genişlik",  en: "Width"     }, value: "11,8 cm" },
      { label: { me: "Dužina",   tr: "Uzunluk",   en: "Length"    }, value: "280 cm"  },
      { label: { me: "Debljina", tr: "Kalınlık",  en: "Thickness" }, value: "18 mm"   },
    ],
    variants: [
      { color: "Patine Krem",  img: "/31.jpg" },
      { color: "Patine Pink",  img: "/32.jpg" },
      { color: "İzlanda Blue", img: "/33.jpg" },
    ],
  },
];


const FEATURES: Txt[] = [
  { me: "Visoka gustoća",              tr: "Yüksek yoğunluk",           en: "High density"           },
  { me: "Glatka površina",             tr: "Pürüzsüz yüzey",            en: "Smooth surface"         },
  { me: "Laka obrada",                 tr: "Kolay işlenebilir",          en: "Easy to process"        },
  { me: "Prirodan izgled",             tr: "Doğal görünüm",             en: "Natural appearance"     },
  { me: "Termička izolacija",          tr: "Isı yalıtımı",              en: "Thermal insulation"     },
  { me: "Akustične karakteristike",    tr: "Akustik özellikler",        en: "Acoustic properties"    },
  { me: "Ekološki prihvatljiv",        tr: "Çevre dostu",               en: "Eco-friendly"           },
  { me: "Raznovrsna primjena",         tr: "Çok yönlü kullanım",        en: "Versatile application"  },
  { me: "Jednostavna montaža",         tr: "Kolay montaj",              en: "Easy installation"      },
  { me: "Dugotrajan",                  tr: "Uzun ömürlü",               en: "Long-lasting"           },
  { me: "Moderan dizajn",              tr: "Modern tasarım",            en: "Modern design"          },
];

const USAGE_TAGS: Txt[] = [
  { me: "Dnevna Soba",  tr: "Oturma Odası", en: "Living Room" },
  { me: "Spavaća Soba", tr: "Yatak Odası",  en: "Bedroom"     },
  { me: "Kancelarija",  tr: "Ofis",         en: "Office"      },
  { me: "Hotel",        tr: "Otel",         en: "Hotel"       },
  { me: "Restoran",     tr: "Restoran",     en: "Restaurant"  },
  { me: "TV Niša",      tr: "TV Nişi",      en: "TV Niche"    },
];

export default function MdfPanelPage() {
  const [lang, setLang] = useState<Lang>("me");
  const [scrolled, setScrolled] = useState(false);
  const [backTop, setBackTop] = useState(false);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbModelIdx, setLbModelIdx] = useState(0);
  const [lbVariantIdx, setLbVariantIdx] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const variantsRef = useRef<HTMLDivElement>(null);
  const variantsDrag = useRef({ active: false, startX: 0, scrollLeft: 0 });


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      setBackTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!lbOpen) return;
    const count = MDF_MODELS[lbModelIdx].variants.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setLbVariantIdx((i: number) => (i - 1 + count) % count);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setLbVariantIdx((i: number) => (i + 1) % count);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setLbVariantIdx((i: number) => (i + (e.deltaY > 0 ? 1 : -1) + count) % count);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
    };
  }, [lbOpen, lbModelIdx]);

  useEffect(() => {
    const el = thumbsRef.current?.children[lbVariantIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [lbVariantIdx]);

  function openLb(modelIdx: number, variantIdx: number) { setLbModelIdx(modelIdx); setLbVariantIdx(variantIdx); setLbOpen(true); document.body.style.overflow = "hidden"; }
  function closeLb() { setLbOpen(false); document.body.style.overflow = ""; }

  return (
    <>
      <style>{`body{zoom:0.8}`}</style>
      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} style={{ zoom: 1.25 }}>
        <Link href="/" className="logo-btn" aria-label="Baudecor">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Baudecor" height={64} style={{ height: 64, width: "auto", display: "block" }} />
        </Link>
        <div className="pp-breadcrumb-nav">
          <Link href="/" className="pp-breadcrumb-link">
            {lang === "me" ? "Početna" : lang === "tr" ? "Ana Sayfa" : "Home"}
          </Link>
          <span className="pp-breadcrumb-sep">→</span>
          <span className="pp-breadcrumb-current">
            {lang === "me" ? "MDF Paneli" : lang === "tr" ? "MDF Paneller" : "MDF Panels"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="lang-toggle">
            {LANGS.map((l) => (
              <button key={l.code} className={`lang-btn${lang === l.code ? " active" : ""}`} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          <a href="tel:+38268361700" className="nav-cta">+382 68 361 700</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pp-hero">
        <div
          className="pp-hero-bg"
          style={{ backgroundImage: "url('/mdf-genel-1.jpg')" }}
        />
        <div className="pp-hero-overlay" />
        <div className="pp-hero-content">
          <p className="pp-hero-category">
            {lang === "me" ? "— Kolekcija 2026 —" : lang === "tr" ? "— Koleksiyon 2026 —" : "— Collection 2026 —"}
          </p>
          <h1 className="pp-hero-title">
            {lang === "me" ? <>MDF <em>Zidni Paneli</em></>
             : lang === "tr" ? <>MDF <em>Duvar Panelleri</em></>
             : <>MDF <em>Wall Panels</em></>}
          </h1>
          <p className="pp-hero-sub">
            {lang === "me" ? "Prirodan Izgled · Laka Obrada · Moderan Dizajn"
             : lang === "tr" ? "Doğal Görünüm · Kolay İşlenebilirlik · Modern Tasarım"
             : "Natural Look · Easy Processing · Modern Design"}
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="pp-intro">
        <div className="pp-intro-text reveal">
          <p className="section-label">
            {lang === "me" ? "O Materijalu" : lang === "tr" ? "Malzeme Hakkında" : "About the Material"}
          </p>
          <h2 className="section-title">
            {lang === "me" ? <>Šta je <em>MDF Panel</em>?</>
             : lang === "tr" ? <>MDF Panel <em>Nedir</em>?</>
             : <>What is an <em>MDF Panel</em>?</>}
          </h2>
          <p className="pp-intro-para">
            {lang === "me"
              ? "MDF (Medium Density Fiberboard) panel je visokokvalitetna drvena ploča izrađena od fino mljevenih drvenih vlakana, koja se pod visokim pritiskom i temperaturom spajaju smolama. Rezultat je homogena, glatka površina koja se lako obrađuje i savršeno prima premaze, folije i dekorativne površine."
              : lang === "tr"
              ? "MDF (Orta Yoğunluklu Lif Levha) panel, yüksek basınç ve sıcaklık altında reçinelerle birleştirilen ince öğütülmüş ahşap liflerinden üretilen yüksek kaliteli bir ahşap levhadır. Sonuç; boyama, folyo ve dekoratif yüzeyleri mükemmel kabul eden homojen ve pürüzsüz bir yüzeydir."
              : "MDF (Medium Density Fiberboard) panel is a high-quality wooden board made from finely ground wood fibers bonded under high pressure and temperature. The result is a homogeneous, smooth surface that perfectly accepts coatings, foils and decorative finishes."}
          </p>
          <p className="pp-intro-para">
            {lang === "me"
              ? "Zahvaljujući naprednim tehnologijama štampanja, MDF paneli savršeno imitiraju prirodne materijale — drvo, kamen i beton. Posebno su pogodni za dnevne sobe, spavaće sobe, TV niše i poslovne prostore gdje je estetika od ključnog značaja."
              : lang === "tr"
              ? "Gelişmiş baskı teknolojileri sayesinde MDF paneller ahşap, taş ve beton gibi doğal malzemeleri mükemmel biçimde taklit eder. Özellikle estetiğin ön planda olduğu oturma odaları, yatak odaları, TV nişleri ve ticari mekanlar için uygundur."
              : "Thanks to advanced printing technologies, MDF panels perfectly imitate natural materials — wood, stone and concrete. Especially suited for living rooms, bedrooms, TV niches and commercial spaces where aesthetics are paramount."}
          </p>
          <div className="pp-usage-list">
            {USAGE_TAGS.map((tag, i) => (
              <span key={i} className="pp-usage-tag">{tx(tag, lang)}</span>
            ))}
          </div>
        </div>
        <div className="pp-intro-single-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mdf-genel-1.jpg" alt="MDF Panel" loading="lazy" />
        </div>
      </section>

      {/* MODELS */}
      <section className="pp-models">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Kolekcija Dezena" : lang === "tr" ? "Desen Koleksiyonu" : "Pattern Collection"}
            </p>
            <h2 className="section-title">
              {lang === "me" ? "Naši MDF Modeli" : lang === "tr" ? "MDF Model Koleksiyonumuz" : "Our MDF Models"}
            </h2>
          </div>
          <p className="section-desc">
            {lang === "me" ? "Odaberite iz naše bogate kolekcije dezena i tekstura."
             : lang === "tr" ? "Zengin desen ve doku koleksiyonumuzdan seçin."
             : "Choose from our rich collection of patterns and textures."}
          </p>
        </div>
        {MDF_MODELS.every(m => m.variants.length === 0) ? (
          <div className="pp-models-empty reveal">
            <p>{lang === "me" ? "Modeli se uskoro dodaju." : lang === "tr" ? "Modeller yakında eklenecek." : "Models coming soon."}</p>
          </div>
        ) : (
          <div className="mdf-model-groups">
            {MDF_MODELS.map((model, gi) => (
              model.variants.length > 0 && (
                <div key={gi} className="mdf-model-group">
                  <div className="mdf-model-group-header reveal">
                    <span className="mdf-model-group-code">{model.code}</span>
                    <h3 className="mdf-model-group-name">{tx(model.name, lang)}</h3>
                  </div>
                  <div
                    className="mdf-variants-row"
                    ref={variantsRef}
                    onMouseDown={(e) => { if (!variantsRef.current) return; variantsDrag.current = { active: true, startX: e.clientX, scrollLeft: variantsRef.current.scrollLeft }; variantsRef.current.style.cursor = "grabbing"; variantsRef.current.style.userSelect = "none"; }}
                    onMouseMove={(e) => { if (!variantsDrag.current.active || !variantsRef.current) return; variantsRef.current.scrollLeft = variantsDrag.current.scrollLeft - (e.clientX - variantsDrag.current.startX); }}
                    onMouseUp={() => { variantsDrag.current.active = false; if (variantsRef.current) { variantsRef.current.style.cursor = "grab"; variantsRef.current.style.userSelect = ""; } }}
                    onMouseLeave={() => { variantsDrag.current.active = false; if (variantsRef.current) { variantsRef.current.style.cursor = "grab"; variantsRef.current.style.userSelect = ""; } }}
                    style={{ cursor: "grab" }}
                  >
                    {model.variants.map((v, vi) => {
                      return (
                        <div key={vi} className={`catalog-item reveal reveal-delay-${(vi % 4) + 1}`} onClick={() => openLb(gi, vi)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.img} alt={v.color} loading="lazy" />
                          <div className="catalog-accent" />
                          <div className="catalog-label">
                            <p className="catalog-item-name">{v.color}</p>
                            <p className="catalog-item-code">{model.code}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </section>

      {/* ACCESSORIES */}
      <section className="pp-accessories">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Dodaci" : lang === "tr" ? "Aksesuarlar" : "Accessories"}
            </p>
            <h2 className="section-title">
              {lang === "me" ? <>Komplementarni <em>Aksesoari</em></>
               : lang === "tr" ? <>Tamamlayıcı <em>Aksesuar</em></>
               : <>Complementary <em>Accessories</em></>}
            </h2>
          </div>
        </div>
        <div className="pp-accessories-body reveal">
          <div className="pp-accessories-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Bitis%20profilleri.jpg" alt="Bitiş Profilleri" loading="lazy" />
          </div>
          <div className="pp-accessories-text">
            <p className="pp-accessories-lead">
              {lang === "me"
                ? "Za svaki model MDF zidnog panela dostupni su odgovarajući početni i završni profili."
                : lang === "tr"
                ? "Her MDF duvar paneli modelimiz için uyumlu başlangıç ve bitiş profilleri mevcuttur."
                : "Matching start and end profiles are available for every MDF wall panel model."}
            </p>
            <p className="pp-accessories-desc">
              {lang === "me"
                ? "Kompletno rješenje za savršenu montažu i profesionalan završni izgled — sve iz jednog izvora."
                : lang === "tr"
                ? "Kusursuz montaj ve profesyonel bir son görünüm için eksiksiz çözüm — hepsi tek kaynaktan."
                : "A complete solution for flawless installation and a professional finish — everything from one source."}
            </p>
          </div>
        </div>

        <div className="pp-accessories-body reveal" style={{ marginTop: 60, flexDirection: "row-reverse" }}>
          <div className="pp-accessories-image" style={{ flex: "0 0 40%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/renk%20kartelas%C4%B1.jpg" alt="Renk Kartelası" loading="lazy" />
          </div>
          <div className="pp-accessories-text">
            <p className="pp-accessories-lead">
              {lang === "me"
                ? "Stotine Dezena, Beskrajne Mogućnosti"
                : lang === "tr"
                ? "Yüzlerce Desen, Sınırsız Seçenek"
                : "Hundreds of Patterns, Endless Possibilities"}
            </p>
            <p className="pp-accessories-desc">
              {lang === "me"
                ? "Iz bogate palete uzoraka dostupnih u našem showroomu, željeni dekor možemo primijeniti na sve modele MDF zidnih panela. Posebna proizvodnja podliježe minimalnoj narudžbi, a rok isporuke iznosi 3–4 sedmice."
                : lang === "tr"
                ? "Showroomumuzda sunulan geniş renk kartelasından dilediğiniz deseni tüm MDF duvar paneli modellerimize uygulayabiliyoruz. Özel üretim belirli minimum sipariş adedine tabidir; teslimat süresi 3–4 haftadır."
                : "From the extensive color catalog available at our showroom, we can apply any chosen pattern to all of our MDF wall panel models. Custom orders are subject to a minimum quantity, with a lead time of 3–4 weeks."}
            </p>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="features">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Zašto MDF Panel" : lang === "tr" ? "Neden MDF Panel" : "Why MDF Panel"}
            </p>
            <h2 className="section-title">
              {lang === "me" ? "8 Ključnih Prednosti" : lang === "tr" ? "8 Temel Avantaj" : "8 Key Advantages"}
            </h2>
          </div>
        </div>
        <div className="features-grid">
          {ADVANTAGES.map((a, i) => (
            <div key={i} className={`feature-item reveal reveal-delay-${(i % 4) + 1}`}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">{a.icon}</svg>
              </div>
              <h3 className="feature-title">{tx(a.title, lang)}</h3>
              <p className="feature-text">{tx(a.text, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="cta-glow" />
        <div className="cta-content">
          <p className="section-label reveal">
            {lang === "me" ? "Kontaktirajte Nas" : lang === "tr" ? "İletişime Geçin" : "Contact Us"}
          </p>
          <h2 className="cta-title reveal">
            {lang === "me" ? <>Zainteresovani Za <em>MDF Panele</em>?</>
             : lang === "tr" ? <><em>MDF Paneller</em> İlginizi Çekiyor mu?</>
             : <>Interested in <em>MDF Panels</em>?</>}
          </h2>
          <p className="cta-text reveal">
            {lang === "me" ? "Posjetite naš izložbeni salon u Ulcinju ili nas pozovite. Naš tim će vam pomoći odabrati savršen model za vaš prostor."
             : lang === "tr" ? "Ulcinj'deki salonumuzu ziyaret edin veya arayın. Ekibimiz mekanınız için mükemmel modeli seçmenize yardımcı olacak."
             : "Visit our showroom in Ulcinj or call us. Our team will help you choose the perfect model for your space."}
          </p>
          <div className="reveal" style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+38268361700" className="btn-primary">
              {lang === "me" ? "Pozovite Nas" : lang === "tr" ? "Bizi Arayın" : "Call Us"}
            </a>
            <Link href="/" className="btn-outline">
              {lang === "me" ? "← Nazad na Početnu" : lang === "tr" ? "← Ana Sayfaya Dön" : "← Back to Home"}
            </Link>
          </div>
          <div className="cta-contact-grid reveal">
            {([
              { l: { tr: "Telefon", me: "Telefon", en: "Phone" }   as Txt, v: "+382 68 361 700",   href: "tel:+38268361700"        },
              { l: { tr: "E-posta", me: "Email",   en: "Email" }   as Txt, v: "info@baudecor.me",  href: "mailto:info@baudecor.me" },
              { l: { tr: "Adres",   me: "Adresa",  en: "Address" } as Txt, v: "Bratica bb, Ulcinj", href: undefined                },
              { l: { tr: "Çalışma Saatleri", me: "Radno Vrijeme", en: "Working Hours" } as Txt, v: "08:30 — 17:30", href: undefined },
            ] as { l: Txt; v: string; href: string | undefined }[]).map((info, i) => (
              <div key={i} className="cta-info">
                <p className="cta-info-label">{tx(info.l, lang)}</p>
                <p className="cta-info-value">
                  {info.href ? <a href={info.href}>{info.v}</a> : info.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-copy">
          © 2026 Baudecor · Crna Gora · {lang === "me" ? "Sva prava zadržana" : lang === "tr" ? "Tüm hakları saklıdır" : "All rights reserved"}
        </p>
        <div className="footer-links">
          {[
            { label: "Instagram", href: "https://www.instagram.com/baudecor.me/" },
            { label: "Facebook",  href: "https://www.facebook.com/baudecor.me/" },
            { label: "YouTube",   href: "https://www.youtube.com/@baudecormontenegro" },
          ].map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </div>
      </footer>

      {/* LIGHTBOX */}
      {MDF_MODELS.some(m => m.variants.length > 0) && (() => {
        const lbModel   = MDF_MODELS[lbModelIdx];
        const lbVariant = lbModel.variants[lbVariantIdx];
        const count     = lbModel.variants.length;
        return (
          <div className={`lightbox${lbOpen ? " open" : ""}`}>
            <div className="lightbox-topbar">
              <span className="lightbox-counter">{lbVariantIdx + 1} / {count}</span>
              <button className="lightbox-close" onClick={closeLb}>✕</button>
            </div>
            <div className="lightbox-image-area" onClick={(e) => { if (e.target === e.currentTarget) closeLb(); }}>
              <button className="lightbox-arrow prev" onClick={() => setLbVariantIdx((i: number) => (i - 1 + count) % count)}>‹</button>
              <div className="lightbox-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={`${lbModelIdx}-${lbVariantIdx}`} className="lightbox-img" src={lbVariant.img} alt={lbVariant.color} />
              </div>
              <button className="lightbox-arrow next" onClick={() => setLbVariantIdx((i: number) => (i + 1) % count)}>›</button>
            </div>
            <div className="lightbox-panel">
              <div className="lightbox-panel-cols">
                <div className="lightbox-panel-left">
                  <div>
                    <p className="lb-model-name">{lbVariant.color}</p>
                    <p className="lb-model-code">{tx(lbModel.name, lang)} · {lbModel.code}</p>
                  </div>
                  <div className="lb-divider" />
                  <div>
                    <p className="lb-section-title">
                      {lang === "me" ? "Dimenzije" : lang === "tr" ? "Ölçüler" : "Dimensions"}
                    </p>
                    <div className="lb-dims">
                      {lbModel.dims.map((d, i) => (
                        <div key={i} className="lb-dim-row">
                          <span className="lb-dim-label">{tx(d.label, lang)}</span>
                          <span className="lb-dim-value">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lightbox-panel-right">
                  <p className="lb-section-title">
                    {lang === "me" ? "Karakteristike" : lang === "tr" ? "Ürün Özellikleri" : "Features"}
                  </p>
                  <div className="lb-features">
                    {FEATURES.map((f, i) => (
                      <span key={i} className="lb-feature">{tx(f, lang)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lightbox-sidebar">
              <div className="lightbox-thumbs" ref={thumbsRef}>
                {lbModel.variants.map((v, i) => (
                  <div key={i} className={`lightbox-thumb${i === lbVariantIdx ? " active" : ""}`} onClick={() => setLbVariantIdx(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.img} alt={v.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {backTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
          ↑
        </button>
      )}
    </>
  );
}
