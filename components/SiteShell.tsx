"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { type Lang, tx } from "@/lib/i18n";

type FeatureItem = {
  icon: ReactNode;
  title: { tr: string; me: string; en: string };
  text:  { tr: string; me: string; en: string };
};

const MARQUEE_ITEMS = ["PVC Paneli", "MDF Paneli", "Modularni Paneli", "Akustični Paneli", "Tapete", "SPC Paneli", "Besplatna Dostava", "Kupovina na Rate"];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80", label: { tr: "Oturma Odası", me: "Dnevna Soba",   en: "Living Room"  }, sub: { tr: "MDF Paneli", me: "MDF Paneli", en: "MDF Panels" } },
  { src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80", label: { tr: "Banyo",        me: "Kupatilo",      en: "Bathroom"     }, sub: { tr: "PVC Paneli", me: "PVC Paneli", en: "PVC Panels" } },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", label: { tr: "Mutfak",       me: "Kuhinja",       en: "Kitchen"      }, sub: { tr: "PVC Paneli", me: "PVC Paneli", en: "PVC Panels" } },
  { src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", label: { tr: "Yatak Odası", me: "Spavaća Soba", en: "Bedroom"      }, sub: { tr: "MDF Paneli", me: "MDF Paneli", en: "MDF Panels" } },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", label: { tr: "Ofis",        me: "Kancelarija",   en: "Office"       }, sub: { tr: "Akustik Paneller", me: "Akustični Paneli", en: "Acoustic Panels" } },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", label: { tr: "Restoran",    me: "Restoran",      en: "Restaurant"   }, sub: { tr: "Modüler Paneller", me: "Modularni Paneli", en: "Modular Panels" } },
];

const PRODUCTS = [
  {
    num: "01",
    href: "/urunler/pvc-paneli",
    badge: { tr: "Çok Satan",   me: "Bestseler",  en: "Best Seller" },
    name:  { tr: "PVC Paneller", me: "PVC Paneli", en: "PVC Panels"  },
    text:  { tr: "Su geçirmez parlak yüzeyli paneller. Banyo, mutfak ve ıslak mekanlar için ideal. Mevcut yüzey kaldırılmadan montaj.", me: "Vodootporni paneli sa sjajnom površinom. Idealni za kupatila, kuhinje i vlažne prostorije. Montaža bez uklanjanja postojećeg materijala.", en: "Waterproof panels with glossy surface. Ideal for bathrooms, kitchens and wet areas. Installation without removing existing material." },
    img: "/Wall-Panel-1-27-Kopya.jpg",
  },
  {
    num: "02",
    href: null,
    badge: null,
    name:  { tr: "MDF Paneller", me: "MDF Paneli", en: "MDF Panels"  },
    text:  { tr: "Konutları ve ticari alanları güzelleştiren ahşap MDF paneller. Doğal ahşap görünümü, modern dayanıklılık.", me: "Drveni medijapan paneli koji oplemenjuju stambene i poslovne prostore. Prirodan izgled drveta uz modernu izdržljivost.", en: "Wooden MDF panels that enhance residential and commercial spaces. Natural wood look with modern durability." },
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    num: "03",
    href: null,
    badge: { tr: "Yeni", me: "Novo", en: "New" },
    name:  { tr: "Modüler Paneller", me: "Modularni Paneli", en: "Modular Panels" },
    text:  { tr: "Yaratıcı özgürlük için esnek modüler sistem. Benzersiz iç mekan için şekil ve dokuları birleştirin.", me: "Fleksibilni modularni sistem za kreativnu slobodu. Kombinujte oblike i teksture za jedinstven enterijer.", en: "Flexible modular system for creative freedom. Combine shapes and textures for a unique interior." },
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  },
];

