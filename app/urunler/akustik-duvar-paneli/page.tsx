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
    title: { tr: "Üstün Ses Yutma",          me: "Izvrsna Apsorpcija Zvuka",    en: "Superior Sound Absorption"     },
    text:  { tr: "Yüksek NRC değeriyle sesi etkin biçimde emer; yankı ve gürültüyü minimize eder.", me: "Visoka NRC vrijednost — efikasno apsorbuje zvuk, minimizira odjek i buku.", en: "High NRC value effectively absorbs sound, minimising echo and noise." },
  },
  {
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Kolay Montaj",              me: "Laka Montaža",                en: "Easy Installation"             },
    text:  { tr: "Kırma veya yıkım olmadan doğrudan duvara monte edilir. Tek usta minimum maliyetle bir günde odayı tamamlar.", me: "Montira se direktno bez lomljenja. Jedan majstor završava prostoriju za jedan dan.", en: "Installs directly without demolition. One worker completes a room in one day." },
  },
  {
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" strokeLinecap="round" /></>,
    title: { tr: "Estetik Tasarım",           me: "Estetski Dizajn",             en: "Aesthetic Design"              },
    text:  { tr: "Modern ve özgün geometrik formlar mekana hem akustik konfor hem de görsel zarafet katar.", me: "Moderni geometrijski oblici pružaju akustički komfor i vizualnu eleganciju.", en: "Modern geometric forms add acoustic comfort and visual elegance to spaces." },
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { tr: "Çevre Dostu Malzeme",       me: "Ekološki Materijal",          en: "Eco-Friendly Material"         },
    text:  { tr: "Doğal ve geri dönüştürülebilir hammaddelerden üretilir. Avrupa ekoloji standartlarını karşılar.", me: "Proizveden od prirodnih i reciklabilnih materijala. Ispunjava evropske ekološke standarde.", en: "Made from natural and recyclable raw materials. Meets European ecological standards." },
  },
  {
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" /></>,
    title: { tr: "Geniş Kullanım Alanı",      me: "Široka Primjena",             en: "Wide Application"              },
    text:  { tr: "Ofis, konferans salonu, stüdyo, restoran ve konut projelerinde profesyonel akustik çözüm.", me: "Profesionalno akustično rješenje za kancelarije, studije, restorane i stambene prostore.", en: "Professional acoustic solution for offices, studios, restaurants and residential projects." },
  },
  {
    icon: <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Isı Yalıtımı",              me: "Toplotna Izolacija",          en: "Thermal Insulation"            },
    text:  { tr: "Akustik özelliklerinin yanı sıra ısı yalıtımına da katkı sağlar. Enerji tasarrufu ve konfor.", me: "Pored akustike, doprinosi i toplinskoj izolaciji. Ušteda energije i komfor.", en: "In addition to acoustics, contributes to thermal insulation. Energy saving and comfort." },
  },
  {
    icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8M12 17v4" strokeLinecap="round" /></>,
    title: { tr: "Hafif ve Dayanıklı",         me: "Lagan i Izdržljiv",           en: "Lightweight & Durable"         },
    text:  { tr: "Düşük ağırlığıyla taşıma ve montajı kolaylaştırır. Uzun yıllar boyunca şeklini ve rengini korur.", me: "Mala težina olakšava transport i montažu. Zadržava oblik i boju godinama.", en: "Low weight facilitates transport and installation. Retains shape and colour for years." },
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" /></>,
    title: { tr: "Hızlı Proje Teslimi",        me: "Brza Isporuka Projekta",      en: "Fast Project Delivery"         },
    text:  { tr: "Stok ürün avantajıyla kısa teslim süresi. Proje takviminizi riske atmadan hızlıca teslim.", me: "Kratki rokovi isporuke zahvaljujući stok artiklima. Brza realizacija bez ugrožavanja rasporeda.", en: "Short delivery times thanks to stock items. Fast completion without compromising the schedule." },
  },
];

type AkVariant = { color: string; img: string };
type AkModel   = {
  name: Txt;
  cover: string;
  infoImg: string;
  desc: Txt;
  dims: { label: Txt; value: string }[];
  variants: AkVariant[];
  gallery: string[];
  teknikPdf: string;
};

