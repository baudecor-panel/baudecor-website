"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { tx } from "@/lib/i18n";
import HeroAccordion from "./HeroAccordion";
import { useLang } from "@/lib/useLang";
import { LANGS } from "@/lib/site";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import s from "./Home.module.css";

type Txt = { tr: string; me: string; en: string };

/* ===== İçerik ===== */
const MARQUEE_ITEMS = ["PVC Paneli", "MDF Paneli", "Modularni Paneli", "Akustični Paneli", "Fleksibilni Kamen", "Tapete", "SPC Paneli", "Besplatna Dostava", "Kupovina na Rate"];

const PRODUCTS: { num: string; href: string; badge: Txt | null; name: Txt; tag: Txt; text: Txt; img: string }[] = [
  {
    num: "01", href: "/urunler/pvc-paneli",
    badge: { tr: "Çok Satan", me: "Bestseler", en: "Best Seller" },
    name: { tr: "PVC Paneller", me: "PVC Paneli", en: "PVC Panels" },
    tag: { tr: "Su geçirmez mermer görünümü", me: "Vodootporni mermer", en: "Waterproof marble" },
    text: { tr: "Su geçirmez parlak yüzeyli paneller. Banyo, mutfak ve ıslak mekanlar için ideal. Mevcut yüzey kaldırılmadan montaj.", me: "Vodootporni paneli sa sjajnom površinom. Idealni za kupatila, kuhinje i vlažne prostorije. Montaža bez uklanjanja postojećeg materijala.", en: "Waterproof panels with glossy surface. Ideal for bathrooms, kitchens and wet areas. Installation without removing existing material." },
    img: "/Wall-Panel-1-27-Kopya.jpg",
  },
  {
    num: "02", href: "/urunler/mdf-paneli", badge: null,
    name: { tr: "MDF Paneller", me: "MDF Paneli", en: "MDF Panels" },
    tag: { tr: "Ahşabın sıcaklığı", me: "Toplina drveta", en: "The warmth of wood" },
    text: { tr: "Konutları ve ticari alanları güzelleştiren ahşap MDF paneller. Doğal ahşap görünümü, modern dayanıklılık.", me: "Drveni medijapan paneli koji oplemenjuju stambene i poslovne prostore. Prirodan izgled drveta uz modernu izdržljivost.", en: "Wooden MDF panels that enhance residential and commercial spaces. Natural wood look with modern durability." },
    img: "/anasayfa%20mdf.jpg",
  },
  {
    num: "03", href: "/urunler/moduler-duvar-paneli",
    badge: { tr: "Yeni", me: "Novo", en: "New" },
    name: { tr: "Modüler Duvar Paneli", me: "Modularni Zidni Panel", en: "Modular Wall Panel" },
    tag: { tr: "Işıkla canlanan 3D rölyef", me: "3D reljef koji oživljava svjetlom", en: "3D relief brought alive by light" },
    text: { tr: "Hafif ABS polimerden üretilen rölyefli Modüler duvar panelleri. Modüler yapısıyla sınırsız kombinasyon — otel, restoran ve konut projelerine mükemmel uyum.", me: "Reljefni modularni zidni paneli izrađeni od laganog ABS polimera. Modularni sistem za beskrajne kombinacije — savršeni za hotele, restorane i stambene projekte.", en: "Relief modular wall panels made from lightweight ABS polymer. Modular system for endless combinations — perfect for hotels, restaurants and residential projects." },
    img: "/KAPAK%20PENTA.jpg",
  },
  {
    num: "04", href: "/urunler/akustik-duvar-paneli",
    badge: { tr: "Yeni", me: "Novo", en: "New" },
    name: { tr: "Akustik Duvar Paneli", me: "Akustični Zidni Panel", en: "Acoustic Wall Panel" },
    tag: { tr: "Şık bir sessizlik", me: "Tišina sa stilom", en: "Silence, with style" },
    text: { tr: "Ses yutma ve estetik tasarımı bir arada sunan akustik duvar panelleri. Ofis, stüdyo ve konut projelerinde mükemmel ses konforu.", me: "Akustični zidni paneli koji kombinuju apsorpciju zvuka i estetski dizajn. Savršen zvučni komfor za kancelarije, studije i stambene prostore.", en: "Acoustic wall panels combining sound absorption and aesthetic design. Perfect sound comfort for offices, studios and residential spaces." },
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
  },
  {
    num: "05", href: "/duvar-kagidi",
    badge: { tr: "1000+ Desen", me: "1000+ Dezena", en: "1000+ Designs" },
    name: { tr: "Duvar Kağıdı", me: "Tapete", en: "Wallpaper" },
    tag: { tr: "1000+ desen, 15 koleksiyon", me: "1000+ dezena, 15 kolekcija", en: "1000+ designs, 15 collections" },
    text: { tr: "AdaWall'un 15 koleksiyonundan 1000'i aşkın desen — klasik damasktan modern dokulara, taş ve tuğladan tropik motiflere.", me: "Preko 1000 dezena iz 15 AdaWall kolekcija — od klasičnog damaska do modernih tekstura, kamena, cigle i tropskih motiva.", en: "Over 1000 designs from 15 AdaWall collections — from classic damask to modern textures, stone, brick and tropical motifs." },
    img: "/duvar-kagidi/oda/seven-7811-serie.webp",
  },
  {
    num: "06", href: "/urunler/esnek-tas-panel",
    badge: { tr: "Yeni", me: "Novo", en: "New" },
    name: { tr: "Esnek Taş Panel", me: "Fleksibilni Kamen", en: "Flexible Stone" },
    tag: { tr: "Bükülen taş", me: "Kamen koji se savija", en: "Stone that bends" },
    text: { tr: "Clayton'ın 21 serisi: taş, mermer, arduvaz, tuğla ve ahşap görünümlü hafif, bükülebilen mineral levhalar. İç mekân, banyo ve cepheler için.", me: "21 Clayton serija: lagane mineralne ploče koje se savijaju, sa izgledom kamena, mermera, škriljca, opeke i drveta. Za enterijer, kupatila i fasade.", en: "21 Clayton series: light, bendable mineral sheets with the look of stone, marble, slate, brick and wood. For interiors, bathrooms and façades." },
    img: "/clayton/oda/traverten-1.webp",
  },
];