const FEATURES: FeatureItem[] = [
  {
    icon: <><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" /><path d="M8 12l3-6 3 6M9 10h4" strokeLinecap="round" /></>,
    title: { tr: "Su Geçirmezlik",    me: "Vodootpornost",        en: "Waterproof"         },
    text:  { tr: "Neme dayanıklı — banyo, mutfak ve ıslak mekanlara mükemmel uyum.", me: "Otporni na vlagu — savršeni za kupatila, kuhinje i sve vlažne prostorije.", en: "Resistant to moisture — perfect for bathrooms, kitchens and all wet areas." },
  },
  {
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Kolay Montaj",       me: "Laka Montaža",         en: "Easy Installation"  },
    text:  { tr: "Mevcut yüzeyi kırmadan montaj. Zaman ve maliyet tasarrufu.", me: "Bez lomljenja postojećeg materijala. Jednostavna instalacija koja štedi vrijeme i troškove.", en: "No demolition of existing material. Simple installation that saves time and costs." },
  },
  {
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Sağlıklı",           me: "Zdravstveno Sigurni",  en: "Health Safe"        },
    text:  { tr: "Zararlı madde ve koku içermez. Aileniz ve çocuklarınız için güvenli.", me: "Ne sadrže štetne materije i nemaju mirisa. Potpuno sigurni za vašu porodicu i djecu.", en: "No harmful substances or odors. Completely safe for your family and children." },
  },
  {
    icon: <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Ücretsiz Teslimat",  me: "Besplatna Dostava",    en: "Free Delivery"      },
    text:  { tr: "Karadağ'ın tüm şehirlerine ücretsiz ve hızlı teslimat.", me: "Besplatna dostava u svim gradovima Crne Gore. Brzo, pouzdano i bez skrivenih troškova.", en: "Free delivery to all cities in Montenegro. Fast, reliable, no hidden costs." },
  },
  {
    icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8M12 17v4" strokeLinecap="round" /></>,
    title: { tr: "Parlak Görünüm",     me: "Sjajan Izgled",        en: "Glossy Finish"      },
    text:  { tr: "Cilalama gerektirmeyen yüzey. Her zaman ilk günkü gibi.", me: "Sjajna površina koja ne zahtijeva poliranje. Uvijek izgleda kao prvog dana.", en: "Surface that requires no polishing. Always looks like the first day." },
  },
  {
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" /></>,
    title: { tr: "Hızlı Kurulum",      me: "Brza Ugradnja",        en: "Fast Installation"  },
    text:  { tr: "Tek günde tamamlanır. DIY ve profesyonel kullanıma uygun.", me: "Kompletna ugradnja u jednom danu. Idealno za DIY projekte i profesionalnu upotrebu.", en: "Complete installation in one day. Ideal for DIY projects and professional use." },
  },
  {
    icon: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Taksit İmkânı",      me: "Kupovina na Rate",     en: "Installment Payment"},
    text:  { tr: "Esnek ödeme seçenekleri. Bütçenizi zorlamadan mekanınızı güzelleştirin.", me: "Fleksibilne mogućnosti plaćanja. Uljepšajte prostor bez opterećenja budžeta.", en: "Flexible payment options. Beautify your space without straining your budget." },
  },
  {
    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { tr: "Uzman Destek",       me: "Stručna Podrška",      en: "Expert Support"     },
    text:  { tr: "Seçimden kuruluma kadar yanınızdayız. Ücretsiz danışmanlık.", me: "Naš tim vam pomaže od odabira do ugradnje. Besplatne konsultacije za vaš projekat.", en: "We support you from selection to installation. Free consultations for your project." },
  },
];

const TESTIMONIALS = [
  {
    text: { tr: "Oturma odamızı tamamen dönüştürdüler. Panel kalitesi mükemmel, montaj hızlı ve temizdi. Herkese tavsiye ederim!", me: "Potpuno su transformisali naš dnevni boravak. Kvalitet panela je izvanredan, a montaža je bila brza i čista. Preporučujem svima!", en: "They completely transformed our living room. The panel quality is outstanding and the installation was fast and clean. I recommend them to everyone!" },
    name: "Marko Petrović", city: "Podgorica", initial: "M",
  },
  {
    text: { tr: "Karadağ'daki en geniş panel seçimi. Nazik personel, profesyonel yaklaşım. Restoranımız yenilemeden sonra harika görünüyor.", me: "Najveći izbor panela u Crnoj Gori. Ljubazno osoblje, profesionalan pristup. Naš restoran izgleda fantastično nakon renoviranja.", en: "The largest selection of panels in Montenegro. Friendly staff, professional approach. Our restaurant looks fantastic after the renovation." },
    name: "Ana Đurović", city: "Bar", initial: "A",
  },
  {
    text: { tr: "Ücretsiz teslimat ve harika fiyatlar. Banyodaki PVC paneller gerçek mermer gibi görünüyor. Oturma odası için de planlıyoruz!", me: "Besplatna dostava i odlične cijene. PVC paneli u kupatilu izgledaju kao pravi mermer. Već planiramo i dnevnu sobu!", en: "Free delivery and excellent prices. The PVC panels in the bathroom look like real marble. We're already planning the living room!" },
    name: "Stefan Kovačević", city: "Budva", initial: "S",
  },
];

