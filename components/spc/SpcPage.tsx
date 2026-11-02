"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useLang } from "@/lib/useLang";
import { useFlipIn } from "@/lib/useFlipIn";
import { PHONE, pick, type Txt } from "@/lib/site";
import { SPC_COLLS, SPC_COUNT, spcCode, spcImg, type SpcColl, type SpcFormat } from "@/lib/spc";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import h from "../home/Home.module.css";
import s from "@/components/site/Product.module.css";
import m from "../moduler/Moduler.module.css";
import k from "../akustik/Akustik.module.css";
import p from "./Spc.module.css";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

const KIND: Record<SpcFormat["kind"], Txt> = {
  pl: T("Daska", "Düz tahta", "Plank"),
  hb: T("Riblja kost", "Balıksırtı", "Herringbone"),
  tile: T("Ploča", "Karo", "Tile"),
  xl: T("Ploča XL", "Karo XL", "Tile XL"),
};

const LAYERS: { cls: string; slices: number; title: Txt; text: Txt }[] = [
  { cls: p.lUv, slices: 1, title: T("UV zaštitni sloj", "UV koruma katmanı", "UV coating"),
    text: T("Štiti od sunca, ogrebotina i mrlja; boja ne bledi.", "Güneşe, çizilmeye ve lekeye karşı korur; renk solmaz.", "Protects against sunlight, scratches and stains; the colour won't fade.") },
  { cls: p.lWear, slices: 1, title: T("Habajući sloj 0,3–0,5 mm", "Aşınma tabakası 0,3–0,5 mm", "Wear layer 0.3–0.5 mm"),
    text: T("Providan i tvrd — nosi svakodnevno hodanje, stolice i šape.", "Şeffaf ve sert — günlük yürüyüşü, sandalyeleri ve patileri taşır.", "Clear and hard — takes daily foot traffic, chairs and paws.") },
  { cls: p.lDecor, slices: 1, title: T("Dekorativni film", "Desen filmi", "Décor film"),
    text: T("Fotografija drveta ili kamena visoke rezolucije, sa usklađenom strukturom površine.", "Yüksek çözünürlüklü ahşap veya taş görüntüsü; yüzey dokusu desenle uyumlu.", "A high-resolution wood or stone image, with a matching surface texture.") },
  { cls: p.lCore, slices: 9, title: T("SPC jezgro", "SPC çekirdek", "SPC rigid core"),
    text: T("Kameni prah i PVC: 100% vodootporno, ne bubri i ne mijenja dimenzije.", "Taş tozu ve PVC: %100 su geçirmez, şişmez, ölçüsü değişmez.", "Stone powder and PVC: 100% waterproof, never swells or changes size.") },
  { cls: p.lIxpe, slices: 3, title: T("IXPE podloga 1–1,5 mm", "IXPE alt katman 1–1,5 mm", "IXPE underlay 1–1.5 mm"),
    text: T("Integrisana podloga — prigušuje korake i izravnava sitne neravnine.", "Hazır yapışık alt katman — adım sesini keser, küçük pürüzleri dengeler.", "Built-in underlay — softens footsteps and evens out small bumps.") },
];

