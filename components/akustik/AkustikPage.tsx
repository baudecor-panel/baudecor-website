"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/useLang";
import { PHONE, pick, type Txt } from "@/lib/site";
import { AK_SERIES, AK_SLATS } from "@/lib/akustik";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import SlatWall from "./SlatWall";
import h from "../home/Home.module.css";
import s from "@/components/site/Product.module.css";
import k from "./Akustik.module.css";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

/* ses emme katsayısı (125–4000 Hz) — tedarikçi ölçüm grafiğinden */
const FREQ = [125, 250, 500, 1000, 2000, 4000];
const ABS_WALL = [0.05, 0.11, 0.31, 0.7, 0.98, 0.75];
const ABS_WOOL = [0.3, 0.7, 1.0, 0.95, 0.85, 0.8];

const LAYERS: { title: Txt; text: Txt }[] = [
  { title: T("Akustični filc", "Akustik keçe", "Acoustic felt"),
    text: T("Crni filc od recikliranih vlakana upija zvučne talase i guši odjek.", "Geri dönüştürülmüş liflerden siyah keçe ses dalgalarını emer, yankıyı söndürür.", "Black felt made from recycled fibres soaks up sound waves and damps echo.") },
  { title: T("Lamele", "Çıtalar", "Slats"),
    text: T("MDF lamele razbijaju i raspršuju zvuk koji se odbija od zida.", "MDF çıtalar duvardan yansıyan sesi kırar ve dağıtır.", "MDF slats break up and diffuse the sound bouncing off the wall.") },
  { title: T("Površina", "Yüzey", "Surface"),
    text: T("Furnir ili obloga u boji daje panelu izgled pravog drveta ili metala.", "Kaplama veya renkli yüzey panele gerçek ahşap ya da metal görünümü verir.", "Veneer or a coloured wrap gives the panel the look of real wood or metal.") },
];

const USES = [T("Dnevna soba", "Oturma odası", "Living room"), T("TV zid", "TV duvarı", "TV wall"), T("Spavaća soba", "Yatak odası", "Bedroom"), T("Kancelarija", "Ofis", "Office"), T("Sala za sastanke", "Toplantı odası", "Meeting room"), T("Muzički studio", "Müzik stüdyosu", "Music studio"), T("Restoran i kafić", "Restoran ve kafe", "Restaurant & café"), T("Hotel", "Otel", "Hotel")];

const STEPS: { title: Txt; text: Txt }[] = [
  { title: T("Izmjerite i isijecite", "Ölçün ve kesin", "Measure and cut"),
    text: T("Lamele se sijeku običnom testerom (najbolje kružnom), a filc skalpelom — npr. oko utičnica.", "Çıtalar sıradan bir testereyle (en iyisi daire testere), keçe maket bıçağıyla kesilir — örneğin priz çevresinde.", "Cut the slats with an ordinary saw (a circular saw is best) and the felt with a utility knife — e.g. around sockets.") },
  { title: T("Pričvrstite", "Sabitleyin", "Fix to the wall"),
    text: T("Vijcima kroz filc između lamela — crni vijci se ne vide — ili ljepilom „tečni ekser“. Ide na beton, ciglu, gips-karton i drvo.", "Çıtalar arasından keçeye vidalayın — siyah vida görünmez — ya da sıvı çivi yapıştırıcısıyla. Beton, tuğla, alçıpan ve ahşaba uygundur.", "Screw through the felt between the slats — black screws disappear — or use liquid-nail adhesive. Works on concrete, brick, plasterboard and wood.") },
  { title: T("Spojite sljedeći panel", "Sonraki paneli birleştirin", "Join the next panel"),
    text: T("Paneli se nastavljaju jedan uz drugi bez vidljivog spoja, pa zid izgleda kao jedna cjelina.", "Paneller yan yana görünür derz olmadan devam eder; duvar tek parça görünür.", "Panels continue side by side with no visible joint, so the wall reads as one surface.") },
];

