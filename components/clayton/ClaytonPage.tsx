"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/useLang";
import { useFlipIn } from "@/lib/useFlipIn";
import { PHONE, pick, type Txt } from "@/lib/site";
import { CLAY_COUNT, CLAY_FAMILIES, clayTex } from "@/lib/clayton";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import h from "../home/Home.module.css";
import s from "@/components/site/Product.module.css";
import m from "../moduler/Moduler.module.css";
import c from "./Clayton.module.css";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  { icon: <path d="M12 2.5c3.5 4.2 6 7.6 6 11a6 6 0 01-12 0c0-3.4 2.5-6.8 6-11z" strokeLinejoin="round" />,
    title: T("Prirodni mineral", "Doğal mineral", "Natural mineral"),
    text: T("Glina i kameni prah povezani polimerima — bez PVC-a.", "Polimerle bağlanmış kil ve taş tozu — PVC içermez.", "Clay and stone powder bound with polymers — no PVC.") },
  { icon: <path d="M6 18L18 6M8 6h10v10" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Lagan i čvrst", "Hafif ve sağlam", "Light yet strong"),
    text: T("Samo 1/5 težine pravog kamena, uz visoku čvrstoću. Lak transport i montaža.", "Gerçek taşın yalnızca 1/5'i ağırlığında, yüksek dayanımlı. Kolay taşıma ve montaj.", "Just 1/5 the weight of real stone, with high strength. Easy to transport and fit.") },
  { icon: <path d="M4 20c0-9 7-16 16-16" strokeLinecap="round" />,
    title: T("Fleksibilan", "Esnek", "Flexible"),
    text: T("Obavija stubove i zaobljene zidove, a ugao savija u jednom komadu.", "Kolonları ve kavisli duvarları sarar, köşeyi tek parça döner.", "Wraps columns and curved walls, and turns corners in one piece.") },
  { icon: <path d="M3 12h4l3-8 4 16 3-8h4" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Za renoviranje", "Renovasyona uygun", "Made for renovation"),
    text: T("Lijepi se direktno na postojeći zid, pločice ili fasadu — bez rušenja.", "Mevcut duvar, fayans veya cepheye doğrudan yapışır — kırım yok.", "Glues straight onto existing walls, tiles or façades — no demolition.") },
  { icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" /></>,
    title: T("Za eksterijer", "Dış mekâna uygun", "Outdoor-ready"),
    text: T("Otporan na UV zrake, mraz, vlagu i temperaturne promjene.", "UV ışınlarına, dona, neme ve sıcaklık değişimlerine dayanıklı.", "Resists UV light, frost, moisture and temperature changes.") },
  { icon: <path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-3 3-5 5-5 8 0 4 3 7 7 7z" strokeLinejoin="round" />,
    title: T("Negoriv — klasa A2", "Yanmaz — A2 sınıfı", "Non-combustible — A2"),
    text: T("Klasa reakcije na požar A2-s1,d0: ne gori i ne prenosi plamen.", "A2-s1,d0 yangın sınıfı: yanmaz, alevi iletmez.", "Fire class A2-s1,d0: does not burn or spread flame.") },
  { icon: <><circle cx="12" cy="12" r="9.5" /><path d="M12 6.5V12l3.5 2" strokeLinecap="round" /></>,
    title: T("Brza ugradnja", "Hızlı montaj", "Fast installation"),
    text: T("Bez mehaničkog pričvršćivanja — samo ljepilo. Bez prašine, buke i otpada.", "Mekanik sabitleme yok — yalnızca yapıştırıcı. Toz, gürültü ve atık yok.", "No mechanical fixings — just adhesive. No dust, noise or waste.") },
  { icon: <><path d="M3 21h18M5 21V10l7-6 7 6v11" strokeLinejoin="round" /><path d="M10 21v-6h4v6" strokeLinejoin="round" /></>,
    title: T("Bez dodatnog tereta", "Ek yük getirmez", "No added load"),
    text: T("Objektu ne treba dodatna noseća konstrukcija, ni na fasadi.", "Binaya, cephede bile, ek taşıyıcı sistem gerekmez.", "The building needs no extra support structure, even on façades.") },
];