const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  { icon: <path d="M12 2.5c3.5 4.2 6 7.6 6 11a6 6 0 01-12 0c0-3.4 2.5-6.8 6-11z" strokeLinejoin="round" />,
    title: T("100% vodootporan", "%100 su geçirmez", "100% waterproof"),
    text: T("Za kuhinje, kupatila i hodnike — voda ne prodire u jezgro.", "Mutfak, banyo ve koridorlar için — su çekirdeğe işlemez.", "For kitchens, bathrooms and hallways — water can't get into the core.") },
  { icon: <path d="M4 20h16M7 16c0-2 2-2 2-4s-2-2-2-4M12 16c0-2 2-2 2-4s-2-2-2-4M17 16c0-2 2-2 2-4s-2-2-2-4" strokeLinecap="round" />,
    title: T("Za podno grijanje", "Yerden ısıtmaya uygun", "Underfloor heating"),
    text: T("Tanko i gusto jezgro dobro provodi toplotu.", "İnce ve yoğun çekirdek ısıyı iyi iletir.", "The thin, dense core conducts heat well.") },
  { icon: <path d="M4 14h7l2-4h7M4 10h5M15 14h5" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Montaža na klik", "Tıklamalı montaj", "Click installation"),
    text: T("Bez ljepila — plivajuće polaganje, pod je spreman isti dan.", "Yapıştırıcı yok — yüzer döşeme, zemin aynı gün kullanıma hazır.", "No glue — a floating floor, ready to use the same day.") },
  { icon: <path d="M3 12h3l2-5 3 10 3-7 2 2h5" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Tih korak", "Sessiz adım", "Quiet underfoot"),
    text: T("Integrisana IXPE podloga prigušuje zvuk koraka.", "Hazır IXPE alt katman adım sesini azaltır.", "The built-in IXPE underlay muffles footsteps.") },
  { icon: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: T("Otporan na ogrebotine", "Çizilmeye dayanıklı", "Scratch-resistant"),
    text: T("Habajući i UV sloj — idealno uz djecu i kućne ljubimce.", "Aşınma ve UV katmanı — çocuklu ve evcil hayvanlı evler için ideal.", "Wear and UV layers — ideal with children and pets.") },
  { icon: <path d="M4 8h16M4 16h16M8 4v16M16 4v16" strokeLinecap="round" />,
    title: T("Stabilne dimenzije", "Ölçü kararlılığı", "Dimensionally stable"),
    text: T("Ne širi se i ne skuplja sa toplotom i vlagom.", "Isı ve nemle genleşmez, büzülmez.", "Doesn't expand or shrink with heat and humidity.") },
  { icon: <><circle cx="12" cy="12" r="8.5" /><path d="M8 8l8 8M16 8l-8 8" strokeLinecap="round" /></>,
    title: T("Antibakterijski", "Antibakteriyel", "Antibacterial"),
    text: T("Površina testirana po ISO 22196 — lako se održava higijenskom.", "Yüzey ISO 22196'ya göre test edildi — hijyeni kolay korunur.", "Surface tested to ISO 22196 — easy to keep hygienic.") },
  { icon: <path d="M12 21c-5-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-3 8-8 11zM9 10.5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Zdrav za dom", "Sağlıklı yaşam", "Healthy home"),
    text: T("Bez ftalata, niska emisija VOC (M1, FloorScore).", "Ftalat içermez, düşük VOC salımı (M1, FloorScore).", "Phthalate-free, low VOC emissions (M1, FloorScore).") },
];

const STEPS: { title: Txt; text: Txt }[] = [
  { title: T("Priprema podloge", "Zemin hazırlığı", "Prepare the base"),
    text: T("Podloga mora biti ravna, čvrsta i suva. Stare pločice i beton mogu ostati — SPC se postavlja preko njih.", "Zemin düz, sağlam ve kuru olmalı. Eski fayans ve beton kalabilir — SPC üzerine döşenir.", "The base must be flat, solid and dry. Old tiles and concrete can stay — SPC goes right over them.") },
  { title: T("Aklimatizacija", "Ortama alıştırma", "Acclimatise"),
    text: T("Paketi stoje 24–48 sati u prostoriji u kojoj se postavljaju.", "Paketler döşenecekleri odada 24–48 saat bekletilir.", "Leave the packs for 24–48 hours in the room where they'll be laid.") },
  { title: T("Polaganje na klik", "Tıklayarak döşeme", "Click into place"),
    text: T("Daske se spajaju pod uglom i spuštaju — bez ljepila. Od zidova se ostavlja 8–10 mm dilatacije.", "Tahtalar açıyla birleştirilip indirilir — yapıştırıcı yok. Duvar kenarında 8–10 mm genleşme payı bırakılır.", "Planks join at an angle and drop into place — no glue. Leave an 8–10 mm expansion gap at the walls.") },
  { title: T("Lajsne", "Süpürgelik", "Skirting"),
    text: T("Lajsne pokrivaju dilataciju — pod je odmah spreman za korišćenje.", "Süpürgelikler genleşme payını kapatır — zemin hemen kullanıma hazır.", "Skirting covers the gap — the floor is ready to use straight away.") },
];