const FEATURES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  { icon: <><path d="M12 2.5c3.5 4.2 6 7.6 6 11a6 6 0 01-12 0c0-3.4 2.5-6.8 6-11z" strokeLinejoin="round" /></>,
    title: { tr: "Su Geçirmezlik", me: "Vodootpornost", en: "Waterproof" },
    text: { tr: "Neme dayanıklı — banyo, mutfak ve ıslak mekanlara mükemmel uyum.", me: "Otporni na vlagu — savršeni za kupatila, kuhinje i sve vlažne prostorije.", en: "Resistant to moisture — perfect for bathrooms, kitchens and all wet areas." } },
  { icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Kolay Montaj", me: "Laka Montaža", en: "Easy Installation" },
    text: { tr: "Mevcut yüzeyi kırmadan montaj. Zaman ve maliyet tasarrufu.", me: "Bez lomljenja postojećeg materijala. Jednostavna instalacija koja štedi vrijeme i troškove.", en: "No demolition of existing material. Simple installation that saves time and costs." } },
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { tr: "Sağlıklı", me: "Zdravstveno Sigurni", en: "Health Safe" },
    text: { tr: "Zararlı madde ve koku içermez. Aileniz ve çocuklarınız için güvenli.", me: "Ne sadrže štetne materije i nemaju mirisa. Potpuno sigurni za vašu porodicu i djecu.", en: "No harmful substances or odors. Completely safe for your family and children." } },
  { icon: <><rect x="1.5" y="7" width="13" height="10" rx="1" /><path d="M14.5 10h4l3 3.5V17h-7z" strokeLinejoin="round" /><circle cx="6" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>,
    title: { tr: "Ücretsiz Teslimat", me: "Besplatna Dostava", en: "Free Delivery" },
    text: { tr: "Karadağ'ın tüm şehirlerine ücretsiz ve hızlı teslimat.", me: "Besplatna dostava u svim gradovima Crne Gore. Brzo, pouzdano i bez skrivenih troškova.", en: "Free delivery to all cities in Montenegro. Fast, reliable, no hidden costs." } },
  { icon: <path d="M12 3l2.4 5.6L20 9.3l-4.3 3.9 1.3 5.8L12 16l-5 3 1.3-5.8L4 9.3l5.6-.7z" strokeLinejoin="round" />,
    title: { tr: "Parlak Görünüm", me: "Sjajan Izgled", en: "Glossy Finish" },
    text: { tr: "Cilalama gerektirmeyen yüzey. Her zaman ilk günkü gibi.", me: "Sjajna površina koja ne zahtijeva poliranje. Uvijek izgleda kao prvog dana.", en: "Surface that requires no polishing. Always looks like the first day." } },
  { icon: <><circle cx="12" cy="12" r="9.5" /><path d="M12 6.5V12l3.5 2" strokeLinecap="round" /></>,
    title: { tr: "Hızlı Kurulum", me: "Brza Ugradnja", en: "Fast Installation" },
    text: { tr: "Tek günde tamamlanır. DIY ve profesyonel kullanıma uygun.", me: "Kompletna ugradnja u jednom danu. Idealno za DIY projekte i profesionalnu upotrebu.", en: "Complete installation in one day. Ideal for DIY projects and professional use." } },
  { icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" strokeLinecap="round" /></>,
    title: { tr: "Taksit İmkânı", me: "Kupovina na Rate", en: "Installment Payment" },
    text: { tr: "Esnek ödeme seçenekleri. Bütçenizi zorlamadan mekanınızı güzelleştirin.", me: "Fleksibilne mogućnosti plaćanja. Uljepšajte prostor bez opterećenja budžeta.", en: "Flexible payment options. Beautify your space without straining your budget." } },
  { icon: <><path d="M21 12a9 9 0 01-13.5 7.8L3 21l1.2-4.5A9 9 0 1121 12z" strokeLinejoin="round" /><path d="M8.5 11h7M8.5 14h4.5" strokeLinecap="round" /></>,
    title: { tr: "Uzman Destek", me: "Stručna Podrška", en: "Expert Support" },
    text: { tr: "Seçimden kuruluma kadar yanınızdayız. Ücretsiz danışmanlık.", me: "Naš tim vam pomaže od odabira do ugradnje. Besplatne konsultacije za vaš projekat.", en: "We support you from selection to installation. Free consultations for your project." } },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80", label: { tr: "Oturma Odası", me: "Dnevna Soba", en: "Living Room" }, sub: { tr: "MDF Paneli", me: "MDF Paneli", en: "MDF Panels" } },
  { src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80", label: { tr: "Banyo", me: "Kupatilo", en: "Bathroom" }, sub: { tr: "PVC Paneli", me: "PVC Paneli", en: "PVC Panels" } },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", label: { tr: "Mutfak", me: "Kuhinja", en: "Kitchen" }, sub: { tr: "PVC Paneli", me: "PVC Paneli", en: "PVC Panels" } },
  { src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80", label: { tr: "Yatak Odası", me: "Spavaća Soba", en: "Bedroom" }, sub: { tr: "MDF Paneli", me: "MDF Paneli", en: "MDF Panels" } },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", label: { tr: "Ofis", me: "Kancelarija", en: "Office" }, sub: { tr: "Akustik Paneller", me: "Akustični Paneli", en: "Acoustic Panels" } },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80", label: { tr: "Restoran", me: "Restoran", en: "Restaurant" }, sub: { tr: "Modüler Paneller", me: "Modularni Paneli", en: "Modular Panels" } },
];