const AK_MODELS: AkModel[] = [
  {
    name:    { tr: "Akustik Panel",        me: "Akustični Panel",         en: "Acoustic Panel"        },
    cover:   "",
    infoImg: "",
    desc:    { tr: "", me: "", en: "" },
    dims:    [],
    variants: [],
    gallery:  [],
    teknikPdf: "",
  },
  {
    name:    { tr: "Akustik Petek Panel",  me: "Akustični Saćasti Panel", en: "Acoustic Honeycomb Panel" },
    cover:   "",
    infoImg: "",
    desc:    { tr: "", me: "", en: "" },
    dims:    [],
    variants: [],
    gallery:  [],
    teknikPdf: "",
  },
  {
    name:    { tr: "Akustik Kare Panel",   me: "Akustični Kvadratni Panel", en: "Acoustic Square Panel" },
    cover:   "",
    infoImg: "",
    desc:    { tr: "", me: "", en: "" },
    dims:    [],
    variants: [],
    gallery:  [],
    teknikPdf: "",
  },
  {
    name:    { tr: "Tuğla Akustik Panel",  me: "Akustični Panel od Cigle", en: "Brick Acoustic Panel" },
    cover:   "",
    infoImg: "",
    desc:    { tr: "", me: "", en: "" },
    dims:    [],
    variants: [],
    gallery:  [],
    teknikPdf: "",
  },
];

const USAGE_TAGS: Txt[] = [
  { tr: "Ofis",              me: "Kancelarija",   en: "Office"          },
  { tr: "Konferans Salonu",  me: "Konferencijska Sala", en: "Conference Room" },
  { tr: "Müzik Stüdyosu",   me: "Muzički Studio", en: "Music Studio"   },
  { tr: "Restoran",          me: "Restoran",       en: "Restaurant"     },
  { tr: "Oturma Odası",      me: "Dnevna Soba",    en: "Living Room"    },
  { tr: "Otel",              me: "Hotel",          en: "Hotel"          },
  { tr: "Yatak Odası",       me: "Spavaća Soba",   en: "Bedroom"        },
  { tr: "Eğitim Merkezi",    me: "Obrazovni Centar", en: "Training Center" },
];

