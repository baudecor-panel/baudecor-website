"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/useLang";
import { PHONE, pick, type Txt } from "@/lib/site";
import { AK_COLORS, AK_HOTSPOTS, AK_SIZE, akImg } from "@/lib/akustik";
import PageHeader from "@/components/site/PageHeader";
import SiteFooter, { ContactSection } from "@/components/site/SiteFooter";
import h from "../home/Home.module.css";
import s from "@/components/site/Product.module.css";
import k from "./Akustik.module.css";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

/* panelin katmanları — föydeki 1-2-3 sırasıyla */
const PARTS: { title: Txt; text: Txt }[] = [
  { title: T("MDF", "MDF", "MDF"),
    text: T("Lamele od MDF-a — za unutrašnje prostore koji nijesu izloženi vlazi.", "MDF çıtalar — neme maruz kalmayan iç mekânlar için.", "MDF slats — for interiors that aren't exposed to moisture.") },
  { title: T("Završna obloga", "Yüzey kaplaması", "Finish"),
    text: T("MDF lamele obložene su sa tri strane, pa se ni između lamela ne vidi sirovi materijal.", "MDF çıtalar üç taraftan kaplıdır; çıtaların arasında bile ham malzeme görünmez.", "The MDF slats are wrapped on three sides, so no raw material shows even between them.") },
  { title: T("Akustični filc", "Akustik keçe", "Acoustic felt"),
    text: T("100% PET (poliesterska vlakna), sa do 50% recikliranog sadržaja. Upija zvuk i guši odjek.", "%100 PET (polyester lif), %50'ye varan geri dönüştürülmüş içerik. Sesi emer, yankıyı söndürür.", "100% PET (polyester fibre) with up to 50% recycled content. Absorbs sound and damps echo.") },
];

const USES = [T("Dnevna soba", "Oturma odası", "Living room"), T("TV zid", "TV duvarı", "TV wall"), T("Spavaća soba", "Yatak odası", "Bedroom"), T("Kancelarija", "Ofis", "Office"), T("Sala za sastanke", "Toplantı odası", "Meeting room"), T("Studio", "Stüdyo", "Studio"), T("Restoran i kafić", "Restoran ve kafe", "Restaurant & café"), T("Hotel", "Otel", "Hotel")];

const STEPS: { title: Txt; text: Txt }[] = [
  { title: T("Izmjerite i isijecite", "Ölçün ve kesin", "Measure and cut"),
    text: T("Panel se skraćuje običnom testerom, a filc se reže skalpelom — npr. oko utičnica i prekidača.", "Panel sıradan bir testereyle kısaltılır, keçe maket bıçağıyla kesilir — örneğin priz ve anahtar çevresinde.", "Shorten the panel with an ordinary saw and cut the felt with a utility knife — e.g. around sockets and switches.") },
  { title: T("Zalijepite", "Yapıştırın", "Glue it on"),
    text: T("Nanesite jak silikon na poleđinu panela i pritisnite ga uz zid — bez bušenja i šrafova.", "Panelin arkasına güçlü silikon sürün ve duvara bastırın — delme ve vida gerekmez.", "Apply strong silicone to the back of the panel and press it to the wall — no drilling or screws.") },
  { title: T("Nastavite niz", "Sırayı sürdürün", "Carry on"),
    text: T("Sljedeći panel se stavlja tik uz prethodni, pa se spoj ne primjećuje i zid izgleda kao jedna cjelina.", "Sonraki panel bir öncekinin hemen yanına konur; derz fark edilmez, duvar tek parça görünür.", "Place the next panel right against the last one — the joint disappears and the wall reads as one surface.") },
];