const FAQ: { q: Txt; a: Txt }[] = [
  { q: T("Da li panel zaustavlja buku iz susjednog stana?", "Panel yan daireden gelen gürültüyü keser mi?", "Will the panel stop noise from next door?"),
    a: T("Ne — akustični panel ne izoluje zvuk između prostorija. On upija zvuk unutar prostorije u kojoj je postavljen i uklanja odjek, pa prostor zvuči mirnije i jasnije.", "Hayır — akustik panel odalar arası ses yalıtımı yapmaz. Kurulduğu odadaki sesi emer ve yankıyı giderir; mekân daha sakin ve net duyulur.", "No — an acoustic panel doesn't block sound between rooms. It absorbs sound inside the room it's in and removes echo, so the space sounds calmer and clearer.") },
  { q: T("Mogu li ga postaviti sam?", "Kendim monte edebilir miyim?", "Can I install it myself?"),
    a: T("Da. Dovoljni su testera, odvijač i vijci ili ljepilo. Panel je lagan, pa ga može postaviti i jedna osoba.", "Evet. Testere, tornavida ve vida ya da yapıştırıcı yeterli. Panel hafif olduğu için tek kişi de monte edebilir.", "Yes. A saw, a screwdriver and screws or adhesive are all you need. The panel is light enough for one person to fit.") },
  { q: T("Može li u kupatilo ili kuhinju?", "Banyo veya mutfağa olur mu?", "Can it go in a bathroom or kitchen?"),
    a: T("Ne preporučujemo ga na mjestima gdje je u direktnom kontaktu sa vodom — MDF ne voli vlagu. Panel je namijenjen samo za enterijer.", "Suyla doğrudan temas eden yerlerde önermiyoruz — MDF nemi sevmez. Panel yalnızca iç mekân içindir.", "We don't recommend it where it meets water directly — MDF doesn't like moisture. The panel is for interiors only.") },
  { q: T("Šta sa utičnicama i prekidačima?", "Prizler ve anahtarlar ne olacak?", "What about sockets and switches?"),
    a: T("Na tom mjestu se izreže otvor, a utičnica se montira na površinu panela. Kablovi mogu da prođu iza panela kroz kanal u filcu.", "O noktada delik açılır, priz panelin yüzeyine monte edilir. Kablolar keçede açılan bir kanaldan panelin arkasından geçebilir.", "Cut an opening at that spot and mount the socket on the panel's surface. Cables can run behind the panel through a channel cut in the felt.") },
  { q: T("Može li oko stuba ili na zaobljen zid?", "Kolona veya kavisli duvara olur mu?", "Can it wrap a column or a curved wall?"),
    a: T("Da — za to je napravljena Flex serija sa savitljivim filcem.", "Evet — bunun için esnek keçeli Flex serisi var.", "Yes — that's what the Flex series with flexible felt is for.") },
  { q: T("Kako se održava?", "Nasıl temizlenir?", "How do I clean it?"),
    a: T("Usisivačem ili suvom mekom krpom.", "Elektrikli süpürge veya kuru, yumuşak bir bezle.", "With a vacuum cleaner or a dry, soft cloth.") },
];

