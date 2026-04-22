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

const SPECS: { label: Txt; value: Txt }[] = [
  { label: { tr: "Kalınlık",          me: "Debljina",          en: "Thickness"       }, value: { tr: "5 / 8 / 10 mm",         me: "5 / 8 / 10 mm",         en: "5 / 8 / 10 mm"         } },
  { label: { tr: "Genişlik",          me: "Širina",            en: "Width"           }, value: { tr: "25 / 37,5 / 100 cm",    me: "25 / 37,5 / 100 cm",    en: "25 / 37.5 / 100 cm"    } },
  { label: { tr: "Uzunluk",           me: "Dužina",            en: "Length"          }, value: { tr: "260 / 280 / 300 cm",    me: "260 / 280 / 300 cm",    en: "260 / 280 / 300 cm"    } },
  { label: { tr: "Ağırlık",           me: "Težina",            en: "Weight"          }, value: { tr: "1,2 – 2,5 kg/m²",      me: "1,2 – 2,5 kg/m²",      en: "1.2 – 2.5 kg/m²"       } },
  { label: { tr: "Sıcaklık Aralığı", me: "Temp. Opseg",       en: "Temp. Range"     }, value: { tr: "-30°C — +60°C",         me: "-30°C — +60°C",         en: "-30°C — +60°C"          } },
  { label: { tr: "Su Geçirmezlik",   me: "Vodootpornost",     en: "Waterproof"      }, value: { tr: "100%",                  me: "100%",                  en: "100%"                   } },
  { label: { tr: "Yangın Sınıfı",    me: "Klasa Požarnosti",  en: "Fire Class"      }, value: { tr: "B-s1, d0",             me: "B-s1, d0",             en: "B-s1, d0"               } },
  { label: { tr: "UV Dayanımı",      me: "UV Otpornost",      en: "UV Resistance"   }, value: { tr: "Evet",                 me: "Da",                    en: "Yes"                    } },
  { label: { tr: "Antibakteriyal",   me: "Antibakterijski",   en: "Antibacterial"   }, value: { tr: "Evet",                 me: "Da",                    en: "Yes"                    } },
  { label: { tr: "Garanti",          me: "Garancija",         en: "Warranty"        }, value: { tr: "10 Yıl",              me: "10 Godina",              en: "10 Years"               } },
];