const FAQ: { q: Txt; a: Txt }[] = [
  { q: T("Da li panel zaustavlja buku iz susjednog stana?", "Panel yan daireden gelen gürültüyü keser mi?", "Will the panel stop noise from next door?"),
    a: T("Ne — akustični panel ne izoluje zvuk između prostorija. On upija zvuk unutar prostorije u kojoj je postavljen i smanjuje odjek, pa prostor zvuči mirnije i jasnije.", "Hayır — akustik panel odalar arası ses yalıtımı yapmaz. Kurulduğu odadaki sesi emer ve yankıyı azaltır; mekân daha sakin ve net duyulur.", "No — an acoustic panel doesn't block sound between rooms. It absorbs sound inside the room it's in and reduces echo, so the space sounds calmer and clearer.") },
  { q: T("Može li u kupatilo ili kuhinju?", "Banyo veya mutfağa olur mu?", "Can it go in a bathroom or kitchen?"),
    a: T("Ne preporučujemo ga u prostorima izloženim vlazi — MDF nije otporan na vodu. Panel je namijenjen suvim unutrašnjim prostorima.", "Neme maruz kalan yerlerde önermiyoruz — MDF suya dayanıklı değildir. Panel kuru iç mekânlar içindir.", "We don't recommend it in damp spaces — MDF isn't water-resistant. The panel is meant for dry interiors.") },
  { q: T("Može li oko stuba ili na zaobljen zid?", "Kolona veya kavisli duvara olur mu?", "Can it wrap a column or a curved wall?"),
    a: T("Da — filc je fleksibilan, pa panel prati zaobljene površine.", "Evet — keçe esnek olduğu için panel kavisli yüzeyleri takip eder.", "Yes — the felt is flexible, so the panel follows curved surfaces.") },
  { q: T("Mogu li ga postaviti sam?", "Kendim monte edebilir miyim?", "Can I install it myself?"),
    a: T("Da — dovoljan je jak silikon. Panel se lijepi direktno na zid, bez bušenja i šrafova.", "Evet — güçlü bir silikon yeterli. Panel doğrudan duvara yapıştırılır, delme ve vida gerekmez.", "Yes — strong silicone is all you need. The panel glues straight onto the wall, no drilling or screws.") },
  { q: T("Šta sa utičnicama i prekidačima?", "Prizler ve anahtarlar ne olacak?", "What about sockets and switches?"),
    a: T("Na tom mjestu se izreže otvor, a utičnica se montira na površinu panela.", "O noktada delik açılır, priz panelin yüzeyine monte edilir.", "Cut an opening at that spot and mount the socket on the panel's surface.") },
  { q: T("Kako se održava?", "Nasıl temizlenir?", "How do I clean it?"),
    a: T("Usisivačem ili suvom mekom krpom.", "Elektrikli süpürge veya kuru, yumuşak bir bezle.", "With a vacuum cleaner or a dry, soft cloth.") },
];

