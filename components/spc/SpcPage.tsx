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

/* Katman bilgileri üreticinin kataloğundan (s. 13, 18). t: çizimdeki kalınlık (px, abartılı) */
const LAYERS: { cls: string; t: number; title: Txt; text: Txt }[] = [
  { cls: p.lUv, t: 3, title: T("Ultra mat UV sloj", "Ultra mat UV katmanı", "Ultra-matt UV coating"),
    text: T("Gornji zaštitni sloj — štiti pod od sunčevih zraka, ogrebotina i mrlja.", "En üstteki koruma katmanı — zemini güneş ışığına, çizilmeye ve lekeye karşı korur.", "The top protective layer — shields the floor from sunlight, scratches and stains.") },
  { cls: p.lWear, t: 4, title: T("Habajući sloj 0,3–0,5 mm", "Aşınma tabakası 0,3–0,5 mm", "Wear layer 0.3–0.5 mm"),
    text: T("Providan sloj koji povećava izdržljivost i otpornost na habanje.", "Dayanıklılığı ve aşınmaya karşı direnci artıran şeffaf katman.", "A clear layer that adds durability and resistance to wear.") },
  { cls: p.lDecor, t: 3, title: T("Dekorativni film", "Desen filmi", "Décor film"),
    text: T("Daje podu prirodan izgled drveta ili kamena.", "Zemine doğal ahşap veya taş görünümü verir.", "Gives the floor a natural wood or stone look.") },
  { cls: p.lCore, t: 26, title: T("SPC kruto jezgro", "SPC sert çekirdek", "SPC rigid core"),
    text: T("Glavno tijelo od kompozita kamena i plastike — daje čvrstinu i vodootpornost. U ivice je urezan klik profil.", "Taş-plastik kompozitten ana gövde — sağlamlık ve su geçirmezlik sağlar. Kenarlarında tıklamalı kilit profili bulunur.", "The main body, a stone-plastic composite — gives strength and waterproofing. The click profile is milled into its edges.") },
  { cls: p.lIxpe, t: 9, title: T("IXPE podloga 1–1,5 mm", "IXPE alt katman 1–1,5 mm", "IXPE underlay 1–1.5 mm"),
    text: T("Podloga visoke gustine, već zalijepljena — bolja zvučna izolacija i udobniji korak.", "Hazır yapışık, yüksek yoğunluklu alt katman — daha iyi ses yalıtımı ve konfor.", "A high-density underlay, already bonded — better sound insulation and comfort.") },
];