const TESTIMONIALS = [
  { text: { tr: "Oturma odamızı tamamen dönüştürdüler. Panel kalitesi mükemmel, montaj hızlı ve temizdi. Herkese tavsiye ederim!", me: "Potpuno su transformisali naš dnevni boravak. Kvalitet panela je izvanredan, a montaža je bila brza i čista. Preporučujem svima!", en: "They completely transformed our living room. The panel quality is outstanding and the installation was fast and clean. I recommend them to everyone!" }, name: "Marko Petrović", city: "Podgorica" },
  { text: { tr: "Karadağ'daki en geniş panel seçimi. Nazik personel, profesyonel yaklaşım. Restoranımız yenilemeden sonra harika görünüyor.", me: "Najveći izbor panela u Crnoj Gori. Ljubazno osoblje, profesionalan pristup. Naš restoran izgleda fantastično nakon renoviranja.", en: "The largest selection of panels in Montenegro. Friendly staff, professional approach. Our restaurant looks fantastic after the renovation." }, name: "Ana Đurović", city: "Bar" },
  { text: { tr: "Ücretsiz teslimat ve harika fiyatlar. Banyodaki PVC paneller gerçek mermer gibi görünüyor. Oturma odası için de planlıyoruz!", me: "Besplatna dostava i odlične cijene. PVC paneli u kupatilu izgledaju kao pravi mermer. Već planiramo i dnevnu sobu!", en: "Free delivery and excellent prices. The PVC panels in the bathroom look like real marble. We're already planning the living room!" }, name: "Stefan Kovačević", city: "Budva" },
];

