"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/useLang";
import { PHONE, pick, type Txt } from "@/lib/site";
import { MDF_MODELS, MDF_SIZE, faceStyle, type MdfFinish, type MdfModel } from "@/lib/mdf";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import MdfStory from "./MdfStory";
import h from "../home/Home.module.css";
import s from "@/components/site/Product.module.css";
import m from "./Mdf.module.css";

const FEATURES: Txt[] = [
  { me: "Visoka gustoća", tr: "Yüksek yoğunluk", en: "High density" },
  { me: "Glatka površina", tr: "Pürüzsüz yüzey", en: "Smooth surface" },
  { me: "Prirodan izgled", tr: "Doğal görünüm", en: "Natural look" },
  { me: "Laka montaža", tr: "Kolay montaj", en: "Easy to fit" },
  { me: "Dugotrajan", tr: "Uzun ömürlü", en: "Long-lasting" },
  { me: "Moderan dizajn", tr: "Modern tasarım", en: "Modern design" },
];

const USAGE: Txt[] = [
  { me: "Dnevna soba", tr: "Oturma odası", en: "Living room" },
  { me: "Spavaća soba", tr: "Yatak odası", en: "Bedroom" },
  { me: "TV niša", tr: "TV nişi", en: "TV niche" },
  { me: "Kancelarija", tr: "Ofis", en: "Office" },
  { me: "Hotel", tr: "Otel", en: "Hotel" },
  { me: "Restoran", tr: "Restoran", en: "Restaurant" },
];

const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Visoka gustoća", tr: "Yüksek yoğunluk", en: "High density" },
    text: { me: "Fino mljevena drvena vlakna presovana pod visokim pritiskom — homogena, čvrsta ploča koja ne puca.", tr: "Yüksek basınçla preslenmiş ince ahşap lifleri — çatlamayan, homojen ve sağlam bir levha.", en: "Fine wood fibres pressed under high pressure — a dense, solid board that does not crack." } },
  { icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />,
    title: { me: "Laka montaža", tr: "Kolay montaj", en: "Easy fitting" },
    text: { me: "Direktno na zid, bez rušenja. Paneli se spajaju preklopom — prostorija je gotova za jedan dan.", tr: "Kırmadan doğrudan duvara. Paneller bindirmeyle birleşir — bir oda bir günde biter.", en: "Straight onto the wall, no demolition. Panels overlap and lock — a room is done in a day." } },
  { icon: <><circle cx="12" cy="12" r="9.5" /><path d="M12 6v12M9 8.5c1 .8 2 1.2 3 1.2M15 13c-1 .6-2 .9-3 .9" strokeLinecap="round" /></>,
    title: { me: "Prirodan izgled drveta", tr: "Doğal ahşap görünümü", en: "Natural wood look" },
    text: { me: "Toplina drveta bez njegovih mana — ne savija se i ne mijenja boju.", tr: "Ahşabın sıcaklığı, kusurları olmadan — eğilmez, renk değiştirmez.", en: "The warmth of wood without its drawbacks — no warping, no colour change." } },
  { icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" strokeLinecap="round" /></>,
    title: { me: "Termička izolacija", tr: "Isı yalıtımı", en: "Thermal insulation" },
    text: { me: "Sloj od 18 mm poboljšava toplotnu izolaciju zida.", tr: "18 mm'lik katman duvarın ısı yalıtımını iyileştirir.", en: "An 18 mm layer improves the wall's thermal insulation." } },
  { icon: <><path d="M4 9v6M8 6v12M12 4v16M16 7v10M20 10v4" strokeLinecap="round" /></>,
    title: { me: "Manje odjeka", tr: "Daha az yankı", en: "Less echo" },
    text: { me: "Profilisana površina razbija zvučne talase i smanjuje odjek u prostoriji.", tr: "Profilli yüzey ses dalgalarını kırar, odadaki yankıyı azaltır.", en: "The profiled surface breaks up sound waves and reduces echo in the room." } },
  { icon: <><path d="M12 21c-4-3-7-6.5-7-10.5A7 7 0 0112 3.5a7 7 0 017 7c0 4-3 7.5-7 10.5z" strokeLinejoin="round" /><path d="M12 8v8M9 11l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { me: "Od drvenih vlakana", tr: "Ahşap liften", en: "Made from wood fibre" },
    text: { me: "Proizvodi se od drvenih vlakana — prirodne sirovine.", tr: "Doğal bir hammadde olan ahşap liflerinden üretilir.", en: "Made from wood fibre — a natural raw material." } },
  { icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    title: { me: "Raznovrsna primjena", tr: "Çok yönlü kullanım", en: "Versatile" },
    text: { me: "Dnevne i spavaće sobe, TV niše, kancelarije i hoteli — kombinujte modele i boje.", tr: "Oturma ve yatak odaları, TV nişleri, ofisler, oteller — model ve renkleri birleştirin.", en: "Living rooms, bedrooms, TV walls, offices and hotels — mix models and colours." } },
  { icon: <><circle cx="12" cy="12" r="9.5" /><path d="M8.5 12l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: { me: "Lako održavanje", tr: "Kolay bakım", en: "Easy care" },
    text: { me: "Briše se vlažnom krpom; površina je otporna na svakodnevno habanje.", tr: "Nemli bezle silinir; yüzey günlük aşınmaya dayanıklıdır.", en: "Wipe with a damp cloth; the surface stands up to everyday wear." } },
];