/* Avantajlar: katalogdaki özellik listesi (s. 7, 18) ve belgeler (DoP, M1, FloorScore, ISO 22196, bakım rehberi) */
const ADVANTAGES: { icon: ReactNode; title: Txt; text: Txt }[] = [
  { icon: <path d="M12 2.5c3.5 4.2 6 7.6 6 11a6 6 0 01-12 0c0-3.4 2.5-6.8 6-11z" strokeLinejoin="round" />,
    title: T("100% vodootporan", "%100 su geçirmez", "100% waterproof"),
    text: T("Jezgro ne upija vodu i ne bubri — pogodan i za kuhinje i kupatila.", "Çekirdek su çekmez ve şişmez — mutfak ve banyoya da uygundur.", "The core doesn't absorb water or swell — suitable for kitchens and bathrooms too.") },
  { icon: <path d="M4 20h16M7 16c0-2 2-2 2-4s-2-2-2-4M12 16c0-2 2-2 2-4s-2-2-2-4M17 16c0-2 2-2 2-4s-2-2-2-4" strokeLinecap="round" />,
    title: T("Podno grijanje i hlađenje", "Yerden ısıtma ve soğutma", "Underfloor heating & cooling"),
    text: T("Za sisteme na vodu; temperatura površine do 27 °C.", "Sulu sistemlere uygun; yüzey sıcaklığı en fazla 27 °C.", "For water-based systems; surface temperature up to 27 °C.") },
  { icon: <path d="M4 14h7l2-4h7M4 10h5M15 14h5" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Laka montaža na klik", "Kolay tıklamalı montaj", "Easy click installation"),
    text: T("Plivajuće polaganje bez ljepila — daske se spajaju na klik.", "Yapıştırıcısız yüzer döşeme — tahtalar tıklayarak birleşir.", "A floating floor without glue — the planks simply click together.") },
  { icon: <path d="M3 12h3l2-5 3 10 3-7 2 2h5" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Manje buke", "Daha az gürültü", "Reduces noise"),
    text: T("Integrisana podloga visoke gustine upija zvuk koraka.", "Yüksek yoğunluklu hazır alt katman adım sesini emer.", "The built-in high-density underlay absorbs the sound of footsteps.") },
  { icon: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></>,
    title: T("Otporan na habanje", "Aşınmaya dayanıklı", "Wear-resistant"),
    text: T("Habajući sloj 0,3–0,5 mm i ultra mat UV zaštita.", "0,3–0,5 mm aşınma tabakası ve ultra mat UV koruma.", "A 0.3–0.5 mm wear layer and an ultra-matt UV finish.") },
  { icon: <><circle cx="7" cy="9" r="1.8" /><circle cx="17" cy="9" r="1.8" /><circle cx="10" cy="5.5" r="1.8" /><circle cx="14" cy="5.5" r="1.8" /><path d="M12 12c-3 0-5 3.5-5 5.5 0 1.5 1.5 2 2.5 2 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5c1 0 2.5-.5 2.5-2 0-2-2-5.5-5-5.5z" strokeLinejoin="round" /></>,
    title: T("Za kućne ljubimce", "Evcil hayvan dostu", "Pet-friendly"),
    text: T("Podnosi svakodnevni život sa ljubimcima; kandže treba redovno podrezivati.", "Evcil hayvanlarla günlük yaşama uygundur; tırnakların düzenli kesilmesi önerilir.", "Handles everyday life with pets; claws should be trimmed regularly.") },
  { icon: <path d="M13 3L5 14h6l-1 7 8-11h-6z" strokeLinejoin="round" />,
    title: T("Protivklizan i antistatičan", "Kaymaz ve antistatik", "Anti-slip & antistatic"),
    text: T("Otpornost na klizanje i električno ponašanje deklarisani po EN 14041.", "Kayma direnci ve elektriksel davranış EN 14041'e göre beyan edilmiştir.", "Slip resistance and electrical behaviour declared to EN 14041.") },
  { icon: <path d="M12 21c-5-3-8-6.5-8-11a8 8 0 0116 0c0 4.5-3 8-8 11zM9 10.5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />,
    title: T("Higijenski i zdrav", "Hijyenik ve sağlıklı", "Hygienic & healthy"),
    text: T("Antibakterijska površina (ispitana po ISO 22196), niska emisija VOC — M1 i FloorScore.", "Antibakteriyel yüzey (ISO 22196'ya göre test edildi), düşük VOC salımı — M1 ve FloorScore.", "Antibacterial surface (tested to ISO 22196), low VOC emissions — M1 and FloorScore.") },
];

