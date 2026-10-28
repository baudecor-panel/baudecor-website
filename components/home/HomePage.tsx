"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { tx } from "@/lib/i18n";
import HeroAccordion from "./HeroAccordion";
import { useLang } from "@/lib/useLang";
import { LANGS } from "@/lib/site";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import s from "./Home.module.css";

type Txt = { tr: string; me: string; en: string };

/* ===== İçerik ===== */
const MARQUEE_ITEMS = ["PVC Paneli", "MDF Paneli", "Modularni Paneli", "Akustični Paneli", "Fleksibilni Kamen", "Tapete", "SPC Paneli", "Kupovina na Rate"];

const PRODUCTS: { num: string; href: string; badge: Txt | null; name: Txt; tag: Txt; text: Txt; img: string }[] = [
  {
    num: "01", href: "/urunler/pvc-paneli",
    badge: { tr: "Çok Satan", me: "Bestseler", en: "Best Seller" },
    name: { tr: "PVC Paneller", me: "PVC Paneli", en: "PVC Panels" },
    tag: { tr: "Su geçirmez mermer görünümü", me: "Vodootporni mermer", en: "Waterproof marble" },
    text: { tr: "Su geçirmez parlak yüzeyli paneller. Banyo, mutfak ve ıslak mekanlar için ideal. Mevcut yüzey kaldırılmadan montaj.", me: "Vodootporni paneli sa sjajnom površinom. Idealni za kupatila, kuhinje i vlažne prostorije. Montaža bez uklanjanja postojećeg materijala.", en: "Waterproof panels with glossy surface. Ideal for bathrooms, kitchens and wet areas. Installation without removing existing material." },
    img: "/anasayfa-pvc.webp",
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
    text: { tr: "Esnek akustik keçe üzerinde MDF çıtalar — Light Oak, Teak, beyaz ve siyah, 60 × 280 cm. Yankıyı azaltır, duvara ahşabın sıcaklığını katar.", me: "MDF lamele na fleksibilnom akustičnom filcu — Light Oak, Teak, bijela i crna, 60 × 280 cm. Smanjuju odjek i daju zidu toplinu drveta.", en: "MDF slats on flexible acoustic felt — Light Oak, Teak, white and black, 60 × 280 cm. They cut echo and give the wall the warmth of wood." },
    img: "/anasayfa-akustik.webp",
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

const TESTIMONIALS = [
  { text: { tr: "Oturma odamızı tamamen dönüştürdüler. Panel kalitesi mükemmel, montaj hızlı ve temizdi. Herkese tavsiye ederim!", me: "Potpuno su transformisali naš dnevni boravak. Kvalitet panela je izvanredan, a montaža je bila brza i čista. Preporučujem svima!", en: "They completely transformed our living room. The panel quality is outstanding and the installation was fast and clean. I recommend them to everyone!" }, name: "Marko Petrović", city: "Podgorica" },
  { text: { tr: "Karadağ'daki en geniş panel seçimi. Nazik personel, profesyonel yaklaşım. Restoranımız yenilemeden sonra harika görünüyor.", me: "Najveći izbor panela u Crnoj Gori. Ljubazno osoblje, profesionalan pristup. Naš restoran izgleda fantastično nakon renoviranja.", en: "The largest selection of panels in Montenegro. Friendly staff, professional approach. Our restaurant looks fantastic after the renovation." }, name: "Ana Đurović", city: "Bar" },
  { text: { tr: "Harika fiyatlar ve hızlı hizmet. Banyodaki PVC paneller gerçek mermer gibi görünüyor. Oturma odası için de planlıyoruz!", me: "Odlične cijene i brza usluga. PVC paneli u kupatilu izgledaju kao pravi mermer. Već planiramo i dnevnu sobu!", en: "Excellent prices and quick service. The PVC panels in the bathroom look like real marble. We're already planning the living room!" }, name: "Stefan Kovačević", city: "Budva" },
];

const NAV_ITEMS: { id: string; label: Txt }[] = [
  { id: "products", label: { tr: "Ürünler", me: "Proizvodi", en: "Products" } },
  { id: "about", label: { tr: "Hakkımızda", me: "O Nama", en: "About Us" } },
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
          <img src="/showroom-ulcinj.webp" alt="Baudecor showroom, Ulcinj" loading="lazy" />
          <div className={s.aboutBadge}>
            <strong>Ulcinj</strong>
            <span>{L("Izložbeni salon", "Showroom", "Showroom")}</span>
          </div>
        </div>
        <div className={s.aboutText} data-reveal>
          <p className={s.kicker}>{L("O Nama", "Hakkımızda", "About Us")}</p>
          <h2 className={s.h2}>
            {L("Vaš salon", "Ulcinj'de", "Your wall décor")} <em>{L("zidnog dekora u Ulcinju", "duvar dekor showroom'unuz", "showroom in Ulcinj")}</em>
          </h2>
          <p>{L("Baudecor je vaš partner za uređenje zidova sa sjedištem u Ulcinju. Na jednom mjestu nudimo šest kolekcija: PVC panele sa izgledom mermera, MDF lamele, modularne 3D panele, akustične panele, tapete i fleksibilni kamen.",
            "Baudecor, Ulcinj merkezli duvar dekorasyonu ortağınız. Tek çatı altında altı koleksiyon sunuyoruz: mermer görünümlü PVC paneller, MDF lameller, modüler 3D paneller, akustik paneller, duvar kağıtları ve esnek taş.",
            "Baudecor is your wall décor partner based in Ulcinj. Under one roof we offer six collections: marble-look PVC panels, MDF slats, modular 3D panels, acoustic panels, wallpaper and flexible stone.")}</p>
          <p>{L("Pomažemo vam da izaberete pravu površinu za dom, kancelariju, restoran ili hotel — od vodootpornih zidova za kupatilo do toplih drvenih i reljefnih zidova. Sve uzorke možete vidjeti i dodirnuti u našem salonu.",
            "Ev, ofis, restoran ya da otel için doğru yüzeyi seçmenize yardımcı oluyoruz — banyo için su geçirmez duvarlardan sıcak ahşap ve rölyefli duvarlara kadar. Tüm numuneleri showroom'umuzda görüp dokunabilirsiniz.",
            "We help you choose the right surface for your home, office, restaurant or hotel — from waterproof bathroom walls to warm wooden and relief walls. You can see and touch every sample in our showroom.")}</p>
          <div className={s.stats} ref={statsRef}>
            <div><strong>{counters.years}+</strong><span>{L("Godina iskustva", "Yıllık Deneyim", "Years Experience")}</span></div>
            <div><strong>{counters.followers}K</strong><span>{L("Hiljada pratilaca", "Takipçi", "Followers")}</span></div>
            <div><strong>{counters.panels}+</strong><span>{L("Vrsta panela", "Panel Çeşidi", "Panel Types")}</span></div>
          </div>
        </div>
      </section>

      {/* ===== YORUMLAR ===== */}
      <section className={`${s.section} ${s.tinted} ${s.quotesSection}`}>
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