const COUNT = MDF_MODELS.reduce((a, x) => a + x.finishes.length, 0);

export default function MdfPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const [sel, setSel] = useState<{ model: MdfModel; finish: MdfFinish }>({ model: MDF_MODELS[0], finish: MDF_MODELS[0].finishes[0] });
  const [open, setOpen] = useState<{ mi: number; fi: number } | null>(null);
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

  // renk penceresi: klavye ve kaydırma kilidi
  useEffect(() => {
    if (!open) return;
    const n = MDF_MODELS[open.mi].finishes.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") setOpen((o) => o && { ...o, fi: (o.fi - 1 + n) % n });
      if (e.key === "ArrowRight") setOpen((o) => o && { ...o, fi: (o.fi + 1) % n });
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const choose = (model: MdfModel, finish: MdfFinish) => setSel({ model, finish });

  // galeriden seçilen rengi 3D panellerde göster ("Renk" sahnesi)
  const tryIn3d = (model: MdfModel, finish: MdfFinish) => {
    choose(model, finish);
    setOpen(null);
    const el = storyRef.current;
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + window.innerHeight * 2, behavior: "smooth" });
  };

  const om = open ? MDF_MODELS[open.mi] : null;
  const of = om && open ? om.finishes[open.fi] : null;
  const step = (d: number) => setOpen((o) => o && { ...o, fi: (o.fi + d + MDF_MODELS[o.mi].finishes.length) % MDF_MODELS[o.mi].finishes.length });

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("MDF paneli", "MDF paneller", "MDF panels") }]} />

      <div ref={storyRef}>
        <MdfStory lang={lang} model={sel.model} finish={sel.finish} onChoose={choose} />
      </div>

      {/* ===== MODELLER VE RENKLER ===== */}
      <section id="modeli" className={h.section}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Kolekcija", "Koleksiyon", "Collection")}</p>
            <h2 className={h.h2}>{MDF_MODELS.length} {L("modela,", "model,", "models,")} <em>{COUNT} {L("boja", "renk", "colours")}</em></h2>
          </div>
          <p className={h.headDesc}>{L("Kliknite na boju da vidite karticu proizvoda ili je isprobajte na 3D panelima.", "Ürün kartını görmek için renge tıklayın ya da 3D panellerde deneyin.", "Click a colour to see its product card, or try it on the 3D panels.")}</p>
        </header>

        {MDF_MODELS.map((md, mi) => (
          <div key={md.id} className={m.model} data-reveal>
            <aside className={m.modelInfo}>
              <span className={m.modelCode}>{md.id}</span>
              <h3>{md.name[lang]}</h3>
              <p>{md.text[lang]}</p>
              <dl>
                <div><dt>{L("Dimenzije", "Ölçüler", "Size")}</dt><dd>{MDF_SIZE.thickness} × {md.width} × {MDF_SIZE.length} mm</dd></div>
                <div><dt>{L("Paket", "Paket", "Pack")}</dt><dd>{MDF_SIZE.perPack} {L("kom", "adet", "pcs")} · {md.packKg} kg</dd></div>
                <div><dt>{L("Boje", "Renkler", "Colours")}</dt><dd>{md.finishes.length}</dd></div>
              </dl>
            </aside>
            <div className={m.finishGrid}>
              {md.finishes.map((f, fi) => (
                <button key={f.id} className={m.finish} onClick={() => setOpen({ mi, fi })}>
                  <span className={m.finishImg} style={faceStyle(f, 1.5)} role="img" aria-label={f.name} />
                  <b>{f.name}</b>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ===== TEKNİK ÖZELLİKLER ===== */}
      <section className={s.specBand}>
        <div className={s.specInner} data-reveal>
          <div className={s.specIntro}>
            <p className={h.kicker}>{L("Šta je MDF", "MDF nedir", "What is MDF")}</p>
            <h2 className={h.h2}>{L("Drvo,", "Ahşabın", "Wood,")} <em>{L("usavršeno", "kusursuz hali", "perfected")}</em></h2>
            <p>{L("MDF (vlaknasta ploča srednje gustoće) nastaje presovanjem fino mljevenih drvenih vlakana pod visokim pritiskom i temperaturom. Rezultat je homogena, glatka ploča koja savršeno prima folije i dekorativne površine — sa izgledom drveta, bez njegovih mana.", "MDF (orta yoğunluklu lif levha), ince öğütülmüş ahşap liflerinin yüksek basınç ve sıcaklıkla preslenmesiyle üretilir. Sonuç; folyo ve dekoratif yüzeyleri kusursuz taşıyan homojen, pürüzsüz bir levhadır — ahşap görünümünde, ahşabın kusurları olmadan.", "MDF (medium-density fibreboard) is made by pressing finely ground wood fibres under high pressure and heat. The result is a smooth, uniform board that takes foils and decorative finishes perfectly — the look of wood without its flaws.")}</p>
          </div>
          <dl className={s.specNums}>
            <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{MDF_SIZE.thickness}<small>mm</small></dd></div>
            <div><dt>{L("Dužina", "Uzunluk", "Length")}</dt><dd>{MDF_SIZE.length}<small>mm</small></dd></div>
            <div><dt>{L("Širina", "Genişlik", "Width")}</dt><dd>118–121<small>mm</small></dd></div>
            <div><dt>{L("U paketu", "Paket içi", "Per pack")}</dt><dd>{MDF_SIZE.perPack}<small>{L("kom", "adet", "pcs")}</small></dd></div>
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

      {/* ===== AKSESUAR VE ÖZEL RENK ===== */}
      <section className={h.section}>
        <div className={m.feature} data-reveal>
          <div className={`${m.featureImg} ${m.dark}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Bitis%20profilleri.jpg" alt={L("Početni i završni profili", "Başlangıç ve bitiş profilleri", "Start and end profiles")} loading="lazy" />
          </div>
          <div className={m.featureText}>
            <p className={h.kicker}>{L("Dodaci", "Aksesuarlar", "Accessories")}</p>
            <h2 className={h.h2}>{L("Početni i", "Başlangıç ve", "Start and")} <em>{L("završni profili", "bitiş profilleri", "end profiles")}</em></h2>
            <p>{L("Za svaki model dostupni su odgovarajući početni i završni profili u istoj boji — za čiste ivice i profesionalan završetak.", "Her model için aynı renkte, uyumlu başlangıç ve bitiş profilleri mevcuttur — temiz kenarlar ve profesyonel bir bitiş için.", "Matching start and end profiles in the same colour are available for every model — for clean edges and a professional finish.")}</p>
          </div>
        </div>

        <div className={`${m.feature} ${m.flip}`} data-reveal>
          <div className={`${m.featureImg} ${m.dark}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/renk%20kartelas%C4%B1.jpg" alt={L("Katalog boja", "Renk kartelası", "Colour catalogue")} loading="lazy" />
          </div>
          <div className={m.featureText}>
            <p className={h.kicker}>{L("Posebna izrada", "Özel üretim", "Made to order")}</p>
            <h2 className={h.h2}>{L("Stotine dezena,", "Yüzlerce desen,", "Hundreds of designs,")} <em>{L("vaš izbor", "sizin seçiminiz", "your choice")}</em></h2>
            <p>{L("Iz kataloga boja u našem salonu bilo koji dekor možemo primijeniti na sve modele MDF panela.", "Showroom'umuzdaki renk kartelasından dilediğiniz deseni tüm MDF panel modellerine uygulayabiliyoruz.", "Any design from the colour catalogue in our showroom can be applied to every MDF panel model.")}</p>
            <dl className={m.terms}>
              <div><dt>{L("Rok isporuke", "Teslim süresi", "Lead time")}</dt><dd>{L("3–4 sedmice", "3–4 hafta", "3–4 weeks")}</dd></div>
              <div><dt>{L("Narudžba", "Sipariş", "Order")}</dt><dd>{L("Uz minimalnu količinu", "Minimum adetle", "Minimum quantity applies")}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* ===== AVANTAJLAR ===== */}
      <section className={`${h.section} ${s.advSection}`}>
        <header className={`${h.head} ${h.headCenter}`} data-reveal>
          <div>
            <p className={h.kicker}>{L("Zašto MDF panel", "Neden MDF panel", "Why MDF panels")}</p>
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
        title={lang === "me" ? <>Zainteresovani za <em>MDF panele</em>?</> : lang === "tr" ? <><em>MDF paneller</em> ilginizi mi çekti?</> : <>Interested in <em>MDF panels</em>?</>}
        text={L("Posjetite naš salon u Ulcinju i pogledajte modele i boje uživo. Pomoći ćemo vam da izaberete i izračunamo potreban broj panela.", "Ulcinj'deki showroom'umuzda model ve renkleri yerinde görün. Seçimde yardımcı olur, gereken panel sayısını hesaplarız.", "Visit our showroom in Ulcinj to see the models and colours in person. We'll help you choose and work out how many panels you need.")}
      />
      <SiteFooter lang={lang} />

      {/* ===== RENK PENCERESİ: ürün kartı ===== */}
      {om && of && open && (
        <div className={s.sheet} role="dialog" aria-modal="true" aria-label={of.name} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className={s.sheetBox}>
            <button className={s.close} onClick={() => setOpen(null)} aria-label={L("Zatvori", "Kapat", "Close")}>✕</button>
            <div className={`${s.sheetImg} ${m.sheetCard}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={of.id} src={of.card} alt={`${om.id} ${of.name}`} />
            </div>
            <div className={s.sheetInfo}>
              <p className={h.kicker}>{om.id} · {om.name[lang]}</p>
              <h2>{of.name}</h2>
              <dl>
                <div><dt>{L("Dimenzije", "Ölçüler", "Size")}</dt><dd>{MDF_SIZE.thickness} × {om.width} × {MDF_SIZE.length} mm</dd></div>
                <div><dt>{L("Paket", "Paket", "Pack")}</dt><dd>{MDF_SIZE.perPack} {L("kom", "adet", "pcs")} · {om.packKg} kg</dd></div>
                <div><dt>{L("Profil", "Profil", "Profile")}</dt><dd>{om.name[lang]}</dd></div>
                <div><dt>{L("Površina", "Yüzey", "Finish")}</dt><dd>{of.kind === "grain" ? L("Dekor drveta", "Ahşap desen", "Wood décor") : of.kind === "patina" ? L("Patina", "Patine", "Patina") : L("Jednobojna, mat", "Düz renk, mat", "Solid, matt")}</dd></div>
              </dl>
              <p className={s.sheetChips}>{FEATURES.map((f) => <i key={f.en}>{f[lang]}</i>)}</p>
              <div className={s.sheetBtns}>
                <button className={h.btnPrimary} onClick={() => tryIn3d(om, of)}>{L("Isprobaj u 3D", "3D'de dene", "Try in 3D")} <span>→</span></button>
                <a className={h.btnGhost} href={`${PHONE.wa}?text=${encodeURIComponent(`MDF ${om.id} ${of.name}`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
              <div className={s.sheetNav}>
                <button onClick={() => step(-1)}>← {om.finishes[(open.fi - 1 + om.finishes.length) % om.finishes.length].name}</button>
                <span>{open.fi + 1} / {om.finishes.length}</span>
                <button onClick={() => step(1)}>{om.finishes[(open.fi + 1) % om.finishes.length].name} →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