/* Montaj: üreticinin Uniclic montaj kılavuzu */
const STEPS: { title: Txt; text: Txt }[] = [
  { title: T("Priprema podloge", "Zemin hazırlığı", "Prepare the base"),
    text: T("Podloga mora biti suva, ravna i čista — bez masnoće i ostataka ljepila. Meke obloge (npr. tepih) se uklanjaju, a neravnine izravnaju.", "Zemin kuru, düz ve temiz olmalı — yağ ve yapıştırıcı kalıntısı olmamalı. Halı gibi yumuşak kaplamalar kaldırılır, pürüzler düzeltilir.", "The base must be dry, level and clean — free of grease and glue residue. Soft coverings such as carpet come up, and bumps are levelled.") },
  { title: T("Aklimatizacija", "Ortama alıştırma", "Acclimatise"),
    text: T("Paketi stoje 48 sati u zatvorenim kutijama, u sredini prostorije, na 14–30 °C.", "Paketler kutularında, odanın ortasında, 14–30 °C'de 48 saat bekletilir.", "Leave the packs closed in the middle of the room for 48 hours, at 14–30 °C.") },
  { title: T("Polaganje na klik", "Tıklayarak döşeme", "Click into place"),
    text: T("Daske se spajaju pod uglom od 20–30° i spuštaju, bez ljepila. Spojevi se smiču najmanje 30 cm; prvi i zadnji red široki su najmanje 5 cm.", "Tahtalar 20–30° açıyla birleştirilip indirilir, yapıştırıcı yok. Birleşimler en az 30 cm kaydırılır; ilk ve son sıra en az 5 cm olur.", "Planks join at 20–30° and are lowered into place, without glue. Stagger the joints by at least 30 cm; the first and last rows are at least 5 cm wide.") },
  { title: T("Dilatacija i lajsne", "Genleşme payı ve süpürgelik", "Expansion gap & skirting"),
    text: T("Pod mora moći da „radi“: uz zidove, cijevi i dovratnike ostavlja se razmak koji pokrivaju lajsne, a između većih prostorija postavljaju se prelazni profili.", "Zemin hareket edebilmeli: duvar, boru ve kasa kenarlarında süpürgeliğin kapattığı bir pay bırakılır; büyük odalar arasına geçiş profili konur.", "The floor must be free to move: leave a gap at walls, pipes and door frames for the skirting to cover, and fit transition profiles between larger rooms.") },
];