const STEPS: { img: string; title: Txt; text: Txt; tip: Txt }[] = [
  { img: "/clayton/montaza-1.webp",
    title: T("Priprema podloge", "Yüzey hazırlığı", "Surface preparation"),
    text: T("Površina mora biti čista, suva i bez masnoće. Na glatkoj podlozi ljepilo prijanja najbolje.", "Yüzey temiz, kuru ve yağsız olmalı. Düzgün zeminde yapıştırıcı en iyi tutunur.", "The surface must be clean, dry and grease-free. Adhesive grips best on a smooth base."),
    tip: T("Na upijajućim podlogama koristite prajmer.", "Emici yüzeylerde astar kullanın.", "Use a primer on absorbent surfaces.") },
  { img: "/clayton/montaza-2.webp",
    title: T("Sječenje", "Kesim", "Cutting"),
    text: T("Bez brusilica i teških rezača — panel se sječe običnim skalpelom, bez prašine i buke.", "Spiral ve ağır kesiciler gerekmez — panel sıradan bir maket bıçağıyla, tozsuz ve sessiz kesilir.", "No grinders or heavy cutters — the panel cuts with an ordinary utility knife, without dust or noise."),
    tip: T("Sjecite sa zadnje strane za čistije ivice.", "Daha temiz kenar için arka yüzden kesin.", "Cut from the back for cleaner edges.") },
  { img: "/clayton/montaza-3.webp",
    title: T("Lijepljenje", "Yapıştırma", "Bonding"),
    text: T("Ljepilo se nanosi nazubljenom gleterom, a panel se lagano pritisne. Bez bušenja i šrafova.", "Yapıştırıcı dişli malayla sürülür, panel hafifçe bastırılır. Delme ve vida yok.", "Spread adhesive with a notched trowel and press the panel lightly. No drilling or screws."),
    tip: T("Za fasade birajte ljepilo otporno na vremenske uslove.", "Cephede hava koşullarına dayanıklı yapıştırıcı seçin.", "On façades, choose a weather-resistant adhesive.") },
  { img: "/clayton/montaza-4.webp",
    title: T("Fugovanje", "Derz dolgusu", "Grouting"),
    text: T("Spojevi se popune masom za fuge u tonu panela, pa zid izgleda kao pravi kamen.", "Derzler panel tonunda dolguyla doldurulur; duvar gerçek taş gibi görünür.", "Fill the joints with grout in the panel's tone, and the wall looks like real stone."),
    tip: T("Višak uklonite sunđerom prije sušenja.", "Fazlasını kurumadan süngerle alın.", "Wipe off the excess with a sponge before it dries.") },
];

const AREAS = [T("Enterijer", "İç mekân", "Interiors"), T("Eksterijer", "Dış mekân", "Exteriors"), T("Fasade", "Cepheler", "Façades"), T("Kupatila i mokri čvorovi", "Banyo ve ıslak hacimler", "Bathrooms & wet areas"), T("Stubovi i zaobljeni zidovi", "Kolonlar ve kavisli duvarlar", "Columns & curved walls")];
const SURFACES = [T("Beton", "Beton", "Concrete"), T("Malterisan zid", "Sıvalı duvar", "Plastered wall"), T("Pločice", "Fayans", "Tiles"), T("Cementna ploča", "Çimento levha", "Cement board"), T("Laminat", "Laminat", "Laminate"),T("Šperploča", "Kontrplak", "Plywood"), T("MDF", "MDF", "MDF"), T("Kompozitni panel", "Kompozit panel", "Composite panel"), T("Metal", "Metal", "Metal"), T("Staklo", "Cam", "Glass"), T("Kamen i mermer", "Taş ve mermer", "Stone & marble")];