type AdvItem = { icon: ReactNode; title: Txt; text: Txt };
const ADVANTAGES: AdvItem[] = [
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "100% Vodootporni",          tr: "100% Su Geçirmez",        en: "100% Waterproof"           },
    text:  { me: "Potpuno otporni na vlagu i vodu. Savršeni za kupatila, kuhinje, SPA i sve vlažne prostorije bez straha od buđi i vlage.", tr: "Neme ve suya tamamen dayanıklı. Küf korkusu olmadan banyo, mutfak, SPA ve tüm ıslak mekanlar için ideal.", en: "Completely resistant to moisture and water. Perfect for bathrooms, kitchens, SPA and all wet areas without fear of mold." },
  },
  {
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Laka Montaža",              tr: "Kolay Montaj",            en: "Easy Installation"         },
    text:  { me: "Montira se direktno na zid bez lomljenja, rušenja ili prašine. Jedan majstor završava prostoriju za jedan dan.", tr: "Kırma ve toz çıkarmadan doğrudan duvara montaj. Tek usta bir günde mekanı tamamlar.", en: "Installs directly on the wall without demolition or dust. One worker completes a room in one day." },
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { me: "Jednostavno Održavanje",    tr: "Kolay Bakım",             en: "Easy Maintenance"          },
    text:  { me: "Čisti se vlažnom krpom ili blagim deterdžentom. Nema fugni ni pukotina gdje se skuplja nečistoća.", tr: "Nemli bez veya hafif deterjanla temizlenir. Kir biriken derz veya çatlak yok.", en: "Clean with a damp cloth or mild detergent. No grout or cracks where dirt accumulates." },
  },
  {
    icon: <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" /><path d="M8 12l3-6 3 6M9 10h4" strokeLinecap="round" /></>,
    title: { me: "Antibakterijski",           tr: "Antibakteriyal",          en: "Antibacterial"             },
    text:  { me: "Specijalni premaz inhibira rast bakterija i plijesni. Higijenska površina, idealna za kuhinje i kupatila.", tr: "Özel kaplama bakteri ve küf büyümesini engeller. Mutfak ve banyolar için ideal hijyenik yüzey.", en: "Special coating inhibits bacteria and mold growth. Hygienic surface, ideal for kitchens and bathrooms." },
  },
  {
    icon: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /></>,
    title: { me: "UV Otpornost",              tr: "UV Dayanımı",             en: "UV Resistant"              },
    text:  { me: "Boja i sjaj ostaju nepromijenjeni godinama, čak i na direktnoj sunčevoj svjetlosti. Nema žutila ni blijeđenja.", tr: "Renk ve parlaklık doğrudan güneşe rağmen yıllarca değişmez. Sararma ve solma yok.", en: "Color and gloss remain unchanged for years, even in direct sunlight. No yellowing or fading." },
  },
  {
    icon: <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Vatrootpornost B Klase",    tr: "B Sınıfı Yangın Dayanımı",en: "Class B Fire Resistance"  },
    text:  { me: "Sertifikovana B-s1, d0 klasa vatrootpornosti. Ispunjava sve EU građevinske standarde i propise o sigurnosti.", tr: "Sertifikalı B-s1, d0 yangın dayanım sınıfı. Tüm AB yapı standartlarını ve güvenlik yönetmeliklerini karşılar.", en: "Certified B-s1, d0 fire resistance class. Meets all EU building standards and safety regulations." },
  },
  {
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" strokeLinecap="round" /></>,
    title: { me: "Termička Izolacija",        tr: "Isı Yalıtımı",            en: "Thermal Insulation"        },
    text:  { me: "Poboljšava izolaciju prostora i smanjuje gubitke toplote. Niski koeficijent toplinske provodljivosti.", tr: "Mekanın yalıtımını iyileştirir ve ısı kayıplarını azaltır. Düşük ısıl iletkenlik katsayısı.", en: "Improves room insulation and reduces heat loss. Low thermal conductivity coefficient." },
  },
  {
    icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    title: { me: "200+ Dezena i Boja",        tr: "200+ Desen ve Renk",      en: "200+ Patterns & Colors"    },
    text:  { me: "Mermer, kamen, drvo, beton i solidne boje — naša kolekcija nudi rješenje za svaki enterijer i stil.", tr: "Mermer, taş, ahşap, beton ve düz renkler — koleksiyonumuz her iç mekan ve stil için çözüm sunar.", en: "Marble, stone, wood, concrete and solid colors — our collection offers a solution for every interior and style." },
  },
];

const MODELS = [
  { name: "Bianco Carrara",    code: "PVC-01", img: "/pvc-bianco-carrara.jpg"       },
  { name: "Arabescato Brown",  code: "PVC-02", img: "/pvc-Arebescato-Brown.jpg"     },
  { name: "Carrara Gold",      code: "PVC-03", img: "/pvc-Carrara-Gold.jpeg"        },
  { name: "Marmori Grey",      code: "PVC-04", img: "/pvc-Marmori-Grey.jpg"         },
  { name: "Nero Black",        code: "PVC-05", img: "/pvc-Nero-Black.jpg"           },
  { name: "Onyx Green",        code: "PVC-06", img: "/pvc-Onyx-Green.jpg"           },
  { name: "Picasso",           code: "PVC-07", img: "/pvc-Picasso.jpg"              },
  { name: "Sahara Black",      code: "PVC-08", img: "/pvc-Sahara-Black.jpg"         },
  { name: "Sahara White",      code: "PVC-09", img: "/pvc-Sahara-White.jpg"         },
  { name: "Vanilla",           code: "PVC-10", img: "/pvc-Vanilla.jpg"              },
  { name: "Viola",             code: "PVC-11", img: "/pvc-Viola.jpg"                },
  { name: "Anthracite Gray",   code: "PVC-12", img: "/pvc-ANTHRACITHE-GRAY.jpg"     },
  { name: "Alu Gray",          code: "PVC-13", img: "/pvc-Alu-Gray.jpg"             },
  { name: "Bolzano Bej",       code: "PVC-14", img: "/pvc-BOLZANO-BEJ.jpg"          },
  { name: "Blue Nile",         code: "PVC-15", img: "/pvc-Blue-Nile.jpg"            },
  { name: "Calacatta Gold",    code: "PVC-16", img: "/pvc-CALACATTA-GOLD.jpg"       },
  { name: "New Carrara Gold",  code: "PVC-17", img: "/pvc-NEW-CARRARA-GOLD.jpg"     },
  { name: "Solid White",       code: "PVC-18", img: "/pvc-Solid-White.jpg"          },
];