const NAV_ITEMS = [
  { id: "products", label: { tr: "Ürünler",    me: "Proizvodi", en: "Products"   } },
  { id: "about",    label: { tr: "Hakkımızda", me: "O Nama",    en: "About Us"   } },
  { id: "features", label: { tr: "Avantajlar", me: "Prednosti", en: "Advantages" } },
  { id: "gallery",  label: { tr: "Galeri",     me: "Galerija",  en: "Gallery"    } },
  { id: "contact",  label: { tr: "İletişim",   me: "Kontakt",   en: "Contact"    } },
];

const LANGS: { code: Lang; label: string }[] = [
  { code: "me", label: "ME" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
];

export default function SiteShell() {
  const [lang, setLang] = useState<Lang>("me");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backTop, setBackTop] = useState(false);
  const [counters, setCounters] = useState({ years: 0, followers: 0, panels: 0 });
  const [countersDone, setCountersDone] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      setBackTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!statsRef.current || countersDone) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCountersDone(true);
        observer.disconnect();
        const targets = { years: 4, followers: 18, panels: 200 };
        const steps = 60;
        const stepTime = 1500 / steps;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const p = step / steps;
          setCounters({
            years:     step >= steps ? targets.years     : Math.floor(targets.years * p),
            followers: step >= steps ? targets.followers : Math.floor(targets.followers * p),
            panels:    step >= steps ? targets.panels    : Math.floor(targets.panels * p),
          });
          if (step >= steps) clearInterval(timer);
        }, stepTime);
      },
      { threshold: 0.5 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [countersDone]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  }

  const heroLabel = { tr: "Premium Duvar Panelleri · Karadağ", me: "Premium Zidni Paneli · Crna Gora", en: "Premium Wall Panels · Montenegro" };
  const heroDesc  = { tr: "İç mekan dekorasyonunda yenilikçi çözümler. Zarafet, kalite ve kolay montajı bir araya getiren PVC, MDF ve modüler paneller.", me: "Inovativna rješenja u uređenju enterijera. PVC, MDF i modularni paneli koji spajaju eleganciju, kvalitet i jednostavnost ugradnje.", en: "Innovative interior design solutions. PVC, MDF and modular panels combining elegance, quality and ease of installation." };
  const scrollTxt = { tr: "Kaydır", me: "Skroluj", en: "Scroll" };

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <button className="logo-btn" onClick={() => scrollTo("hero")} aria-label="Baudecor - Ana Sayfa">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Baudecor" height={64} style={{ height: 64, width: "auto", display: "block" }} />
        </button>

        <ul className="nav-links">
          {NAV_ITEMS.map((n) => (
            <li key={n.id}>
              <button onClick={() => scrollTo(n.id)}>{tx(n.label, lang)}</button>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="lang-toggle">
            {LANGS.map((l) => (
              <button key={l.code} className={`lang-btn${lang === l.code ? " active" : ""}`} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
          <button className="nav-cta" onClick={() => scrollTo("contact")}>
            +382 68 361 700
          </button>
          <button className={`mobile-toggle${menuOpen ? " active" : ""}`} onClick={toggleMenu} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        {NAV_ITEMS.map((n) => (
          <button key={n.id} onClick={() => scrollTo(n.id)}>{tx(n.label, lang)}</button>
        ))}
      </div>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-bg-image" />
        <div className="hero-overlay" />
        <div className="hero-grid-lines" />
        <div className="hero-content">
          <p className="hero-label">{tx(heroLabel, lang)}</p>
          <h1 className="hero-title">
            {lang === "me" ? <>Transformišite<br />Vaš Prostor Sa <em>Stilom</em></>
             : lang === "tr" ? <>Mekanınızı<br /><em>Stilinizle</em> Dönüştürün</>
             : <>Transform<br />Your Space With <em>Style</em></>}
          </h1>
          <p className="hero-desc">{tx(heroDesc, lang)}</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollTo("products")}>
              {lang === "me" ? "Pogledaj Ponudu" : lang === "tr" ? "Ürünleri Gör" : "View Products"}
            </button>
            <button className="btn-outline" onClick={() => scrollTo("contact")}>
              {lang === "me" ? "Kontaktirajte Nas" : lang === "tr" ? "İletişime Geçin" : "Contact Us"}
            </button>
          </div>
        </div>
        <div className="scroll-indicator">
          <span className="scroll-text">{tx(scrollTxt, lang)}</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products" className="products">
        <div className="section-header reveal">
          <div>
            <p className="section-label">{lang === "me" ? "Kolekcija 2026" : lang === "tr" ? "Koleksiyon 2026" : "Collection 2026"}</p>
            <h2 className="section-title">{lang === "me" ? "Naši Premium Zidni Paneli" : lang === "tr" ? "Premium Duvar Panellerimiz" : "Our Premium Wall Panels"}</h2>
          </div>
          <p className="section-desc">
            {lang === "me" ? "Otkrijte ekskluzivnu kolekciju panela koji transformišu svaki prostor u umjetničko djelo."
             : lang === "tr" ? "Her mekanı sanat eserine dönüştüren özel panel koleksiyonumuzu keşfedin."
             : "Discover our exclusive collection of panels that transform every space into a work of art."}
          </p>
        </div>
        <div className="product-grid">
          {PRODUCTS.map((p, i) => (
            <div key={i} className={`product-card reveal reveal-delay-${i + 1}`}>
              <div className="product-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={tx(p.name, lang)} loading="lazy" />
                <div className="product-image-overlay" />
                <span className="product-number">{p.num}</span>
                {p.badge && <span className="product-badge">{tx(p.badge, lang)}</span>}
              </div>
              <div className="product-info">
                <h3 className="product-name">{tx(p.name, lang)}</h3>
                <p className="product-text">{tx(p.text, lang)}</p>
                {p.href ? (
                  <Link href={p.href} className="product-link">
                    {lang === "me" ? "Istraži kolekciju" : lang === "tr" ? "Koleksiyonu İncele" : "Explore collection"} <span className="arrow">→</span>
                  </Link>
                ) : (
                  <button className="product-link" onClick={() => scrollTo("contact")}>
                    {lang === "me" ? "Istraži kolekciju" : lang === "tr" ? "Koleksiyonu İncele" : "Explore collection"} <span className="arrow">→</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80" alt="Baudecor Showroom" loading="lazy" />
          <div className="about-image-overlay" />
        </div>
        <div className="about-content reveal">
          <p className="section-label">{lang === "me" ? "O Nama" : lang === "tr" ? "Hakkımızda" : "About Us"}</p>
          <h2 className="section-title">
            {lang === "me" ? "Najveći Izložbeni Salon u Crnoj Gori" : lang === "tr" ? "Karadağ'ın En Büyük Showroom'u" : "Largest Showroom in Montenegro"}
          </h2>
          <p className="about-text">
            {lang === "me" ? "Baudecor je vaš pouzdani partner za inovativna i estetski privlačna rješenja u uređenju enterijera. Sa sjedištem u Ulcinju, uspješno poslujemo pružajući visokokvalitetne proizvode u oblasti zidnih panela, MDF panela, PVC panela i akustičnih rješenja."
             : lang === "tr" ? "Baudecor, Ulcinj merkezli iç mekan dekorasyon alanında güvenilir ortağınız. Duvar paneli, MDF panel, PVC panel ve akustik çözümler konusunda yüksek kaliteli ürünler sunuyoruz."
             : "Baudecor is your trusted partner for innovative and aesthetically appealing interior design solutions. Based in Ulcinj, we provide high-quality products in wall panels, MDF panels, PVC panels and acoustic solutions."}
          </p>
          <p className="about-text">
            {lang === "me" ? "Kombinujemo funkcionalnost i moderan dizajn kako bismo našim klijentima ponudili jedinstvene mogućnosti za transformaciju prostora — bilo da se radi o stambenim, poslovnim ili ugostiteljskim objektima."
             : lang === "tr" ? "Fonksiyonellik ve modern tasarımı birleştirerek konut, ticari ve konaklama alanları için benzersiz mekan dönüşüm fırsatları sunuyoruz."
             : "We combine functionality and modern design to offer unique space transformation opportunities — whether residential, commercial or hospitality."}
          </p>
          <div className="about-stats" ref={statsRef}>
            <div>
              <div className="about-stat-num">{counters.years}+</div>
              <div className="about-stat-label">{lang === "me" ? "Godina iskustva" : lang === "tr" ? "Yıllık Deneyim" : "Years Experience"}</div>
            </div>
            <div>
              <div className="about-stat-num">{counters.followers}K</div>
              <div className="about-stat-label">{lang === "me" ? "Hiljada pratilaca" : lang === "tr" ? "Takipçi" : "Followers"}</div>
            </div>
            <div>
              <div className="about-stat-num">{counters.panels}+</div>
              <div className="about-stat-label">{lang === "me" ? "Vrsta panela" : lang === "tr" ? "Panel Çeşidi" : "Panel Types"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <div className="section-header reveal">
          <div>
            <p className="section-label">{lang === "me" ? "Zašto Baudecor" : lang === "tr" ? "Neden Baudecor" : "Why Baudecor"}</p>
            <h2 className="section-title">{lang === "me" ? "Prednosti Koje Nas Izdvajaju" : lang === "tr" ? "Bizi Öne Çıkaran Avantajlar" : "Advantages That Set Us Apart"}</h2>
          </div>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className={`feature-item reveal reveal-delay-${(i % 4) + 1}`}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">{f.icon}</svg>
              </div>
              <h3 className="feature-title">{tx(f.title, lang)}</h3>
              <p className="feature-text">{tx(f.text, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery">
        <div className="section-header reveal">
          <div>
            <p className="section-label">{lang === "me" ? "Inspiracija" : lang === "tr" ? "İlham" : "Inspiration"}</p>
            <h2 className="section-title">{lang === "me" ? "Galerija Transformacija" : lang === "tr" ? "Dönüşüm Galerisi" : "Gallery of Transformations"}</h2>
          </div>
          <p className="section-desc">
            {lang === "me" ? "Pogledajte kako naši paneli transformišu prostore — od dnevnih soba do poslovnih enterijera."
             : lang === "tr" ? "Panellerimizin oturma odalarından ticari alanlara kadar mekanları nasıl dönüştürdüğünü görün."
             : "See how our panels transform spaces — from living rooms to commercial interiors."}
          </p>
        </div>
        <div className="gallery-grid">
          {GALLERY.map((g, i) => (
            <div key={i} className={`gallery-item reveal reveal-delay-${(i % 3) + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={tx(g.label, lang)} loading="lazy" />
              <div className="gallery-overlay">
                <span className="gallery-label">{tx(g.label, lang)}</span>
                <span className="gallery-sublabel">{tx(g.sub, lang)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="reveal">
          <p className="section-label">{lang === "me" ? "Utisci" : lang === "tr" ? "Görüşler" : "Testimonials"}</p>
          <h2 className="section-title" style={{ margin: "0 auto", textAlign: "center" }}>
            {lang === "me" ? "Šta Kažu Naši Klijenti" : lang === "tr" ? "Müşterilerimiz Ne Diyor" : "What Our Clients Say"}
          </h2>
        </div>
        <div className="testimonial-cards">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&ldquo;{tx(t.text, lang)}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initial}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="cta-section">
        <div className="cta-bg" />
        <div className="cta-glow" />
        <div className="cta-content">
          <p className="section-label reveal">{lang === "me" ? "Kontaktirajte Nas" : lang === "tr" ? "İletişime Geçin" : "Contact Us"}</p>
          <h2 className="cta-title reveal">
            {lang === "me" ? <>Spremni Za Novu <em>Transformaciju</em>?</>
             : lang === "tr" ? <>Yeni Bir <em>Dönüşüme</em> Hazır mısınız?</>
             : <>Ready for a New <em>Transformation</em>?</>}
          </h2>
          <p className="cta-text reveal">
            {lang === "me" ? "Posjetite naš izložbeni salon u Ulcinju ili nas kontaktirajte. Naš tim je spreman da vam pomogne realizovati vaše ideje."
             : lang === "tr" ? "Ulcinj'deki showroom'umuzu ziyaret edin veya bizimle iletişime geçin. Ekibimiz size yardımcı olmaya hazır."
             : "Visit our showroom in Ulcinj or contact us. Our team is ready to help you realize your ideas."}
          </p>
          <div className="reveal">
            <a href="tel:+38268361700" className="btn-primary">
              {lang === "me" ? "Pozovite Nas Odmah" : lang === "tr" ? "Hemen Arayın" : "Call Us Now"}
            </a>
          </div>
          <div className="cta-contact-grid reveal">
            {[
              { l: { tr: "Telefon",          me: "Telefon",       en: "Phone"           }, v: "+382 68 361 700",  href: "tel:+38268361700" },
              { l: { tr: "E-posta",           me: "Email",         en: "Email"           }, v: "info@baudecor.me", href: "mailto:info@baudecor.me" },
              { l: { tr: "Adres",             me: "Adresa",        en: "Address"         }, v: "Bratica bb, Ulcinj", href: undefined },
              { l: { tr: "Çalışma Saatleri", me: "Radno Vrijeme", en: "Working Hours"   }, v: "08:30 — 17:30",    href: undefined },
            ].map((info, i) => (
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

      {/* BACK TO TOP */}
      {backTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
          ↑
        </button>
      )}
    </>
  );
}