const FAQ: { q: Txt; a: Txt }[] = [
  { q: T("Da li je SPC stvarno vodootporan?", "SPC gerçekten su geçirmez mi?", "Is SPC really waterproof?"),
    a: T("Da. Jezgro od kamenog praha i PVC-a ne upija vodu i ne bubri, pa je pogodan za kuhinje, kupatila i hodnike. Prolivenu vodu samo obrišite.", "Evet. Taş tozu ve PVC çekirdek su çekmez, şişmez; mutfak, banyo ve koridorlar için uygundur. Dökülen suyu silmeniz yeterli.", "Yes. The stone-powder and PVC core doesn't absorb water or swell, so it suits kitchens, bathrooms and hallways. Just wipe up any spills.") },
  { q: T("Može li se postaviti preko pločica?", "Fayansın üzerine döşenebilir mi?", "Can it go over tiles?"),
    a: T("Može, ako su pločice ravne i čvrste. Duboke fuge i veće neravnine prvo se izravnaju. Nema rušenja, prašine ni šuta.", "Evet, fayanslar düz ve sağlamsa. Derin derzler ve büyük pürüzler önce düzeltilir. Kırım, toz ve moloz yok.", "Yes, if the tiles are flat and solid. Deep grout lines and bigger bumps are levelled first. No demolition, dust or rubble.") },
  { q: T("Da li ide uz podno grijanje?", "Yerden ısıtmayla kullanılır mı?", "Does it work with underfloor heating?"),
    a: T("Da, sve kolekcije su pogodne za podno grijanje na vodu.", "Evet, tüm koleksiyonlar sulu yerden ısıtmaya uygundur.", "Yes, every collection suits water-based underfloor heating.") },
  { q: T("Treba li posebna podloga?", "Ayrıca altlık gerekir mi?", "Do I need a separate underlay?"),
    a: T("Ne. IXPE podloga od 1–1,5 mm je već zalijepljena ispod svake daske.", "Hayır. 1–1,5 mm IXPE alt katman her tahtanın altına hazır yapışıktır.", "No. A 1–1.5 mm IXPE underlay is already bonded under every plank.") },
  { q: T("Koja je razlika između kolekcija?", "Koleksiyonlar arasındaki fark ne?", "What's the difference between collections?"),
    a: T("Debljina (5–6,5 mm), habajući sloj (0,3 ili 0,5 mm), format i izgled. Za kuću i stan dovoljna je svaka kolekcija; za poslovne prostore preporučujemo habajući sloj od 0,5 mm.", "Kalınlık (5–6,5 mm), aşınma tabakası (0,3 veya 0,5 mm), ebat ve görünüm. Ev ve daire için her koleksiyon yeterli; iş yerleri için 0,5 mm aşınma tabakası öneriyoruz.", "Thickness (5–6.5 mm), wear layer (0.3 or 0.5 mm), format and look. Any collection is fine for homes; for commercial spaces we recommend the 0.5 mm wear layer.") },
  { q: T("Koliko traje garancija?", "Garanti süresi ne kadar?", "How long is the warranty?"),
    a: T("20 godina za stambene i 7 godina za poslovne prostore; za kolekciju Wood 15 i 3 godine.", "Konutta 20, ticari alanda 7 yıl; Wood koleksiyonunda 15 ve 3 yıl.", "20 years residential and 7 years commercial; 15 and 3 years for the Wood collection.") },
];