const DIMS: { label: Txt; value: string }[] = [
  { label: { me: "Širina",    tr: "Genişlik",  en: "Width"     }, value: "122 cm" },
  { label: { me: "Dužina",    tr: "Uzunluk",   en: "Length"    }, value: "280 cm" },
  { label: { me: "Debljina",  tr: "Kalınlık",  en: "Thickness" }, value: "2,8 mm" },
];

const FEATURES: Txt[] = [
  { me: "Antibakterijski",          tr: "Antibakteriyel",              en: "Antibacterial"          },
  { me: "Vodootporan",              tr: "Su geçirmez",                 en: "Waterproof"             },
  { me: "Laka primjena",            tr: "Kolay uygulanabilir",         en: "Easy to apply"          },
  { me: "Sjajna površina",          tr: "Parlak yüzey",                en: "Glossy surface"         },
  { me: "Lagan",                    tr: "Hafif",                       en: "Lightweight"            },
  { me: "Fleksibilan",              tr: "Esnek",                       en: "Flexible"               },
  { me: "Tanak i elegantan",        tr: "İnce ve zarif",               en: "Slim and elegant"       },
  { me: "Nezapaljiv",               tr: "Alev almaz",                  en: "Flame retardant"        },
  { me: "Višenamjenski",            tr: "Çok yönlü kullanım alanı",    en: "Versatile"              },
  { me: "Visokotehnološki proizvod",tr: "Yüksek teknoloji ürünü",      en: "High-tech product"      },
  { me: "Najbolji u svojoj klasi",  tr: "Sınıfının en kalitelisi",     en: "Best in class"          },
];

const USAGE_TAGS: Txt[] = [
  { me: "Kupatilo",     tr: "Banyo",         en: "Bathroom"    },
  { me: "Kuhinja",      tr: "Mutfak",        en: "Kitchen"     },
  { me: "Dnevna Soba",  tr: "Oturma Odası",  en: "Living Room" },
  { me: "Hotel",        tr: "Otel",          en: "Hotel"       },
  { me: "Kancelarija",  tr: "Ofis",          en: "Office"      },
  { me: "Restoran",     tr: "Restoran",      en: "Restaurant"  },
];