const NAV_ITEMS: { id: string; label: Txt }[] = [
  { id: "products", label: { tr: "Ürünler", me: "Proizvodi", en: "Products" } },
  { id: "about", label: { tr: "Hakkımızda", me: "O Nama", en: "About Us" } },
  { id: "features", label: { tr: "Avantajlar", me: "Prednosti", en: "Advantages" } },
  { id: "gallery", label: { tr: "Galeri", me: "Galerija", en: "Gallery" } },
  { id: "contact", label: { tr: "İletişim", me: "Kontakt", en: "Contact" } },
];




export default function HomePage() {
  const [lang, setLang] = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backTop, setBackTop] = useState(false);
  const [counters, setCounters] = useState({ years: 0, followers: 0, panels: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const L = (me: string, tr: string, en: string) => (lang === "me" ? me : lang === "tr" ? tr : en);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setBackTop(window.scrollY > 900);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(s.in); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  // sayaçlar görünür olunca sayar
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / 1600);
        const ease = 1 - Math.pow(1 - p, 3);
        setCounters({ years: Math.round(4 * ease), followers: Math.round(18 * ease), panels: Math.round(200 * ease) });
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  const toggleMenu = () => setMenuOpen((o) => !o);

  // mobil menü açıkken sayfa kaymasın
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const heroPanels = PRODUCTS.map((p) => ({ num: p.num, href: p.href, name: tx(p.name, lang), tag: tx(p.tag, lang), img: p.img }));

  return (
    <div className={s.page}>
      <div className={s.grain} aria-hidden />

      {/* ===== MENÜ ===== */}
      <nav className={`${s.nav} ${scrolled ? s.navScrolled : ""}`}>
        <button className={s.logoBtn} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Baudecor">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Baudecor" className={s.logo} />
        </button>
        <ul className={s.navLinks}>
          {NAV_ITEMS.map((n) => (
            <li key={n.id}><button onClick={() => scrollTo(n.id)}>{tx(n.label, lang)}</button></li>
          ))}
        </ul>
        <div className={s.navRight}>
          <div className={s.langs}>
            {LANGS.map((l) => (
              <button key={l.code} className={lang === l.code ? s.langOn : ""} onClick={() => setLang(l.code)}>{l.label}</button>
            ))}
          </div>
          <a href="tel:+38268361700" className={s.navCta}>+382 68 361 700</a>
          <button className={`${s.burger} ${menuOpen ? s.burgerOn : ""}`} onClick={toggleMenu} aria-label="Menu">
            <span /><span />
          </button>
        </div>
      </nav>

      <div className={`${s.mobileMenu} ${menuOpen ? s.mobileMenuOn : ""}`}>
        {NAV_ITEMS.map((n, i) => (
          <button key={n.id} onClick={() => scrollTo(n.id)} style={{ transitionDelay: `${0.05 + i * 0.05}s` }}>
            <small>0{i + 1}</small>{tx(n.label, lang)}
          </button>
        ))}
        <a href="tel:+38268361700" className={s.mobileMenuTel}>+382 68 361 700</a>
      </div>

      {/* ===== AÇILIŞ ===== */}
      <section id="hero" className={s.hero}>
        <div className={s.heroGlow} aria-hidden />
        <div className={s.heroContent}>
          <p className={`${s.kicker} ${s.fadeUp}`} style={{ animationDelay: "0.2s" }}>
            {L("Premium Zidni Paneli · Crna Gora", "Premium Duvar Panelleri · Karadağ", "Premium Wall Panels · Montenegro")}
          </p>
          <h1 className={s.heroTitle}>
            {lang === "me" ? <><span><span>Transformišite</span></span><span><span>Vaš Prostor</span></span><span><span>Sa <em>Stilom</em></span></span></>
              : lang === "tr" ? <><span><span>Mekanınızı</span></span><span><span><em>Stilinizle</em></span></span><span><span>Dönüştürün</span></span></>
              : <><span><span>Transform</span></span><span><span>Your Space</span></span><span><span>With <em>Style</em></span></span></>}
          </h1>
          <p className={`${s.heroDesc} ${s.fadeUp}`} style={{ animationDelay: "0.9s" }}>
            {L("Šest kolekcija za zidove sa karakterom — PVC i MDF paneli, modularni i akustični paneli, tapete i fleksibilni kamen. Pogledajte ih uživo u našem salonu u Ulcinju.",
              "Karakterli duvarlar için altı koleksiyon — PVC ve MDF paneller, modüler ve akustik paneller, duvar kağıdı ve esnek taş. Ulcinj'deki showroom'umuzda yerinde görün.",
              "Six collections for walls with character — PVC and MDF panels, modular and acoustic panels, wallpaper and flexible stone. See them in person at our Ulcinj showroom.")}
          </p>
          <div className={`${s.heroBtns} ${s.fadeUp}`} style={{ animationDelay: "1.05s" }}>
            <button className={s.btnPrimary} onClick={() => scrollTo("products")}>{L("Pogledaj Ponudu", "Ürünleri Gör", "View Products")} <span>→</span></button>
            <button className={s.btnGhost} onClick={() => scrollTo("contact")}>{L("Kontaktirajte Nas", "İletişime Geçin", "Contact Us")}</button>
          </div>
        </div>
        <div className={s.heroStage}>
          <HeroAccordion items={heroPanels} cta={L("Istraži kolekciju", "Koleksiyonu incele", "Explore collection")} />
        </div>
        <div className={`${s.heroFoot} ${s.fadeIn}`} style={{ animationDelay: "1.4s" }}>
          <button className={s.scrollHint} onClick={() => scrollTo("products")}><span />{L("Skroluj", "Kaydır", "Scroll")}</button>
          <p>Showroom · Ulcinj</p>
        </div>
      </section>

      {/* ===== KAYAN YAZI ===== */}
      <div className={s.marquee} aria-hidden>
        <div className={s.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>

      {/* ===== ÜRÜNLER ===== */}
      <section id="products" className={s.section}>
        <header className={s.head} data-reveal>
          <div>
            <p className={s.kicker}>{L("Kolekcija 2026", "Koleksiyon 2026", "Collection 2026")}</p>
            <h2 className={s.h2}>{L("Naši Premium", "Premium Duvar", "Our Premium")} <em>{L("Zidni Paneli", "Panellerimiz", "Wall Panels")}</em></h2>
          </div>
          <p className={s.headDesc}>{L("Otkrijte ekskluzivnu kolekciju panela koji transformišu svaki prostor u umjetničko djelo.", "Her mekanı sanat eserine dönüştüren özel panel koleksiyonumuzu keşfedin.", "Discover our exclusive collection of panels that transform every space into a work of art.")}</p>
        </header>
        <div className={s.products}>
          {PRODUCTS.map((p, i) => (
            <Link key={p.num} href={p.href} className={s.product} data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className={s.productImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={tx(p.name, lang)} loading="lazy" />
                {p.badge && <span className={s.badge}>{tx(p.badge, lang)}</span>}
              </div>
              <div className={s.productBody}>
                <span className={s.productNum}>{p.num}</span>
                <h3>{tx(p.name, lang)}</h3>
                <p>{tx(p.text, lang)}</p>
                <span className={s.productLink}>{L("Istraži kolekciju", "Koleksiyonu İncele", "Explore collection")} <span>→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ===== HAKKIMIZDA ===== */}
      <section id="about" className={s.about}>
        <div className={s.aboutImg} data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1400&q=80" alt="Baudecor Showroom" loading="lazy" />
          <div className={s.aboutBadge}>
            <strong>Ulcinj</strong>
            <span>{L("Izložbeni salon", "Showroom", "Showroom")}</span>
          </div>
        </div>
        <div className={s.aboutText} data-reveal>
          <p className={s.kicker}>{L("O Nama", "Hakkımızda", "About Us")}</p>
          <h2 className={s.h2}>
            {L("Najveći Izložbeni Salon", "Karadağ'ın En Büyük", "Largest Showroom")} <em>{L("u Crnoj Gori", "Showroom'u", "in Montenegro")}</em>
          </h2>
          <p>{L("Baudecor je vaš pouzdani partner za inovativna i estetski privlačna rješenja u uređenju enterijera. Sa sjedištem u Ulcinju, uspješno poslujemo pružajući visokokvalitetne proizvode u oblasti zidnih panela, MDF panela, PVC panela i akustičnih rješenja.",
            "Baudecor, Ulcinj merkezli iç mekan dekorasyon alanında güvenilir ortağınız. Duvar paneli, MDF panel, PVC panel ve akustik çözümler konusunda yüksek kaliteli ürünler sunuyoruz.",
            "Baudecor is your trusted partner for innovative and aesthetically appealing interior design solutions. Based in Ulcinj, we provide high-quality products in wall panels, MDF panels, PVC panels and acoustic solutions.")}</p>
          <p>{L("Kombinujemo funkcionalnost i moderan dizajn kako bismo našim klijentima ponudili jedinstvene mogućnosti za transformaciju prostora — bilo da se radi o stambenim, poslovnim ili ugostiteljskim objektima.",
            "Fonksiyonellik ve modern tasarımı birleştirerek konut, ticari ve konaklama alanları için benzersiz mekan dönüşüm fırsatları sunuyoruz.",
            "We combine functionality and modern design to offer unique space transformation opportunities — whether residential, commercial or hospitality.")}</p>
          <div className={s.stats} ref={statsRef}>
            <div><strong>{counters.years}+</strong><span>{L("Godina iskustva", "Yıllık Deneyim", "Years Experience")}</span></div>
            <div><strong>{counters.followers}K</strong><span>{L("Hiljada pratilaca", "Takipçi", "Followers")}</span></div>
            <div><strong>{counters.panels}+</strong><span>{L("Vrsta panela", "Panel Çeşidi", "Panel Types")}</span></div>
          </div>
        </div>
      </section>

      {/* ===== AVANTAJLAR ===== */}
      <section id="features" className={`${s.section} ${s.tinted}`}>
        <header className={s.head} data-reveal>
          <div>
            <p className={s.kicker}>{L("Zašto Baudecor", "Neden Baudecor", "Why Baudecor")}</p>
            <h2 className={s.h2}>{L("Prednosti Koje", "Bizi Öne Çıkaran", "Advantages That")} <em>{L("Nas Izdvajaju", "Avantajlar", "Set Us Apart")}</em></h2>
          </div>
        </header>
        <div className={s.features}>
          {FEATURES.map((f, i) => (
            <div key={i} className={s.feature} data-reveal style={{ transitionDelay: `${(i % 4) * 0.07}s` }}>
              <span className={s.featureNum}>0{i + 1}</span>
              <svg viewBox="0 0 24 24" className={s.featureIcon}>{f.icon}</svg>
              <h3>{tx(f.title, lang)}</h3>
              <p>{tx(f.text, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GALERİ ===== */}
      <section id="gallery" className={s.section}>
        <header className={s.head} data-reveal>
          <div>
            <p className={s.kicker}>{L("Inspiracija", "İlham", "Inspiration")}</p>
            <h2 className={s.h2}>{L("Galerija", "Dönüşüm", "Gallery of")} <em>{L("Transformacija", "Galerisi", "Transformations")}</em></h2>
          </div>
          <p className={s.headDesc}>{L("Pogledajte kako naši paneli transformišu prostore — od dnevnih soba do poslovnih enterijera.", "Panellerimizin oturma odalarından ticari alanlara kadar mekanları nasıl dönüştürdüğünü görün.", "See how our panels transform spaces — from living rooms to commercial interiors.")}</p>
        </header>
        <div className={s.gallery}>
          {GALLERY.map((g, i) => (
            <figure key={i} className={s.galleryItem} data-reveal style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={tx(g.label, lang)} loading="lazy" />
              <figcaption><strong>{tx(g.label, lang)}</strong><span>{tx(g.sub, lang)}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== YORUMLAR ===== */}
      <section className={`${s.section} ${s.tinted}`}>
        <header className={`${s.head} ${s.headCenter}`} data-reveal>
          <div>
            <p className={s.kicker}>{L("Utisci", "Görüşler", "Testimonials")}</p>
            <h2 className={s.h2}>{L("Šta Kažu Naši", "Müşterilerimiz", "What Our")} <em>{L("Klijenti", "Ne Diyor", "Clients Say")}</em></h2>
          </div>
        </header>
        <div className={s.quotes}>
          {TESTIMONIALS.map((t, i) => (
            <blockquote key={i} className={s.quote} data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className={s.quoteMark}>&ldquo;</span>
              <p>{tx(t.text, lang)}</p>
              <footer><strong>{t.name}</strong><span>{t.city} · ★★★★★</span></footer>
            </blockquote>
          ))}
        </div>
      </section>

      <ContactSection lang={lang} />
      <SiteFooter lang={lang} />

      <button className={`${s.backTop} ${backTop ? s.backTopOn : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </div>
  );
}