export default function SpcPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const [ci, setCi] = useState(0);                         // seçili koleksiyon
  const [open, setOpen] = useState<number | null>(null);   // açık desen (koleksiyon içi sıra)
  const [fmt, setFmt] = useState(0);                       // penceredeki ölçü (düz / balıksırtı)
  const [img, setImg] = useState<string | null>(null);
  const [layer, setLayer] = useState<number | null>(null);
  // m² hesaplayıcı
  const [cw, setCw] = useState("4");
  const [cl, setCl] = useState("5");
  const [cf, setCf] = useState(0);
  const [waste, setWaste] = useState(7);
  const coll = SPC_COLLS[ci];
  useFlipIn([ci]);

  // katman çizimi ekrana gelince tahta katmanlarına ayrılır
  const stageRef = useRef<HTMLDivElement>(null);
  const [spread, setSpread] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSpread(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    const n = coll.decors.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") { setOpen((i) => (i === null ? i : (i - 1 + n) % n)); setImg(null); }
      if (e.key === "ArrowRight") { setOpen((i) => (i === null ? i : (i + 1) % n)); setImg(null); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, coll]);

  const num = (v: number) => (lang === "en" ? String(v) : String(v).replace(".", ","));
  const openDecor = (i: number) => { setOpen(i); setFmt(0); setImg(null); };
  const step = (d: number) => openDecor(((open ?? 0) + d + coll.decors.length) % coll.decors.length);
  const chooseColl = (i: number) => { setCi(i); setOpen(null); setCf(0); setWaste(7); };
  const fmtLabel = (c: SpcColl) => c.formats.map((f) => KIND[f.kind][lang]).join(" · ");

  const decor = open === null ? null : coll.decors[open];
  const hasHb = coll.formats.some((f) => f.kind === "hb");
  const shots = decor ? [spcImg(coll.id, decor.no, "oda"), spcImg(coll.id, decor.no, "pl"), ...(hasHb ? [spcImg(coll.id, decor.no, "hb")] : [])] : [];
  const f = coll.formats[fmt] ?? coll.formats[0];
  const main = img ?? shots[0];
  const pickFmt = (i: number) => { setFmt(i); if (decor) setImg(spcImg(coll.id, decor.no, coll.formats[i].kind === "hb" ? "hb" : "pl")); };

  const calcF = coll.formats[cf] ?? coll.formats[0];
  const area = (parseFloat(cw.replace(",", ".")) || 0) * (parseFloat(cl.replace(",", ".")) || 0);
  const packs = area > 0 ? Math.ceil((area * (1 + waste / 100)) / calcF.m2) : 0;
  const fix = (v: number, d = 2) => (lang === "en" ? v.toFixed(d) : v.toFixed(d).replace(".", ","));
  const calcMsg = `${L("Zdravo, SPC parket", "Merhaba, SPC parke", "Hello, SPC flooring")} ${coll.name} (${KIND[calcF.kind][lang]} ${calcF.w}×${calcF.l}): ${fix(area)} m² → ${packs} ${L("paketa", "paket", "packs")} (${fix(packs * calcF.m2)} m²)`;

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("SPC parket", "SPC parke", "SPC flooring") }]} />

      {/* ===== KOLEKSİYONLAR ===== */}
      <section id="kolekcija" className={`${h.section} ${s.first}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("100% vodootporan pod", "%100 su geçirmez zemin", "100% waterproof floor")}</p>
            <h1 className={h.h2}>{L("SPC parket —", "SPC parke —", "SPC flooring —")} <em>{SPC_COLLS.length} {L("kolekcija", "koleksiyon", "collections")}, {SPC_COUNT} {L("dezen", "desen", "designs")}</em></h1>
          </div>
          <p className={h.headDesc}>{L("Izgled pravog drveta i kamena na pločama sa kamenim jezgrom: ne boji se vode, tih je pod nogama i postavlja se na klik — u daskama ili kao riblja kost.", "Taş çekirdekli tahtalarda gerçek ahşap ve taş görünümü: sudan etkilenmez, ayak altında sessizdir, tıklayarak döşenir — düz tahta veya balıksırtı.", "The look of real wood and stone on stone-core planks: unafraid of water, quiet underfoot and clicked into place — as planks or herringbone.")}</p>
        </header>

        <div className={p.tabs} role="tablist" data-reveal>
          {SPC_COLLS.map((c, i) => (
            <button key={c.id} role="tab" aria-selected={i === ci} className={i === ci ? p.tabOn : ""} onClick={() => chooseColl(i)}>
              <b>{c.name}</b><small>{c.decors.length} · {c.total} mm</small>
            </button>
          ))}
        </div>

        <div className={p.collInfo} key={coll.id}>
          <div>
            <p className={h.kicker}>{coll.look[lang]}</p>
            <p>{coll.desc[lang]}</p>
          </div>
          <dl>
            <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{num(coll.total)} mm</dd></div>
            <div><dt>{L("Habajući sloj", "Aşınma tab.", "Wear layer")}</dt><dd>{num(coll.wear)} mm</dd></div>
            <div><dt>{L("Format", "Ebat", "Format")}</dt><dd>{coll.formats.map((x) => <span key={x.kind}>{x.w} × {x.l}</span>)}</dd></div>
            <div><dt>{L("Garancija", "Garanti", "Warranty")}</dt><dd>{coll.warranty[0]} / {coll.warranty[1]} {L("god.", "yıl", "yrs")}</dd></div>
          </dl>
        </div>

        <div className={`${m.grid} ${p.grid}`}>
          {coll.decors.map((d, i) => (
            <button key={`${coll.id}-${d.no}`} className={m.card} onClick={() => openDecor(i)} data-flip>
              <span className={m.cardImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={spcImg(coll.id, d.no, "kart")} alt={`SPC ${coll.name} ${d.name}`} loading="lazy" />
                <i className={p.swatch} style={{ backgroundImage: `url("${spcImg(coll.id, d.no, "pl")}")` }} aria-hidden />
              </span>
              <span className={m.cardBody}>
                <small>{spcCode(coll, d.no)}</small>
                <b className={p.cardName}>{d.name}</b>
                <i>{fmtLabel(coll)}</i>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== SPC NEDİR ===== */}
      <section className={s.specBand}>
        <div className={s.specInner} data-reveal>
          <div className={s.specIntro}>
            <p className={h.kicker}>{L("Šta je SPC", "SPC nedir", "What is SPC")}</p>
            <h2 className={h.h2}>{L("Kamen u jezgru,", "Çekirdeği taş,", "Stone at the core,")} <em>{L("drvo na površini", "yüzeyi ahşap", "wood on the surface")}</em></h2>
            <p>{L("SPC (Stone Plastic Composite) je pod nove generacije: kruto jezgro od kamenog praha i PVC-a, na njemu dekor drveta ili kamena i zaštitni slojevi, a ispod integrisana podloga. Ima toplinu parketa, a otpornost pločica.", "SPC (Stone Plastic Composite) yeni nesil bir zemin kaplamasıdır: taş tozu ve PVC'den sert bir çekirdek, üzerinde ahşap veya taş deseni ve koruma katmanları, altında hazır alt katman. Parkenin sıcaklığına, fayansın dayanıklılığına sahiptir.", "SPC (Stone Plastic Composite) is a new-generation floor: a rigid core of stone powder and PVC, a wood or stone décor with protective layers on top, and a built-in underlay below. The warmth of parquet with the toughness of tiles.")}</p>
          </div>
          <dl className={s.specNums}>
            <div><dt>{L("Vodootpornost", "Su geçirmezlik", "Waterproof")}</dt><dd>100<small>%</small></dd></div>
            <div><dt>{L("Garancija", "Garanti", "Warranty")}</dt><dd>20<small>{L("god.", "yıl", "yrs")}</small></dd></div>
            <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>5–{num(6.5)}<small>mm</small></dd></div>
            <div><dt>{L("Dezeni", "Desen", "Designs")}</dt><dd>{SPC_COUNT}</dd></div>
          </dl>
        </div>
      </section>

      {/* ===== KATMANLAR ===== */}
      <section className={h.section}>
        <div className={p.layers}>
          <div data-reveal>
          <div ref={stageRef} className={`${p.stage} ${spread ? p.spread : ""}`} aria-hidden>
            <div className={p.stack}>
              {LAYERS.map((l, i) => (
                <div key={l.title.en} className={`${p.layer} ${l.cls} ${layer === i ? p.layerOn : ""}`} style={{ "--i": i } as CSSProperties}>
                  {Array.from({ length: l.slices }, (_, j) => <span key={j} style={{ "--j": j } as CSSProperties} />)}
                </div>
              ))}
            </div>
          </div>
          </div>
          <div data-reveal>
            <p className={h.kicker}>{L("Pet slojeva", "Beş katman", "Five layers")}</p>
            <h2 className={h.h2}>{L("Šta je", "Bir tahtanın", "What's inside")} <em>{L("u jednoj dasci", "içinde ne var", "a single plank")}</em></h2>
            <ol className={p.layerList}>
              {LAYERS.map((l, i) => (
                <li key={l.title.en} onMouseEnter={() => setLayer(i)} onMouseLeave={() => setLayer(null)} className={layer === i ? p.liOn : ""}>
                  <span>0{i + 1}</span>
                  <div><b>{l.title[lang]}</b><p>{l.text[lang]}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== DÜZ / BALIKSIRTI ===== */}
      <section className={`${h.section} ${p.tight}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Dva načina polaganja", "İki döşeme şekli", "Two ways to lay it")}</p>
            <h2 className={h.h2}>{L("Daske ili", "Düz tahta mı,", "Planks or")} <em>{L("riblja kost", "balıksırtı mı", "herringbone")}</em></h2>
          </div>
          <p className={h.headDesc}>{L("Kolekcije Authentic, Diamonds, Originals i Wood dolaze u oba formata, u istom dezenu.", "Authentic, Diamonds, Originals ve Wood koleksiyonları aynı desende iki ebatta da gelir.", "The Authentic, Diamonds, Originals and Wood collections come in both formats, in the same design.")}</p>
        </header>
        <div className={p.ways}>
          {[{ kind: "pl" as const, size: "228 × 1220 mm", text: T("Klasičan izgled koji prostor čini širim i mirnijim. Brzo se postavlja.", "Mekânı daha geniş ve sakin gösteren klasik görünüm. Hızlı döşenir.", "A classic look that makes a room feel wider and calmer. Quick to lay.") },
            { kind: "hb" as const, size: "150 × 750 mm", text: T("Kratke daske u cik-cak šari — elegantan, tradicionalni izgled parketa.", "Zikzak desende kısa tahtalar — zarif, geleneksel parke görünümü.", "Short planks in a zigzag pattern — an elegant, traditional parquet look.") }].map((w) => (
            <figure key={w.kind} data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={spcImg("authentic", 502, w.kind)} alt={KIND[w.kind][lang]} loading="lazy" />
              <figcaption><b>{KIND[w.kind][lang]}</b><small>{w.size}</small><p>{w.text[lang]}</p></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== KARŞILAŞTIRMA ===== */}
      <section className={`${h.section} ${p.tight}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Uporedite", "Karşılaştırın", "Compare")}</p>
            <h2 className={h.h2}>{L("Sve kolekcije", "Tüm koleksiyonlar", "All collections")} <em>{L("na jednom mjestu", "tek tabloda", "at a glance")}</em></h2>
          </div>
        </header>
        <div className={p.tableWrap} data-reveal>
          <table className={p.table}>
            <thead><tr>
              <th>{L("Kolekcija", "Koleksiyon", "Collection")}</th><th>{L("Dezeni", "Desen", "Designs")}</th><th>{L("Debljina", "Kalınlık", "Thickness")}</th>
              <th>{L("Habajući sloj", "Aşınma tab.", "Wear layer")}</th><th>{L("Format (mm)", "Ebat (mm)", "Format (mm)")}</th><th>{L("Paket", "Paket", "Pack")}</th><th>{L("Garancija", "Garanti", "Warranty")}</th>
            </tr></thead>
            <tbody>
              {SPC_COLLS.map((c, i) => (
                <tr key={c.id} onClick={() => { chooseColl(i); document.getElementById("kolekcija")?.scrollIntoView({ behavior: "smooth" }); }}>
                  <td><b>{c.name}</b><small>{c.look[lang]}</small></td>
                  <td>{c.decors.length}</td>
                  <td>{num(c.total)} mm</td>
                  <td>{num(c.wear)} mm</td>
                  <td>{c.formats.map((x) => <span key={x.kind}>{KIND[x.kind][lang]} {x.w}×{x.l}</span>)}</td>
                  <td>{c.formats.map((x) => <span key={x.kind}>{num(x.m2)} m²</span>)}</td>
                  <td>{c.warranty[0]} / {c.warranty[1]} {L("god.", "yıl", "yrs")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={p.tableNote}>{L("Garancija: stambeni / poslovni prostor.", "Garanti: konut / ticari alan.", "Warranty: residential / commercial.")}</p>
      </section>

      {/* ===== AVANTAJLAR ===== */}
      <section className={`${h.section} ${p.tight}`}>
        <header className={`${h.head} ${h.headCenter}`} data-reveal>
          <div>
            <p className={h.kicker}>{L("Zašto SPC", "Neden SPC", "Why SPC")}</p>
            <h2 className={h.h2}>{L("8 razloga za", "SPC parkeyi seçmek için", "8 reasons to choose")} <em>{L("SPC parket", "8 neden", "SPC flooring")}</em></h2>
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

      {/* ===== HESAPLAYICI ===== */}
      <section className={s.specBand}>
        <div className={p.calc} data-reveal>
          <div>
            <p className={h.kicker}>{L("Kalkulator", "Hesaplayıcı", "Calculator")}</p>
            <h2 className={h.h2}>{L("Koliko paketa", "Kaç paket", "How many packs")} <em>{L("vam treba?", "gerekir?", "do you need?")}</em></h2>
            <p>{L("Unesite mjere prostorije. Dodajemo rezervu za sječenje: 5–7% za daske, 10–15% za riblju kost.", "Oda ölçülerini girin. Kesim payı ekliyoruz: düz tahtada %5–7, balıksırtında %10–15.", "Enter the room size. We add a cutting allowance: 5–7% for planks, 10–15% for herringbone.")}</p>
          </div>
          <div className={p.calcBox}>
            <div className={p.calcRow}>
              <label>{L("Kolekcija", "Koleksiyon", "Collection")}
                <select value={ci} onChange={(e) => chooseColl(+e.target.value)}>
                  {SPC_COLLS.map((c, i) => <option key={c.id} value={i}>{c.name}</option>)}
                </select>
              </label>
              <label>{L("Format", "Ebat", "Format")}
                <select value={cf} onChange={(e) => { setCf(+e.target.value); setWaste(coll.formats[+e.target.value].kind === "hb" ? 12 : 7); }}>
                  {coll.formats.map((x, i) => <option key={x.kind} value={i}>{KIND[x.kind][lang]} {x.w}×{x.l}</option>)}
                </select>
              </label>
            </div>
            <div className={p.calcRow}>
              <label>{L("Širina (m)", "En (m)", "Width (m)")}<input inputMode="decimal" value={cw} onChange={(e) => setCw(e.target.value)} /></label>
              <label>{L("Dužina (m)", "Boy (m)", "Length (m)")}<input inputMode="decimal" value={cl} onChange={(e) => setCl(e.target.value)} /></label>
              <label>{L("Rezerva", "Fire payı", "Allowance")}
                <select value={waste} onChange={(e) => setWaste(+e.target.value)}>
                  {[5, 7, 10, 12, 15].map((w) => <option key={w} value={w}>{w}%</option>)}
                </select>
              </label>
            </div>
            <div className={p.calcOut}>
              <div><small>{L("Površina", "Alan", "Area")}</small><b>{fix(area)} m²</b></div>
              <div><small>{L("Paketa", "Paket", "Packs")}</small><b>{packs}</b></div>
              <div><small>{L("Ukupno", "Toplam", "Total")}</small><b>{fix(packs * calcF.m2)} m²</b></div>
            </div>
            <p className={p.calcNote}>{L("Jedan paket", "Bir paket", "One pack")}: {calcF.pcs} {L("kom.", "adet", "pcs")} · {num(calcF.m2)} m²</p>
            <a className={h.btnPrimary} href={`${PHONE.wa}?text=${encodeURIComponent(calcMsg)}`} target="_blank" rel="noopener noreferrer">{L("Pošaljite proračun na WhatsApp", "Hesabı WhatsApp'tan gönderin", "Send this on WhatsApp")} <span>→</span></a>
          </div>
        </div>
      </section>

      {/* ===== MONTAJ ===== */}
      <section className={`${h.section} ${k.tight}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Montaža", "Montaj", "Installation")}</p>
            <h2 className={h.h2}>{L("Bez ljepila,", "Yapıştırıcısız,", "No glue,")} <em>{L("bez rušenja", "kırımsız", "no demolition")}</em></h2>
          </div>
          <p className={h.headDesc}>{L("Plivajuće polaganje na klik — prostorija je spremna za korišćenje isti dan.", "Tıklamalı yüzer döşeme — oda aynı gün kullanıma hazır.", "A floating click floor — the room is ready to use the same day.")}</p>
        </header>
        <ol className={`${k.steps} ${p.steps}`}>
          {STEPS.map((st, i) => (
            <li key={st.title.en} data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
              <span>0{i + 1}</span>
              <h3>{st.title[lang]}</h3>
              <p>{st.text[lang]}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== SSS ===== */}
      <section className={`${h.section} ${k.tight}`}>
        <header className={`${h.head} ${h.headCenter}`} data-reveal>
          <div>
            <p className={h.kicker}>{L("Česta pitanja", "Sık sorulan sorular", "FAQ")}</p>
            <h2 className={h.h2}>{L("Prije", "Satın almadan", "Before")} <em>{L("kupovine", "önce", "you buy")}</em></h2>
          </div>
        </header>
        <div className={k.faq}>
          {FAQ.map((x) => (
            <details key={x.q.en} data-reveal>
              <summary>{x.q[lang]}<span aria-hidden>+</span></summary>
              <p>{x.a[lang]}</p>
            </details>
          ))}
        </div>
      </section>

      <ContactSection
        lang={lang}
        title={lang === "me" ? <>Zainteresovani za <em>SPC parket</em>?</> : lang === "tr" ? <><em>SPC parke</em> ilginizi mi çekti?</> : <>Interested in <em>SPC flooring</em>?</>}
        text={L("Pošaljite nam mjere prostorija — izračunaćemo količinu i predložiti dezen. Ili dođite u salon u Ulcinju i pogledajte uzorke.", "Oda ölçülerinizi gönderin — miktarı hesaplayıp desen önerelim. Ya da Ulcinj'deki showroom'umuza gelip numunelere bakın.", "Send us your room sizes — we'll work out the quantity and suggest a design. Or visit our Ulcinj showroom to see samples.")}
      />
      <SiteFooter lang={lang} />

      {/* ===== DESEN PENCERESİ ===== */}
      {decor && open !== null && (
        <div className={s.sheet} role="dialog" aria-modal="true" aria-label={decor.name} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className={`${s.sheetBox} ${m.sheetBox}`}>
            <button className={s.close} onClick={() => setOpen(null)} aria-label={L("Zatvori", "Kapat", "Close")}>✕</button>
            <div className={m.viewer}>
              <div className={m.viewerMain}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={main} src={main} alt={`${coll.name} ${decor.name}`} />
              </div>
              <div className={m.thumbs}>
                {shots.map((src) => (
                  <button key={src} className={src === main ? m.thumbOn : ""} onClick={() => setImg(src)} style={{ backgroundImage: `url("${src}")` }} aria-label={decor.name} />
                ))}
              </div>
            </div>
            <div className={s.sheetInfo}>
              <p className={h.kicker}>SPC {coll.name} · {coll.look[lang]}</p>
              <h2>{decor.name}</h2>

              {coll.formats.length > 1 && (
                <div className={p.fmtToggle} role="group">
                  {coll.formats.map((x, i) => (
                    <button key={x.kind} className={i === fmt ? p.fmtOn : ""} onClick={() => pickFmt(i)}>{KIND[x.kind][lang]}</button>
                  ))}
                </div>
              )}

              <dl>
                <div><dt>{L("Šifra", "Kod", "Code")}</dt><dd>{spcCode(coll, decor.no, f.kind)}</dd></div>
                <div><dt>{L("Format", "Ebat", "Size")}</dt><dd>{f.w} × {f.l} mm</dd></div>
                <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{num(coll.total)} mm · {L("habajući sloj", "aşınma tabakası", "wear layer")} {num(coll.wear)} mm</dd></div>
                <div><dt>{L("Paket", "Paket", "Pack")}</dt><dd>{f.pcs} {L("kom.", "adet", "pcs")} · {num(f.m2)} m²</dd></div>
                <div><dt>{L("Garancija", "Garanti", "Warranty")}</dt><dd>{coll.warranty[0]} {L("god. stambeni", "yıl konut", "yrs residential")} · {coll.warranty[1]} {L("god. poslovni", "yıl ticari", "yrs commercial")}</dd></div>
              </dl>

              <p className={m.label}>{coll.name} · {coll.decors.length} {L("dezena", "desen", "designs")}</p>
              <div className={`${m.swatches} ${p.swatches}`}>
                {coll.decors.map((d, i) => (
                  <button key={d.no} className={i === open ? m.swOn : ""} onClick={() => { setOpen(i); setImg(null); }}>
                    <span style={{ backgroundImage: `url("${spcImg(coll.id, d.no, "pl")}")` }} />
                    <small>{d.no}</small>
                  </button>
                ))}
              </div>

              <div className={s.sheetChips}>
                <i>{L("Vodootporno", "Su geçirmez", "Waterproof")}</i>
                <i>{L("Podno grijanje", "Yerden ısıtma", "Underfloor heating")}</i>
                <i>{L("Klik sistem", "Tıklamalı", "Click system")}</i>
                <i>IXPE {num(coll.ixpe)} mm</i>
              </div>

              <div className={s.sheetBtns}>
                <a className={h.btnPrimary} href={`${PHONE.wa}?text=${encodeURIComponent(`SPC ${coll.name} ${decor.name} (${spcCode(coll, decor.no, f.kind)})`)}`} target="_blank" rel="noopener noreferrer">{L("Pitajte na WhatsApp-u", "WhatsApp'tan sorun", "Ask on WhatsApp")} <span>→</span></a>
                <a className={h.btnGhost} href={PHONE.href}>{L("Pozovite nas", "Bizi arayın", "Call us")}</a>
              </div>
              <div className={s.sheetNav}>
                <button onClick={() => step(-1)}>← {coll.decors[(open - 1 + coll.decors.length) % coll.decors.length].name}</button>
                <span>{open + 1} / {coll.decors.length}</span>
                <button onClick={() => step(1)}>{coll.decors[(open + 1) % coll.decors.length].name} →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