export default function PvcPanelPage() {
  const [lang, setLang] = useState<Lang>("me");
  const [scrolled, setScrolled] = useState(false);
  const [backTop, setBackTop] = useState(false);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setLbIndex(i => (i - 1 + MODELS.length) % MODELS.length);
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  setLbIndex(i => (i + 1) % MODELS.length);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setLbIndex(i => (i + (e.deltaY > 0 ? 1 : -1) + MODELS.length) % MODELS.length);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
    };
  }, [lbOpen]);

  useEffect(() => {
    const el = thumbsRef.current?.children[lbIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [lbIndex]);

  function openLb(index: number) { setLbIndex(index); setLbOpen(true); document.body.style.overflow = "hidden"; }
  function closeLb() { setLbOpen(false); document.body.style.overflow = ""; }

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
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
            {lang === "me" ? "PVC Paneli" : lang === "tr" ? "PVC Paneller" : "PVC Panels"}
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
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&q=80')" }}
        />
        <div className="pp-hero-overlay" />
        <div className="pp-hero-content">
          <p className="pp-hero-category">
            {lang === "me" ? "— Kolekcija 2026 —" : lang === "tr" ? "— Koleksiyon 2026 —" : "— Collection 2026 —"}
          </p>
          <h1 className="pp-hero-title">
            {lang === "me" ? <>PVC <em>Zidni Paneli</em></>
             : lang === "tr" ? <>PVC <em>Duvar Panelleri</em></>
             : <>PVC <em>Wall Panels</em></>}
          </h1>
          <p className="pp-hero-sub">
            {lang === "me" ? "Vodootpornost · Estetika · Laka Montaža"
             : lang === "tr" ? "Su Geçirmezlik · Estetik · Kolay Montaj"
             : "Waterproof · Aesthetics · Easy Installation"}
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
            {lang === "me" ? <>Šta je <em>PVC Panel</em>?</>
             : lang === "tr" ? <>PVC Panel <em>Nedir</em>?</>
             : <>What is a <em>PVC Panel</em>?</>}
          </h2>
          <p className="pp-intro-para">
            {lang === "me"
              ? "PVC (Polivinilhlorid) panel je visokokvalitetna obloga za zidove i plafone, izrađena od sintetičkog polimera koji je iznimno otporan na vlagu, udarce i habanje. Zahvaljujući naprednim tehnologijama štampanja, PVC paneli savršeno imitiraju izgled prirodnih materijala — mermera, kamena, drveta i betona."
              : lang === "tr"
              ? "PVC (Polivinil Klorür) panel, duvar ve tavan kaplaması için yüksek kaliteli bir malzemedir; neme, darbe ve aşınmaya son derece dayanıklı sentetik polimerden üretilir. Gelişmiş baskı teknolojileri sayesinde mermer, taş, ahşap ve beton gibi doğal malzemelerin görünümünü mükemmel biçimde taklit eder."
              : "PVC (Polyvinyl Chloride) panel is a high-quality cladding for walls and ceilings, made from a synthetic polymer extremely resistant to moisture, impacts and wear. Thanks to advanced printing technologies, PVC panels perfectly imitate the appearance of natural materials — marble, stone, wood and concrete."}
          </p>
          <p className="pp-intro-para">
            {lang === "me"
              ? "Posebno su pogodni za vlažne prostorije poput kupatila i kuhinja, ali se jednako dobro uklapaju u dnevne sobe, poslovne prostore, hotele i restorane. Montiraju se direktno na postojeće površine bez lomljenja ili rušenja, što drastično smanjuje troškove i trajanje renoviranja."
              : lang === "tr"
              ? "Özellikle banyo ve mutfak gibi ıslak mekanlara uygun olmakla birlikte oturma odaları, ofisler, oteller ve restoranlar için de aynı derecede uygundur. Kırma veya yıkım olmadan mevcut yüzeylere doğrudan monte edilir; bu tadilat maliyetlerini ve süresini önemli ölçüde azaltır."
              : "Especially suited for wet rooms like bathrooms and kitchens, but also perfect for living rooms, offices, hotels and restaurants. They install directly on existing surfaces without demolition, drastically reducing renovation costs and duration."}
          </p>
          <div className="pp-usage-list">
            {USAGE_TAGS.map((tag, i) => (
              <span key={i} className="pp-usage-tag">{tx(tag, lang)}</span>
            ))}
          </div>
        </div>
        <div className="pp-intro-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600566753376-12c8ab7a5a0c?w=1200&q=80"
            alt="PVC Panel"
            loading="lazy"
          />
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
              {lang === "me" ? "Naši PVC Modeli" : lang === "tr" ? "PVC Model Koleksiyonumuz" : "Our PVC Models"}
            </h2>
          </div>
          <p className="section-desc">
            {lang === "me" ? "Odaberite iz naše bogate kolekcije dezena i tekstura."
             : lang === "tr" ? "Zengin desen ve doku koleksiyonumuzdan seçin."
             : "Choose from our rich collection of patterns and textures."}
          </p>
        </div>
        <div className="catalog-grid">
          {MODELS.map((m, i) => (
            <div key={i} className={`catalog-item reveal reveal-delay-${(i % 4) + 1}`} onClick={() => openLb(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt={m.name} loading="lazy" />
              <div className="catalog-accent" />
              <div className="catalog-label">
                <p className="catalog-item-name">{m.name}</p>
                <p className="catalog-item-code">{m.code}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECHNICAL SPECS */}
      <section className="pp-specs">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Tehničke Specifikacije" : lang === "tr" ? "Teknik Özellikler" : "Technical Specifications"}
            </p>
            <h2 className="section-title">
              {lang === "me" ? "Dimenzije i Karakteristike"
               : lang === "tr" ? "Boyutlar ve Özellikler"
               : "Dimensions & Properties"}
            </h2>
          </div>
          <p className="section-desc">
            {lang === "me" ? "Sve tehničke karakteristike PVC panela iz naše kolekcije."
             : lang === "tr" ? "Koleksiyonumuzdaki PVC panellerin tüm teknik özellikleri."
             : "All technical specifications of PVC panels from our collection."}
          </p>
        </div>
        <div className="specs-grid reveal">
          {SPECS.map((s, i) => (
            <div key={i} className="spec-row">
              <span className="spec-label">{tx(s.label, lang)}</span>
              <span className="spec-divider" />
              <span className="spec-value">{tx(s.value, lang)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="features">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Zašto PVC Panel" : lang === "tr" ? "Neden PVC Panel" : "Why PVC Panel"}
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
            {lang === "me" ? <>Zainteresovani Za <em>PVC Panele</em>?</>
             : lang === "tr" ? <><em>PVC Paneller</em> İlginizi Çekiyor mu?</>
             : <>Interested in <em>PVC Panels</em>?</>}
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
              { l: { tr: "Telefon", me: "Telefon", en: "Phone" } as Txt,        v: "+382 68 361 700",  href: "tel:+38268361700"      },
              { l: { tr: "E-posta", me: "Email",   en: "Email" } as Txt,        v: "info@baudecor.me", href: "mailto:info@baudecor.me" },
              { l: { tr: "Adres",   me: "Adresa",  en: "Address" } as Txt,      v: "Bratica bb, Ulcinj", href: undefined              },
              { l: { tr: "Çalışma Saatleri", me: "Radno Vrijeme", en: "Working Hours" } as Txt, v: "08:30 — 17:30", href: undefined  },
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
      <div className={`lightbox${lbOpen ? " open" : ""}`}>
        <div className="lightbox-topbar">
          <span className="lightbox-counter">{lbIndex + 1} / {MODELS.length}</span>
          <button className="lightbox-close" onClick={closeLb}>✕</button>
        </div>

        {/* Image area */}
        <div className="lightbox-image-area" onClick={(e) => { if (e.target === e.currentTarget) closeLb(); }}>
          <button className="lightbox-arrow prev" onClick={() => setLbIndex(i => (i - 1 + MODELS.length) % MODELS.length)}>‹</button>
          <div className="lightbox-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={lbIndex} className="lightbox-img" src={MODELS[lbIndex].img} alt={MODELS[lbIndex].name} />
          </div>
          <button className="lightbox-arrow next" onClick={() => setLbIndex(i => (i + 1) % MODELS.length)}>›</button>
        </div>

        {/* Info panel */}
        <div className="lightbox-panel">
          {/* Model adı — tam genişlik, kolonların dışında */}
          <div className="lb-model-header">
            <p className="lb-model-name">{MODELS[lbIndex].name}</p>
            <p className="lb-model-code">{MODELS[lbIndex].code}</p>
          </div>
          <div className="lb-divider" />

          <div className="lightbox-panel-cols">
            {/* Sol: ölçüler */}
            <div className="lightbox-panel-left">
              <p className="lb-section-title">
                {lang === "me" ? "Dimenzije" : lang === "tr" ? "Ölçüler" : "Dimensions"}
              </p>
              <div className="lb-dims">
                {DIMS.map((d, i) => (
                  <div key={i} className="lb-dim-row">
                    <span className="lb-dim-label">{tx(d.label, lang)}</span>
                    <span className="lb-dim-value">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: özellikler */}
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

        {/* Right sidebar thumbnails */}
        <div className="lightbox-sidebar">
          <div className="lightbox-thumbs" ref={thumbsRef}>
            {MODELS.map((m, i) => (
              <div key={i} className={`lightbox-thumb${i === lbIndex ? " active" : ""}`} onClick={() => setLbIndex(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {backTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
          ↑
        </button>
      )}
    </>
  );
}