/* SSS: montaj kılavuzu, bakım rehberi ve garanti belgesi */
const FAQ: { q: Txt; a: Txt }[] = [
  { q: T("Da li je SPC stvarno vodootporan?", "SPC gerçekten su geçirmez mi?", "Is SPC really waterproof?"),
    a: T("Da — proizvođač ga deklariše kao 100% vodootporan: jezgro ne upija vodu i ne bubri, pa se postavlja i u kuhinjama i kupatilima. Prolivenu tečnost obrišite što prije. Pod je samo za unutrašnje prostore, a garancija ne pokriva poplave ni curenje instalacija.", "Evet — üretici %100 su geçirmez olarak beyan ediyor: çekirdek su çekmez, şişmez; mutfak ve banyolarda da kullanılır. Dökülen sıvıyı en kısa sürede silin. Yalnızca iç mekân içindir; garanti su baskını ve tesisat sızıntısını kapsamaz.", "Yes — the manufacturer declares it 100% waterproof: the core doesn't absorb water or swell, so it is used in kitchens and bathrooms too. Wipe up spills promptly. It is for indoor use only, and the warranty doesn't cover floods or plumbing leaks.") },
  { q: T("Može li se postaviti preko postojećeg poda?", "Mevcut zeminin üzerine döşenebilir mi?", "Can it go over an existing floor?"),
    a: T("Može, ako je postojeći pod tvrd, suv, ravan i čist — npr. beton ili pločice. Meke obloge poput tepiha se uklanjaju, a neravnine i dublje fuge prethodno izravnaju.", "Evet, mevcut zemin sert, kuru, düz ve temizse — örneğin beton veya fayans. Halı gibi yumuşak kaplamalar kaldırılır, pürüzler ve derin derzler önceden düzeltilir.", "Yes, if the existing floor is hard, dry, level and clean — concrete or tiles, for example. Soft coverings such as carpet come up, and bumps and deeper grout lines are levelled first.") },
  { q: T("Da li ide uz podno grijanje?", "Yerden ısıtmayla kullanılır mı?", "Does it work with underfloor heating?"),
    a: T("Da, uz podno grijanje na vodu (EN 1264-2). Sistem radi na 18–22 °C najmanje 72 sata prije, tokom i poslije ugradnje, a temperatura površine pri korišćenju ne smije preći 27 °C.", "Evet, sulu yerden ısıtmayla (EN 1264-2). Sistem montajdan önce, montaj sırasında ve sonrasında en az 72 saat 18–22 °C'de çalıştırılır; kullanımda yüzey sıcaklığı 27 °C'yi geçmemelidir.", "Yes, with water-based underfloor heating (EN 1264-2). Run the system at 18–22 °C for at least 72 hours before, during and after installation; in use, the surface temperature must not exceed 27 °C.") },
  { q: T("Treba li posebna podloga?", "Ayrıca altlık gerekir mi?", "Do I need a separate underlay?"),
    a: T("Ne. Podloga od 1–1,5 mm je već zalijepljena ispod svake daske, pa dodatna podloga nije potrebna.", "Hayır. 1–1,5 mm alt katman her tahtanın altına hazır yapışıktır; ayrıca altlık gerekmez.", "No. A 1–1.5 mm underlay is already bonded under every plank, so no extra underlay is needed.") },
  { q: T("Kako se održava?", "Nasıl temizlenir?", "How do I look after it?"),
    a: T("Svakodnevno meka metla ili usisivač, a jednom sedmično dobro iscijeđen mop sa pH neutralnim sredstvom. Ne koristite abrazivna sredstva ni rastvarače. Ispod nogu namještaja stavite filc, a jako sunce ublažite zavjesama — kao svaki pod, i SPC vremenom može izblijedjeti na suncu.", "Günlük yumuşak süpürge veya elektrikli süpürge, haftada bir iyi sıkılmış paspas ve pH nötr temizleyici. Aşındırıcı ve solventli ürün kullanmayın. Mobilya ayaklarına keçe koyun, güçlü güneşi perdeyle kesin — her zemin gibi SPC de zamanla güneşte solabilir.", "A soft broom or vacuum daily, and a well-wrung mop with a pH-neutral cleaner once a week. Avoid abrasive or solvent cleaners. Put felt pads under furniture legs and soften strong sunlight with curtains — like any floor, SPC can fade in the sun over time.") },
  { q: T("Koja je razlika između kolekcija?", "Koleksiyonlar arasındaki fark ne?", "What's the difference between collections?"),
    a: T("Debljina (5–6,5 mm), habajući sloj (0,3 ili 0,5 mm), format i izgled. Za poslovne prostore birajte habajući sloj od 0,5 mm — uz njega je i duža garancija.", "Kalınlık (5–6,5 mm), aşınma tabakası (0,3 veya 0,5 mm), ebat ve görünüm. İş yerleri için 0,5 mm aşınma tabakasını seçin — garantisi de daha uzundur.", "Thickness (5–6.5 mm), wear layer (0.3 or 0.5 mm), format and look. For commercial spaces choose the 0.5 mm wear layer — it also carries the longer warranty.") },
  { q: T("Koliko traje garancija?", "Garanti süresi ne kadar?", "How long is the warranty?"),
    a: T("Uz habajući sloj 0,5 mm: 20 godina za stambene i 7 za poslovne prostore; uz 0,3 mm (kolekcija Wood): 15 i 3 godine. Garancija je proizvođačeva, važi za unutrašnje prostore uz pravilnu ugradnju i održavanje, a iznos naknade se smanjuje svake godine.", "0,5 mm aşınma tabakasında: konutta 20, ticari alanda 7 yıl; 0,3 mm'de (Wood koleksiyonu): 15 ve 3 yıl. Garanti üreticinindir; iç mekânda, doğru montaj ve bakımla geçerlidir ve tazminat oranı her yıl azalır.", "With a 0.5 mm wear layer: 20 years residential and 7 commercial; with 0.3 mm (Wood collection): 15 and 3 years. It is the manufacturer's warranty, valid indoors with correct installation and care, and the compensation reduces each year.") },
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
            <p>{L("SPC (Stone Plastic Composite) je pod nove generacije: kruto jezgro od kamenog praha i PVC-a, na njemu dekor drveta ili kamena i zaštitni slojevi, a ispod integrisana podloga. Izgleda kao parket, a ne boji se vode.", "SPC (Stone Plastic Composite) yeni nesil bir zemin kaplamasıdır: taş tozu ve PVC'den sert bir çekirdek, üzerinde ahşap veya taş deseni ve koruma katmanları, altında hazır alt katman. Parke gibi görünür, sudan etkilenmez.", "SPC (Stone Plastic Composite) is a new-generation floor: a rigid core of stone powder and PVC, a wood or stone décor with protective layers on top, and a built-in underlay below. It looks like parquet but isn't afraid of water.")}</p>
          </div>
          <dl className={s.specNums}>
            <div><dt>{L("Vodootpornost", "Su geçirmezlik", "Waterproof")}</dt><dd>100<small>%</small></dd></div>
            <div><dt>{L("Garancija do", "Garanti", "Warranty up to")}</dt><dd>20<small>{L("god.", "yıla kadar", "yrs")}</small></dd></div>
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
              <span className={p.shadow} />
              {LAYERS.map((l, i) => {
                const z = LAYERS.slice(i + 1).reduce((n, x) => n + x.t, 0);   // alttaki katmanların toplam kalınlığı
                return (
                  <div key={l.title.en} className={`${p.layer} ${l.cls} ${layer === i ? p.layerOn : ""}`}
                    style={{ "--i": i, "--t": `${l.t}px`, "--z": `${z}px`, "--s": `${(LAYERS.length - 1 - i) * 36}px` } as CSSProperties}>
                    <span className={p.top} /><span className={p.front} /><span className={p.side} />
                  </div>
                );
              })}
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
            <p>{L("Unesite mjere prostorije. Dodajemo rezervu za sječenje prema uputstvu proizvođača: 5–10% za daske, 10–20% za riblju kost.", "Oda ölçülerini girin. Üreticinin kılavuzuna göre kesim payı ekliyoruz: düz tahtada %5–10, balıksırtında %10–20.", "Enter the room size. We add a cutting allowance per the manufacturer's guide: 5–10% for planks, 10–20% for herringbone.")}</p>
          </div>
          <div className={p.calcBox}>
            <div className={p.calcRow}>
              <label>{L("Kolekcija", "Koleksiyon", "Collection")}
                <select value={ci} onChange={(e) => chooseColl(+e.target.value)}>
                  {SPC_COLLS.map((c, i) => <option key={c.id} value={i}>{c.name}</option>)}
                </select>
              </label>
              <label>{L("Format", "Ebat", "Format")}
                <select value={cf} onChange={(e) => { setCf(+e.target.value); setWaste(coll.formats[+e.target.value].kind === "hb" ? 15 : 7); }}>
                  {coll.formats.map((x, i) => <option key={x.kind} value={i}>{KIND[x.kind][lang]} {x.w}×{x.l}</option>)}
                </select>
              </label>
            </div>
            <div className={p.calcRow}>
              <label>{L("Širina (m)", "En (m)", "Width (m)")}<input inputMode="decimal" value={cw} onChange={(e) => setCw(e.target.value)} /></label>
              <label>{L("Dužina (m)", "Boy (m)", "Length (m)")}<input inputMode="decimal" value={cl} onChange={(e) => setCl(e.target.value)} /></label>
              <label>{L("Rezerva", "Fire payı", "Allowance")}
                <select value={waste} onChange={(e) => setWaste(+e.target.value)}>
                  {[5, 7, 10, 15, 20].map((w) => <option key={w} value={w}>{w}%</option>)}
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
            <h2 className={h.h2}>{L("Bez ljepila,", "Yapıştırıcısız,", "No glue,")} <em>{L("samo klik", "sadece tık", "just click")}</em></h2>
          </div>
          <p className={h.headDesc}>{L("Plivajuće polaganje na klik, prema uputstvu proizvođača. Dodatna podloga nije potrebna.", "Üreticinin kılavuzuna göre tıklamalı yüzer döşeme. Ayrıca altlık gerekmez.", "A floating click floor, laid to the manufacturer's instructions. No extra underlay needed.")}</p>
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