export default function ClaytonPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const [open, setOpen] = useState<number | null>(null);
  const [sel, setSel] = useState<number | null>(null);     // seçili desen (yoksa oda fotoğrafları)
  const [img, setImg] = useState<string | null>(null);
  useFlipIn();

  // kaydırınca beliren bölümler
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(h.in); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // seri penceresi: klavye ve kaydırma kilidi
  useEffect(() => {
    if (open === null) return;
    const n = CLAY_FAMILIES.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") { setOpen((i) => (i === null ? i : (i - 1 + n) % n)); setSel(null); setImg(null); }
      if (e.key === "ArrowRight") { setOpen((i) => (i === null ? i : (i + 1) % n)); setSel(null); setImg(null); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const openFamily = (i: number) => { setOpen(i); setSel(null); setImg(null); };
  const step = (d: number) => openFamily(((open ?? 0) + d + CLAY_FAMILIES.length) % CLAY_FAMILIES.length);
  const pickProduct = (i: number) => { setSel(i); setImg(null); };

  // ölçüler: ME/TR ondalık virgül, aralık "–"
  const num = (v: string) => { const t = v.replace(/\s*~\s*/, "–"); return lang === "en" ? t : t.replace(/\./g, ","); };
  const fam = open === null ? null : CLAY_FAMILIES[open];
  const prod = fam && sel !== null ? fam.products[sel] : null;
  const shots = fam ? (prod ? [clayTex(prod.code), ...prod.det, ...fam.rooms] : [...fam.rooms, ...fam.products.map((p) => clayTex(p.code))]) : [];
  const main = img ?? shots[0];
  const thick = prod ? [...new Set(prod.sizes.map((z) => num(z[2])))] : [];

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("Fleksibilni kamen", "Esnek taş", "Flexible stone") }]} />

      {/* ===== SERİLER ===== */}
      <section id="kolekcija" className={`${h.section} ${m.first}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>Clayton · {L("nova generacija", "yeni nesil", "new generation")}</p>
            <h1 className={h.h2}>{L("Fleksibilni kameni paneli —", "Esnek taş paneller —", "Flexible stone panels —")} <em>{CLAY_FAMILIES.length} {L("serija", "seri", "series")}, {CLAY_COUNT} {L("dezena", "desen", "designs")}</em></h1>
          </div>
          <p className={h.headDesc}>{L("Izgled pravog kamena, mermera i drveta u laganim mineralnim pločama koje se savijaju. Kliknite na seriju za dezene, formate i fotografije.", "Gerçek taş, mermer ve ahşap görünümü; bükülebilen hafif mineral levhalarda. Desenler, ölçüler ve fotoğraflar için bir seriye tıklayın.", "The look of real stone, marble and wood in light mineral sheets that bend. Click a series for its designs, sizes and photos.")}</p>
        </header>
        <div className={`${s.grid} ${c.grid}`}>
          {CLAY_FAMILIES.map((f, i) => (
            <button key={f.id} className={`${s.card} ${c.card}`} onClick={() => openFamily(i)} data-flip>
              <span className={s.cardImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.rooms[0]} alt={`Clayton ${f.name}`} loading="lazy" />
              </span>
              <span className={s.cardBody}>
                <small>{f.look[lang]}</small>
                <b>{f.name}</b>
                <i className={c.count}>{f.products.length} {f.products.length === 1 ? L("dezen", "desen", "design") : L("dezena", "desen", "designs")}</i>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== TEKNİK ===== */}
      <section className={s.specBand}>
        <div className={s.specInner} data-reveal>
          <div className={s.specIntro}>
            <p className={h.kicker}>{L("Šta je Clayton", "Clayton nedir", "What is Clayton")}</p>
            <h2 className={h.h2}>{L("Kamen koji se", "Bükülen", "Stone that")} <em>{L("savija", "taş", "bends")}</em></h2>
            <p>{L("Clayton je mineralna obloga nove generacije: glina, kameni prah i prirodni pijesak oblikovani na niskoj temperaturi u tanke, fleksibilne ploče. Ima izgled i dodir pravog kamena, a postavlja se ljepilom na skoro svaku podlogu — u enterijeru i na fasadi.", "Clayton yeni nesil bir mineral kaplamadır: kil, taş tozu ve doğal kum düşük sıcaklıkta ince, esnek levhalara dönüştürülür. Gerçek taşın görünümü ve dokusuna sahiptir, iç mekânda ve cephede neredeyse her yüzeye yapıştırılarak uygulanır.", "Clayton is a new-generation mineral cladding: clay, stone powder and natural sand formed at low temperature into thin, flexible sheets. It looks and feels like real stone and is glued onto almost any surface — indoors and on façades.")}</p>
          </div>
          <dl className={s.specNums}>
            <div><dt>{L("Težina u odnosu na kamen", "Taşa göre ağırlık", "Weight vs. stone")}</dt><dd>1/5</dd></div>
            <div><dt>{L("Klasa požara", "Yangın sınıfı", "Fire class")}</dt><dd>A2<small>-s1,d0</small></dd></div>
            <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{num("2.8")}–9<small>mm</small></dd></div>
            <div><dt>{L("Najveća ploča", "En büyük levha", "Largest sheet")}</dt><dd>3 × 1,2<small>m</small></dd></div>
          </dl>
          <div className={s.chips}>
            <div>
              <span>{L("Primjena", "Kullanım alanları", "Where to use")}</span>
              <p>{AREAS.map((a) => <i key={a.en}>{a[lang]}</i>)}</p>
            </div>
            <div>
              <span>{L("Podloge", "Uygulanabilir yüzeyler", "Suitable surfaces")}</span>
              <p>{SURFACES.map((a) => <i key={a.en}>{a[lang]}</i>)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AVANTAJLAR ===== */}
      <section className={h.section}>
        <header className={`${h.head} ${h.headCenter}`} data-reveal>
          <div>
            <p className={h.kicker}>{L("Zašto Clayton", "Neden Clayton", "Why Clayton")}</p>
            <h2 className={h.h2}>{L("8 razloga za", "Esnek taşı seçmek için", "8 reasons to choose")} <em>{L("fleksibilni kamen", "8 neden", "flexible stone")}</em></h2>
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

      {/* ===== MONTAJ ===== */}
      <section className={`${h.section} ${c.stepsSection}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Montaža", "Montaj", "Installation")}</p>
            <h2 className={h.h2}>{L("Postavlja se", "Dört adımda", "Fitted in")} <em>{L("u četiri koraka", "uygulanır", "four steps")}</em></h2>
          </div>
          <p className={h.headDesc}>{L("Bez teških mašina, bušenja i mehaničkog sidrenja — dovoljni su skalpel, gleter i ljepilo.", "Ağır makine, delme ve mekanik ankraj gerekmez — maket bıçağı, mala ve yapıştırıcı yeterli.", "No heavy machinery, drilling or mechanical anchors — a utility knife, a trowel and adhesive are enough.")}</p>
        </header>
        <ol className={c.steps}>
          {STEPS.map((st, i) => (
            <li key={st.img} data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={st.img} alt={st.title[lang]} loading="lazy" />
              <span>0{i + 1}</span>
              <h3>{st.title[lang]}</h3>
              <p>{st.text[lang]}</p>
              <small>{st.tip[lang]}</small>
            </li>
          ))}
        </ol>
      </section>

      <ContactSection
        lang={lang}
        title={lang === "me" ? <>Zainteresovani za <em>fleksibilni kamen</em>?</> : lang === "tr" ? <><em>Esnek taş</em> ilginizi mi çekti?</> : <>Interested in <em>flexible stone</em>?</>}
        text={L("Pošaljite nam fotografiju i mjere zida ili fasade — predložićemo dezen i izračunati potrebnu količinu.", "Duvarınızın veya cephenizin fotoğrafını ve ölçülerini gönderin — desen önerelim ve gereken miktarı hesaplayalım.", "Send us a photo and the measurements of your wall or façade — we'll suggest a design and work out the quantity.")}
      />
      <SiteFooter lang={lang} />

      {/* ===== SERİ PENCERESİ ===== */}
      {fam && open !== null && (
        <div className={s.sheet} role="dialog" aria-modal="true" aria-label={fam.name} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className={`${s.sheetBox} ${m.sheetBox}`}>
            <button className={s.close} onClick={() => setOpen(null)} aria-label={L("Zatvori", "Kapat", "Close")}>✕</button>
            <div className={m.viewer}>
              <div className={m.viewerMain}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={main} src={main} alt={prod ? prod.code : fam.name} />
              </div>
              <div className={m.thumbs}>
                {shots.map((src) => (
                  <button key={src} className={src === main ? m.thumbOn : ""} onClick={() => setImg(src)} style={{ backgroundImage: `url("${src}")` }} aria-label={fam.name} />
                ))}
              </div>
            </div>
            <div className={s.sheetInfo}>
              <p className={h.kicker}>{fam.look[lang]}</p>
              <h2>{fam.name}</h2>

              <p className={m.label}>{L("Dezeni", "Desenler", "Designs")} · {fam.products.length}</p>
              <div className={`${m.swatches} ${c.swatches}`}>
                {fam.products.map((p, i) => (
                  <button key={p.code} className={i === sel ? m.swOn : ""} onClick={() => pickProduct(i)}>
                    <span style={{ backgroundImage: `url("${clayTex(p.code, true)}")` }} />
                    <small>{p.code.slice(3)}{p.note && ` · ${p.note[lang]}`}</small>
                  </button>
                ))}
              </div>

              {prod ? (
                <dl>
                  <div><dt>{L("Dezen", "Desen", "Design")}</dt><dd>{fam.name} {prod.code}{prod.note && ` (${prod.note[lang]})`}</dd></div>
                  <div><dt>{L("Format", "Ölçü", "Size")}</dt><dd>{prod.sizes.map((z) => <span key={z.join()} className={c.size}>{z[0]} × {z[1]} mm</span>)}</dd></div>
                  <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{thick.join(" / ")} mm</dd></div>
                </dl>
              ) : (
                <p className={c.hint}>{L("Izaberite dezen za format, debljinu i fotografije izbliza.", "Ölçü, kalınlık ve yakın çekim fotoğraflar için bir desen seçin.", "Pick a design to see its size, thickness and close-up photos.")}</p>
              )}

              <p className={m.desc}>{fam.desc[lang]}</p>
              <div className={s.sheetChips}>
                {AREAS.slice(0, 4).map((a) => <i key={a.en}>{a[lang]}</i>)}
                <i>A2-s1,d0</i>
              </div>

              <div className={s.sheetBtns}>
                <a className={h.btnPrimary} href={`${PHONE.wa}?text=${encodeURIComponent(`Clayton ${fam.name}${prod ? ` ${prod.code}` : ""}`)}`} target="_blank" rel="noopener noreferrer">{L("Pitajte na WhatsApp-u", "WhatsApp'tan sorun", "Ask on WhatsApp")} <span>→</span></a>
                <a className={h.btnGhost} href={PHONE.href}>{L("Pozovite nas", "Bizi arayın", "Call us")}</a>
              </div>
              <div className={s.sheetNav}>
                <button onClick={() => step(-1)}>← {CLAY_FAMILIES[(open - 1 + CLAY_FAMILIES.length) % CLAY_FAMILIES.length].name}</button>
                <span>{open + 1} / {CLAY_FAMILIES.length}</span>
                <button onClick={() => step(1)}>{CLAY_FAMILIES[(open + 1) % CLAY_FAMILIES.length].name} →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