export default function AkustikPage() {
  const [lang, setLang]               = useState<Lang>("me");
  const [scrolled, setScrolled]       = useState(false);
  const [backTop, setBackTop]         = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [selectedModel, setSelectedModel] = useState(0);
  const [lbOpen, setLbOpen]           = useState(false);
  const [lbIndex, setLbIndex]         = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.zoom = "0.8";
    return () => { document.body.style.zoom = ""; };
  }, []);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 80); setBackTop(window.scrollY > 600); };
    window.addEventListener("scroll", onScroll);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  useEffect(() => {
    if (thumbsRef.current) {
      const active = thumbsRef.current.querySelector(".lightbox-thumb.active") as HTMLElement | null;
      active?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [lbIndex]);

  function openLb(vi: number) {
    const m = AK_MODELS[selectedModel];
    if (!m.variants.length) return;
    setLbIndex(vi);
    setLbOpen(true);
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    setLbOpen(false);
    document.body.style.overflow = "";
  }

  const m = AK_MODELS[selectedModel];

  return (
    <>
      <style>{`body{zoom:0.8}`}</style>

      {/* NAVBAR */}
      <nav className="navbar" style={{ zoom: 1.25 }}>
        <Link href="/" className="logo-btn" aria-label="Baudecor">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Baudecor" height={64} style={{ height: 64, width: "auto", display: "block" }} />
        </Link>
        <div className="pp-breadcrumb-nav">
          <Link href="/" className="pp-breadcrumb-link">
            {lang === "me" ? "Početna" : lang === "tr" ? "Ana Sayfa" : "Home"}
          </Link>
          <span className="pp-breadcrumb-sep">›</span>
          <span className="pp-breadcrumb-current">
            {lang === "me" ? "Akustični Paneli" : lang === "tr" ? "Akustik Duvar Paneli" : "Acoustic Wall Panels"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
          <div className="lang-toggle">
            {LANGS.map((l) => (
              <button key={l.code} className={`lang-btn${lang === l.code ? " active" : ""}`} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          <a href="tel:+38268361700" className="nav-cta">+382 68 361 700</a>
          <button className={`mobile-toggle${menuOpen ? " active" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          {lang === "me" ? "← Početna" : lang === "tr" ? "← Ana Sayfa" : "← Home"}
        </Link>
      </div>

      {/* HERO */}
      <section className="pp-hero" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1a1a 100%)" }}>
        <div className="pp-hero-content">
          <p className="pp-hero-label">
            {lang === "me" ? "Akustični Zidni Paneli" : lang === "tr" ? "Akustik Duvar Panelleri" : "Acoustic Wall Panels"}
          </p>
          <h1 className="pp-hero-title">
            {lang === "me" ? <>Savršen <em>Zvuk</em> i Estetika</> : lang === "tr" ? <>Mükemmel <em>Akustik</em> ve Estetik</> : <>Perfect <em>Acoustics</em> & Aesthetics</>}
          </h1>
          <p className="pp-hero-desc">
            {lang === "me"
              ? "Profesionalna akustična rješenja koja transformišu svaki prostor — od studija do kancelarija i stambenih enterijera."
              : lang === "tr"
              ? "Her mekânı dönüştüren profesyonel akustik çözümler — stüdyolardan ofislere ve konut iç mekânlarına."
              : "Professional acoustic solutions that transform every space — from studios to offices and residential interiors."}
          </p>
          <div className="pp-hero-actions">
            <a href="#models" className="btn-primary">
              {lang === "me" ? "Pogledaj Modele" : lang === "tr" ? "Modelleri Gör" : "View Models"}
            </a>
            <a href="tel:+38268361700" className="btn-outline">
              {lang === "me" ? "Pozovite Nas" : lang === "tr" ? "Bizi Arayın" : "Call Us"}
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="pp-intro">
        <div className="pp-intro-text">
          <p className="section-label">
            {lang === "me" ? "Šta je Akustični Panel" : lang === "tr" ? "Akustik Panel Nedir" : "What is Acoustic Panel"}
          </p>
          <h2 className="pp-intro-title">
            {lang === "me" ? "Komfor Zvuka, Ljepota Prostora" : lang === "tr" ? "Ses Konforu, Mekan Güzelliği" : "Sound Comfort, Space Beauty"}
          </h2>
          <p className="pp-intro-desc">
            {lang === "me"
              ? "Akustični zidni paneli su specijalizovana rješenja koja kombinuju vrhunsku zvučnu apsorpciju s modernim estetskim dizajnom. Savršeni su za prostore gdje je kontrola zvuka od presudne važnosti — konferencijske sale, muzičke studije, restorani, kancelarije i stambeni prostori dobijaju novi nivo komfora i stila."
              : lang === "tr"
              ? "Akustik duvar panelleri, üstün ses yutma özelliğini modern estetik tasarımla birleştiren uzman çözümlerdir. Ses kontrolünün kritik önem taşıdığı mekânlar için idealdir — konferans salonları, müzik stüdyoları, restoranlar, ofisler ve konut alanları yeni bir konfor ve stil boyutuna kavuşur."
              : "Acoustic wall panels are specialised solutions combining superior sound absorption with modern aesthetic design. Perfect for spaces where sound control is critical — conference rooms, music studios, restaurants, offices and residential spaces gain a new level of comfort and style."}
          </p>
          <div className="pp-usage-list">
            {USAGE_TAGS.map((tag, i) => (
              <span key={i} className="pp-usage-tag">{tx(tag, lang)}</span>
            ))}
          </div>
        </div>
        <div className="pp-intro-single-image" style={{ minHeight: 400 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80" alt="Akustik Panel" loading="lazy" />
        </div>
      </section>

      {/* MODELS */}
      <section id="models" className="pp-models">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Kolekcija Modela" : lang === "tr" ? "Model Koleksiyonu" : "Model Collection"}
            </p>
            <h2 className="section-title">
              {lang === "me" ? "Akustični Paneli" : lang === "tr" ? "Akustik Paneller" : "Acoustic Panels"}
            </h2>
          </div>
        </div>

        {/* Model tabs */}
        <div className="ak-model-tabs">
          {AK_MODELS.map((model, i) => (
            <button
              key={i}
              className={`ak-model-tab${selectedModel === i ? " active" : ""}`}
              onClick={() => setSelectedModel(i)}
            >
              {tx(model.name, lang)}
            </button>
          ))}
        </div>

        {/* Model detail */}
        <div className="mod-detail-panel">
          <div className="mod-detail-img">
            {m.infoImg ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={m.infoImg} alt={tx(m.name, lang)} />
            ) : (
              <div className="pp-intro-placeholder" />
            )}
          </div>
          <div className="mod-detail-info">
            <h2 className="mod-detail-name">{tx(m.name, lang)}</h2>
            {m.desc.tr && <p className="mod-detail-desc">{tx(m.desc, lang)}</p>}

            {m.dims.length > 0 && (
              <div className="mod-detail-dims">
                {m.dims.map((d, di) => (
                  <div key={di} className="mod-detail-dim-row">
                    <span className="mod-detail-dim-label">{tx(d.label, lang)}</span>
                    <span className="mod-detail-dim-value">{d.value}</span>
                  </div>
                ))}
              </div>
            )}

            {m.variants.length > 0 && (
              <div className="mod-detail-colors">
                <p className="mod-detail-colors-label">
                  {lang === "me" ? "Boje" : lang === "tr" ? "Renkler" : "Colors"}
                </p>
                <div className="mod-detail-swatches">
                  {m.variants.map((v, vi) => (
                    <div key={vi} className="mod-detail-swatch" onClick={() => openLb(vi)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v.img} alt={v.color} />
                      <span>{v.color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mod-detail-actions">
              {m.teknikPdf && (
                <a href={m.teknikPdf} target="_blank" rel="noopener noreferrer" className="mod-detail-action-card">
                  <div>
                    <p className="mod-detail-action-title">
                      {lang === "me" ? "Tehnički List" : lang === "tr" ? "Teknik Çizim" : "Technical Sheet"}
                    </p>
                    <p className="mod-detail-action-sub">PDF</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={22} height={22}>
                    <path d="M12 16V4M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 20h16" strokeLinecap="round" />
                  </svg>
                </a>
              )}
              <a href="tel:+38268361700" className="mod-detail-action-card">
                <div>
                  <p className="mod-detail-action-title">
                    {lang === "me" ? "Pozovite Nas" : lang === "tr" ? "Bizi Arayın" : "Call Us"}
                  </p>
                  <p className="mod-detail-action-sub">+382 68 361 700</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={22} height={22}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {m.gallery.length > 0 && (
          <>
            <div className="mod-gallery-header">
              <p className="mod-gallery-title">
                {lang === "me" ? "Galerija" : lang === "tr" ? "Galeri" : "Gallery"}
              </p>
            </div>
            <div className="mod-gallery">
              {m.gallery.map((src, i) => (
                <div key={i} className="mod-gallery-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${tx(m.name, lang)} ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ADVANTAGES */}
      <section className="features">
        <div className="section-header reveal">
          <div>
            <p className="section-label">
              {lang === "me" ? "Zašto Akustični Panel" : lang === "tr" ? "Neden Akustik Panel" : "Why Acoustic Panel"}
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
            {lang === "me" ? <>Zainteresovani Za <em>Akustične Panele</em>?</>
             : lang === "tr" ? <><em>Akustik Paneller</em> İlginizi Çekiyor mu?</>
             : <>Interested in <em>Acoustic Panels</em>?</>}
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
              { l: { tr: "Telefon", me: "Telefon", en: "Phone" }   as Txt, v: "+382 68 361 700",    href: "tel:+38268361700"        },
              { l: { tr: "E-posta", me: "Email",   en: "Email" }   as Txt, v: "info@baudecor.me",   href: "mailto:info@baudecor.me" },
              { l: { tr: "Adres",   me: "Adresa",  en: "Address" } as Txt, v: "Bratica bb, Ulcinj",  href: undefined                },
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
      {lbOpen && m.variants.length > 0 && (
        <div className={`lightbox lightbox--mod open`}>
          <div className="lightbox-topbar">
            <span className="lightbox-counter">{lbIndex + 1} / {m.variants.length}</span>
            <button className="lightbox-close" onClick={closeLb}>✕</button>
          </div>
          <div className="lightbox-image-area" onClick={(e) => { if (e.target === e.currentTarget) closeLb(); }}>
            <button className="lightbox-arrow prev" onClick={() => setLbIndex((i) => (i - 1 + m.variants.length) % m.variants.length)}>‹</button>
            <div className="lightbox-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={lbIndex} className="lightbox-img" src={m.variants[lbIndex].img} alt={m.variants[lbIndex].color} />
            </div>
            <button className="lightbox-arrow next" onClick={() => setLbIndex((i) => (i + 1) % m.variants.length)}>›</button>
          </div>
          <div className="lightbox-panel">
            <div className="lightbox-panel-cols">
              <div className="lightbox-panel-left">
                <div>
                  <p className="lb-model-name">{m.variants[lbIndex].color}</p>
                  <p className="lb-model-code">{tx(m.name, lang)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lightbox-sidebar">
            <div className="lightbox-thumbs" ref={thumbsRef}>
              {m.variants.map((v, i) => (
                <div key={i} className={`lightbox-thumb${i === lbIndex ? " active" : ""}`} onClick={() => setLbIndex(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.img} alt={v.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {backTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
      )}
    </>
  );
}