export default function AkustikPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const [si, setSi] = useState(0);
  const [ci, setCi] = useState(0);
  const series = AK_SERIES[si];
  const color = series.colors[Math.min(ci, series.colors.length - 1)];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(h.in); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const pickSeries = (i: number) => {
    // aynı renk yeni seride de varsa korunur
    const same = AK_SERIES[i].colors.findIndex((c) => c.id === color.id);
    setSi(i); setCi(same < 0 ? 0 : same);
  };

  // grafik: x log ölçek, y 0–1
  const W = 560, H = 260, P = 34;
  const x = (i: number) => P + (i * (W - P * 2)) / (FREQ.length - 1);
  const y = (v: number) => H - P - v * (H - P * 2);
  const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("Akustični paneli", "Akustik paneller", "Acoustic panels") }]} />

      {/* ===== KONFİGÜRATÖR ===== */}
      <section className={`${h.section} ${s.first} ${k.config}`}>
        <div className={k.configText}>
          <p className={h.kicker}>{L("Akustični zidni paneli", "Akustik duvar panelleri", "Acoustic wall panels")}</p>
          <h1 className={h.h2}>{L("Tišina koja", "Görünen", "Silence you")} <em>{L("se vidi", "sessizlik", "can see")}</em></h1>
          <p className={k.lead}>{L("Drvene lamele na crnom akustičnom filcu: upijaju odjek, a zid dobija toplinu drveta. Izaberite seriju i boju.", "Siyah akustik keçe üzerinde ahşap çıtalar: yankıyı emer, duvara ahşabın sıcaklığını katar. Seri ve renk seçin.", "Wooden slats on black acoustic felt: they soak up echo and give the wall the warmth of wood. Choose a series and colour.")}</p>

          <div className={k.tabs} role="tablist">
            {AK_SERIES.map((sr, i) => (
              <button key={sr.id} role="tab" aria-selected={i === si} className={i === si ? k.tabOn : ""} onClick={() => pickSeries(i)}>
                <b>{sr.name}</b><small>{sr.tag[lang]}</small>
              </button>
            ))}
          </div>
          <p className={k.desc}>{series.desc[lang]}</p>

          <p className={k.label}>{L("Boja", "Renk", "Colour")} · <b>{color.name[lang]}</b></p>
          <div className={k.swatches}>
            {series.colors.map((c, i) => (
              <button key={c.id} className={c.id === color.id ? k.swOn : ""} onClick={() => setCi(i)} aria-label={c.name[lang]} title={c.name[lang]}>
                <SlatWall color={c} slats={5} wave={false} className={k.swatchWall} />
              </button>
            ))}
          </div>

          <dl className={k.specs}>
            <div><dt>{L("Formati", "Ölçüler", "Sizes")}</dt><dd>{series.sizes.map((z) => <span key={z}>{z} cm</span>)}</dd></div>
            <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{series.depth} mm</dd></div>
            <div><dt>{L("Lamele", "Çıtalar", "Slats")}</dt><dd>{AK_SLATS} {L("na 60 cm", "adet / 60 cm", "per 60 cm")}</dd></div>
          </dl>

          <div className={k.btns}>
            <a className={h.btnPrimary} href={`${PHONE.wa}?text=${encodeURIComponent(`${L("Akustični panel", "Akustik panel", "Acoustic panel")} ${series.name} — ${color.name[lang]}`)}`} target="_blank" rel="noopener noreferrer">{L("Pitajte na WhatsApp-u", "WhatsApp'tan sorun", "Ask on WhatsApp")} <span>→</span></a>
            <a className={h.btnGhost} href={PHONE.href}>{L("Pozovite nas", "Bizi arayın", "Call us")}</a>
          </div>
        </div>

        <div className={k.stage}>
          <div className={k.room}>
            <SlatWall color={color} slats={AK_SLATS * 2} className={k.bigWall} />
            <span className={k.light} aria-hidden />
            <span className={k.floor} aria-hidden />
          </div>
          <p className={k.caption}>{series.name} · {color.name[lang]} · {L("dva panela 60 cm", "iki panel 60 cm", "two 60 cm panels")}</p>
        </div>
      </section>

      {/* ===== NASIL ÇALIŞIR ===== */}
      <section className={s.specBand}>
        <div className={k.how} data-reveal>
          <div>
            <p className={h.kicker}>{L("Kako radi", "Nasıl çalışır", "How it works")}</p>
            <h2 className={h.h2}>{L("Tri sloja,", "Üç katman,", "Three layers,")} <em>{L("manje odjeka", "daha az yankı", "less echo")}</em></h2>
            <ol className={k.layers}>
              {LAYERS.map((l, i) => (
                <li key={l.title.en}><span>0{i + 1}</span><div><h3>{l.title[lang]}</h3><p>{l.text[lang]}</p></div></li>
              ))}
            </ol>
          </div>
          <svg className={k.section} viewBox="0 0 520 300" role="img" aria-label={L("Presjek panela", "Panel kesiti", "Panel cross-section")}>
            <rect x="0" y="0" width="60" height="300" fill="#d9d2c7" />
            <text x="30" y="290" textAnchor="middle" className={k.svgSmall}>{L("zid", "duvar", "wall")}</text>
            <rect x="60" y="0" width="22" height="300" fill="#1c1a19" />
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x="82" y={14 + i * 48} width="34" height="32" rx="2" fill="#b98f62" />)}
            {Array.from({ length: 4 }, (_, i) => {
              const yy = 40 + i * 70;
              return (
                <g key={i} className={k.wave} style={{ animationDelay: `${i * 0.35}s` }}>
                  <path d={`M500 ${yy} C 420 ${yy - 22}, 300 ${yy + 22}, 150 ${yy}`} fill="none" stroke="#087f7d" strokeWidth="2" strokeDasharray="6 6" />
                  <path d={`M150 ${yy} l10 -6 M150 ${yy} l10 6`} stroke="#087f7d" strokeWidth="2" />
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* ===== SES EMME ===== */}
      <section className={h.section}>
        <div className={k.acoustic} data-reveal>
          <div>
            <p className={h.kicker}>{L("Apsorpcija zvuka", "Ses emme", "Sound absorption")}</p>
            <h2 className={h.h2}>{lang === "me" ? <>Do klase <em>A</em></> : lang === "tr" ? <><em>A</em> sınıfına kadar</> : <>Up to class <em>A</em></>}</h2>
            <p className={k.lead}>{L("Postavljen direktno na zid, panel dostiže klasu apsorpcije D. Sa mineralnom vunom iza panela dostiže najvišu klasu A — i guta i duboke tonove.", "Doğrudan duvara monte edildiğinde panel D ses emme sınıfına ulaşır. Arkasına taş yünü konduğunda en yüksek A sınıfına çıkar — derin sesleri de yutar.", "Fixed straight to the wall, the panel reaches absorption class D. With mineral wool behind it, it reaches the top class A — swallowing low tones too.")}</p>
            <div className={k.legend}>
              <span><i className={k.lgWool} />{L("Sa mineralnom vunom — klasa A", "Taş yünü ile — A sınıfı", "With mineral wool — class A")}</span>
              <span><i className={k.lgWall} />{L("Direktno na zid — klasa D", "Doğrudan duvara — D sınıfı", "Straight on the wall — class D")}</span>
            </div>
          </div>
          <svg className={k.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={L("Koeficijent apsorpcije zvuka", "Ses emme katsayısı", "Sound absorption coefficient")}>
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => (
              <g key={v}><line x1={P} x2={W - P} y1={y(v)} y2={y(v)} className={k.grid} /><text x={P - 8} y={y(v) + 4} textAnchor="end" className={k.svgSmall}>{v.toFixed(1)}</text></g>
            ))}
            {FREQ.map((f, i) => <text key={f} x={x(i)} y={H - 10} textAnchor="middle" className={k.svgSmall}>{f}</text>)}
            <path d={line(ABS_WOOL)} className={k.lnWool} pathLength={1} />
            <path d={line(ABS_WALL)} className={k.lnWall} pathLength={1} />
            {ABS_WOOL.map((v, i) => <circle key={`a${i}`} cx={x(i)} cy={y(v)} r="3.5" className={k.dotWool} />)}
            {ABS_WALL.map((v, i) => <circle key={`b${i}`} cx={x(i)} cy={y(v)} r="3.5" className={k.dotWall} />)}
            <text x={W - P} y={P - 14} textAnchor="end" className={k.svgSmall}>Hz</text>
          </svg>
        </div>
      </section>

      {/* ===== KULLANIM + MONTAJ ===== */}
      <section className={`${h.section} ${k.tight}`}>
        <header className={h.head} data-reveal>
          <div>
            <p className={h.kicker}>{L("Montaža", "Montaj", "Installation")}</p>
            <h2 className={h.h2}>{L("Tri koraka", "Üç adımda", "Three steps")} <em>{L("do mirnog zida", "sakin bir duvar", "to a calmer wall")}</em></h2>
          </div>
          <p className={h.headDesc}>{USES.map((u) => u[lang]).join(" · ")}</p>
        </header>
        <ol className={k.steps}>
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
          {FAQ.map((f) => (
            <details key={f.q.en} data-reveal>
              <summary>{f.q[lang]}<span aria-hidden>+</span></summary>
              <p>{f.a[lang]}</p>
            </details>
          ))}
        </div>
      </section>

      <ContactSection
        lang={lang}
        title={lang === "me" ? <>Zainteresovani za <em>akustične panele</em>?</> : lang === "tr" ? <><em>Akustik paneller</em> ilginizi mi çekti?</> : <>Interested in <em>acoustic panels</em>?</>}
        text={L("Pošaljite nam mjere zida — izračunaćemo koliko panela vam treba i pomoći oko izbora serije i boje.", "Duvar ölçülerinizi gönderin — kaç panel gerektiğini hesaplayalım, seri ve renk seçiminde yardımcı olalım.", "Send us your wall measurements — we'll work out how many panels you need and help you choose a series and colour.")}
      />
      <SiteFooter lang={lang} />
    </div>
  );
}