export default function AkustikPage() {
  const [lang, setLang] = useLang();
  const L = pick(lang);
  const [ci, setCi] = useState(0);
  const [part, setPart] = useState<number | null>(null);
  const color = AK_COLORS[ci];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(h.in); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // iki rengin görselleri üst üste; seçili olan görünür (yumuşak geçiş)
  const layered = (partName: Parameters<typeof akImg>[1], alt: string, cls?: string) =>
    AK_COLORS.map((c, i) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={c.id} src={akImg(c.id, partName)} alt={i === ci ? alt : ""} aria-hidden={i !== ci} className={`${k.layer} ${cls ?? ""}`} data-on={i === ci || undefined} />
    ));

  return (
    <div className={`${h.page} ${s.page}`}>
      <PageHeader lang={lang} setLang={setLang} crumbs={[{ href: "/", label: L("Početna", "Ana sayfa", "Home") }, { label: L("Akustični paneli", "Akustik paneller", "Acoustic panels") }]} />

      {/* ===== RENK SEÇİMİ ===== */}
      <section className={`${h.section} ${s.first} ${k.config}`}>
        <div className={k.configText}>
          <p className={h.kicker}>{L("Akustični paneli", "Akustik paneller", "Acoustic panels")}</p>
          <h1 className={h.h2}>{L("Prirodan izgled.", "Doğal görünüm.", "A natural look.")} <em>{L("Mirniji prostor.", "Daha sakin bir mekân.", "A calmer room.")}</em></h1>
          <p className={k.lead}>{L("Spoj estetike i funkcionalnosti za moderniji i ugodniji prostor: drvene lamele na crnom akustičnom filcu upijaju odjek i daju zidu toplinu drveta.", "Daha modern ve konforlu bir mekân için estetik ile işlevin birleşimi: siyah akustik keçe üzerindeki ahşap çıtalar yankıyı emer, duvara ahşabın sıcaklığını katar.", "Where looks meet function for a more modern, comfortable room: wooden slats on black acoustic felt soak up echo and give the wall the warmth of wood.")}</p>

          <p className={k.label}>{L("Odaberite boju", "Renk seçin", "Choose a colour")}</p>
          <div className={k.colors}>
            {AK_COLORS.map((c, i) => (
              <button key={c.id} className={i === ci ? k.colorOn : ""} onClick={() => setCi(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={akImg(c.id, "swatch")} alt="" />
                <span><b>{c.name}</b><small>{c.tone[lang]}</small></span>
              </button>
            ))}
          </div>

          {/* toplu siparişte karteladaki tüm renkler */}
          <div className={k.catalog}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/renk%20kartelas%C4%B1.jpg" alt={L("Katalog boja", "Renk kartelası", "Colour catalogue")} loading="lazy" />
            <div>
              <b>{L("Svaka boja iz kataloga", "Kartelanın tüm renkleri", "Any colour from the catalogue")}</b>
              <p>{L("Za veće narudžbe panele izrađujemo u bilo kojoj boji iz našeg kataloga dekora. Katalog je u salonu u Ulcinju.", "Toplu siparişlerde panelleri dekor kartelamızdaki dilediğiniz renkte üretiyoruz. Kartela Ulcinj'deki showroom'umuzda.", "For larger orders we make the panels in any colour from our decor catalogue. The catalogue is at our Ulcinj showroom.")}</p>
              <small>{L("3–4 sedmice · uz minimalnu količinu", "3–4 hafta · minimum adetle", "3–4 weeks · minimum quantity applies")}</small>
            </div>
          </div>

          <dl className={k.specs}>
            <div><dt>{L("Dimenzije", "Ölçüler", "Size")}</dt><dd>{AK_SIZE.width} × {AK_SIZE.height} cm</dd></div>
            <div><dt>{L("Lamele", "Çıtalar", "Slats")}</dt><dd>{L("MDF, obložene sa tri strane", "MDF, üç taraftan kaplı", "MDF, wrapped on three sides")}</dd></div>
            <div><dt>{L("Podloga", "Taban", "Backing")}</dt><dd>{L("Fleksibilni akustični filc, 100% PET", "Esnek akustik keçe, %100 PET", "Flexible acoustic felt, 100% PET")}</dd></div>
            <div><dt>{L("Primjena", "Kullanım", "Use")}</dt><dd>{L("Unutrašnji prostori bez vlage", "Nemsiz iç mekânlar", "Dry interiors")}</dd></div>
          </dl>

          <div className={k.btns}>
            <a className={h.btnPrimary} href={`${PHONE.wa}?text=${encodeURIComponent(`${L("Akustični panel", "Akustik panel", "Acoustic panel")} ${color.name} ${AK_SIZE.width}×${AK_SIZE.height} cm`)}`} target="_blank" rel="noopener noreferrer">{L("Pitajte na WhatsApp-u", "WhatsApp'tan sorun", "Ask on WhatsApp")} <span>→</span></a>
            <a className={h.btnGhost} href={PHONE.href}>{L("Pozovite nas", "Bizi arayın", "Call us")}</a>
          </div>
        </div>

        {/* sahne: tek panel, föydeki gibi oklu ölçü çizgileriyle */}
        <div className={k.stage}>
          <div className={k.room}>
            <div className={k.wall}>
              <div className={k.panel}>
                {layered("panel", `${L("Akustični panel", "Akustik panel", "Acoustic panel")} ${color.name}`)}
              </div>
              <span className={k.dimH}><i /><b>{AK_SIZE.width} cm</b></span>
              <span className={k.dimV}><i /><b>{AK_SIZE.height} cm</b><i /></span>
            </div>
            <span className={k.shade} aria-hidden />
          </div>
          <p className={k.caption}>{color.name} · {L("jedan panel", "bir panel", "one panel")} · {AK_SIZE.width} × {AK_SIZE.height} cm</p>
        </div>
      </section>

      {/* ===== ANATOMİ ===== */}
      <section className={s.specBand}>
        <div className={k.anatomy} data-reveal>
          <div className={k.closeup}>
            {layered("closeup", L("Lamele izbliza", "Yakın çekim çıtalar", "Slats up close"))}
            {AK_HOTSPOTS.map((p, i) => (
              <button key={i} className={k.hot} data-on={part === i || undefined} style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onMouseEnter={() => setPart(i)} onMouseLeave={() => setPart(null)} onFocus={() => setPart(i)} onBlur={() => setPart(null)} aria-label={PARTS[i].title[lang]}>
                {i + 1}
              </button>
            ))}
          </div>
          <div>
            <p className={h.kicker}>{L("Iz čega se sastoji", "Nelerden oluşur", "What it's made of")}</p>
            <h2 className={h.h2}>{L("Tri sloja,", "Üç katman,", "Three layers,")} <em>{L("jedan panel", "tek panel", "one panel")}</em></h2>
            <ol className={k.parts}>
              {PARTS.map((p, i) => (
                <li key={p.title.en} data-on={part === i || undefined} onMouseEnter={() => setPart(i)} onMouseLeave={() => setPart(null)}>
                  <span className={k.partImg}>{layered(`d${i + 1}` as "d1", p.title[lang])}<em>{i + 1}</em></span>
                  <div><h3>{p.title[lang]}</h3><p>{p.text[lang]}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== ESNEKLİK ===== */}
      <section className={h.section}>
        <div className={k.flex} data-reveal>
          <div>
            <p className={h.kicker}>{L("Fleksibilnost", "Esneklik", "Flexibility")}</p>
            <h2 className={h.h2}>{L("Prati svaku", "Her kıvrımı", "Follows every")} <em>{L("krivinu", "takip eder", "curve")}</em></h2>
            <p className={k.lead}>{L("Fleksibilna podloga od akustičnog filca savija se zajedno sa lamelama, pa panel može da obavije stub, zaobljen zid ili šank — tamo gdje kruta ploča ne može.", "Akustik keçeden esnek taban çıtalarla birlikte bükülür; panel kolonu, kavisli duvarı ya da bar tezgâhını sarabilir — sert levhanın giremediği yerlerde.", "The flexible acoustic-felt backing bends with the slats, so the panel can wrap a column, a curved wall or a bar counter — where a rigid board can't go.")}</p>
          </div>
          <div className={k.arc}>{layered("flex", L("Fleksibilna podloga od akustičnog filca", "Akustik keçeden esnek taban", "Flexible acoustic-felt backing"))}</div>
        </div>
      </section>

      {/* ===== MONTAJ ===== */}
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
        text={L("Pošaljite nam mjere zida — izračunaćemo koliko panela vam treba. Ili nas posjetite u salonu u Ulcinju.", "Duvar ölçülerinizi gönderin — kaç panel gerektiğini hesaplayalım. Ya da Ulcinj'deki showroom'umuza uğrayın.", "Send us your wall measurements — we'll work out how many panels you need. Or visit our showroom in Ulcinj.")}
      />
      <SiteFooter lang={lang} />
    </div>
  );
}
