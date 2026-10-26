/* AdaWall koleksiyon bilgileri: kısa tanıtım + teknik özellikler (kaynak: adawall.com.tr/tr/koleksiyonlar) */
import type { Lang } from "./i18n";
import type { WpSeries } from "./wallpapers";

type T3 = { tr: string; me: string; en: string };
type Material = "nonwoven-vinyl" | "paper-vinyl" | "textile-vinyl";

export type WpSpecs = {
  range?: string;          // seri numara aralığı
  width: number;           // rulo eni (m)
  lengths: number[];       // rulo boyu seçenekleri (m)
  packs?: number[];        // paket başına rulo
  material: Material;
  paste?: boolean;         // tutkal kağıda sürülür
  weight?: number;         // g/m²
};

const ROLL: Omit<WpSpecs, "range"> = { width: 1.06, lengths: [10, 15.6], packs: [4, 6], material: "nonwoven-vinyl", paste: true };
const OPUS: WpSpecs = { width: 1.37, lengths: [12], material: "textile-vinyl", weight: 340 };

export const COLLECTION_INFO: Record<string, { desc: T3; specs: WpSpecs }> = {
  seven: {
    specs: { ...ROLL, range: "7800 – 7817" },
    desc: {
      tr: "Yedi sayısının gizeminden ilham alan SEVEN; geometrik motifleri, klasik süslemeleri ve yumuşak modern desenleri dengeli, sofistike bir koleksiyonda buluşturuyor.",
      me: "SEVEN je inspirisan misterijom broja sedam: geometrijski motivi, klasični ornamenti i mekani moderni dezeni u uravnoteženoj, sofisticiranoj kolekciji.",
      en: "Inspired by the mystery of the number seven, SEVEN blends geometric motifs, classic ornaments and soft modern patterns into a balanced, sophisticated collection.",
    },
  },
  alfa: {
    specs: { width: 1.06, lengths: [15.6], packs: [4], material: "paper-vinyl", range: "3700 – 3719" },
    desc: {
      tr: "Tekstilden yola çıkan ALFA; doğal renk tonları ve sade dokularla dengeli, minimal iç mekanlar için tasarlandı.",
      me: "ALFA polazi od tekstila: prirodni tonovi i diskretne teksture za uravnotežene, minimalističke enterijere.",
      en: "Rooted in textiles, ALFA pairs natural tones with understated textures for calm, minimal interiors.",
    },
  },
  rococo: {
    specs: { ...ROLL },
    desc: {
      tr: "Klasik damask desenlerin zamansız ihtişamını modern dokunuşlarla harmanlayan, klasik tutkunları için bir koleksiyon.",
      me: "Bezvremenski sjaj klasičnog damaska sa modernim detaljima — kolekcija za ljubitelje klasike.",
      en: "The timeless splendour of classic damask, refreshed with modern touches — a collection for lovers of the classics.",
    },
  },
  octagon: {
    specs: { ...ROLL, lengths: [10], packs: [6], range: "1201 – 1215" },
    desc: {
      tr: "Geometrik şekillerden ve modern mimariden ilham alan OCTAGON, modernliği ve şıklığı aynı ölçüde harmanlıyor.",
      me: "Inspirisan geometrijom i modernom arhitekturom, OCTAGON u istoj mjeri spaja modernost i eleganciju.",
      en: "Inspired by geometry and modern architecture, OCTAGON balances modernity and elegance in equal measure.",
    },
  },
  roka: {
    specs: { ...ROLL, lengths: [15.6], packs: [4], range: "23101 – 23115" },
    desc: {
      tr: "Taş, mermer, tuğla ve beton desenleriyle doğanın esintisini yaşam alanlarına taşıyan modern koleksiyon.",
      me: "Kamen, mermer, cigla i beton — moderna kolekcija koja donosi dašak prirode u vaš prostor.",
      en: "Stone, marble, brick and concrete — a modern collection that brings a breath of nature indoors.",
    },
  },
  vera: {
    specs: { ...ROLL, range: "1501 – 1514" },
    desc: {
      tr: "Şık geometrik süslemeler, çiçek tasarımları, tekstil dokuları ve mermer desenler; mat ve metalik dokularla vurgulandı.",
      me: "Elegantni geometrijski ornamenti, cvjetni dizajni, tekstilne teksture i mermer, naglašeni mat i metalik efektima.",
      en: "Elegant geometric ornaments, florals, textile textures and marble, accented with matte and metallic finishes.",
    },
  },
  tropicano: {
    specs: { width: 1.06, lengths: [15.6], packs: [4], material: "paper-vinyl", paste: true, range: "9901 – 9914" },
    desc: {
      tr: "Tropikal yağmur ormanlarından ilham alan; yeşilin ve mavinin ferah tonları, egzotik bitkiler ve renkli kuşlarla dolu bir koleksiyon.",
      me: "Inspirisana tropskim prašumama: svježi tonovi zelene i plave, egzotično bilje i šarene ptice.",
      en: "Inspired by tropical rainforests: fresh greens and blues, exotic plants and colourful birds.",
    },
  },
  icon: {
    specs: { ...ROLL, range: "24101 – 24114" },
    desc: {
      tr: "Trendleri takip eden tasarımlar, çarpıcı renk paletleri, eşsiz dokular ve etkileyici kompozisyonlar.",
      me: "Dizajni koji prate trendove, upečatljive palete boja, jedinstvene teksture i efektne kompozicije.",
      en: "Trend-led designs, striking colour palettes, unique textures and bold compositions.",
    },
  },
  beta: {
    specs: { ...ROLL, range: "1101 – 1113" },
    desc: {
      tr: "“Az çoktur” anlayışıyla tasarlanan BETA; abartıdan arınmış, sade ve akıcı desenler sunuyor.",
      me: "Dizajnirana po principu „manje je više“, BETA donosi jednostavne, tečne dezene bez suvišnih detalja.",
      en: "Designed on the “less is more” principle, BETA offers clean, flowing patterns free of excess.",
    },
  },
  omega: {
    specs: { ...ROLL, range: "23201 – 23213" },
    desc: {
      tr: "Eskitilmiş dokular, mermer ve geometrik desenlerle modern mekanlar için çok yönlü bir koleksiyon.",
      me: "Patinirane teksture, mermer i geometrijski dezeni — svestrana kolekcija za moderne prostore.",
      en: "Distressed textures, marble and geometric patterns — a versatile collection for modern spaces.",
    },
  },
  ephes: {
    specs: { ...ROLL, lengths: [10] },
    desc: {
      tr: "Klasik damask ve çiçek desenlerinden sade dokulara uzanan zamansız bir seçki.",
      me: "Bezvremenski izbor — od klasičnog damaska i cvjetnih dezena do diskretnih tekstura.",
      en: "A timeless selection, from classic damask and florals to understated textures.",
    },
  },
  muse: {
    specs: { ...ROLL, lengths: [15.6], range: "25101 – 25109" },
    desc: {
      tr: "İlhamını ışığın kırılmalarından ve gölgenin oyunlarından alan MUSE; modern çizgileri zamansız bir asaletle harmanlıyor.",
      me: "MUSE je inspirisan prelamanjem svjetlosti i igrom sjenki — moderne linije spojene sa bezvremenskom elegancijom.",
      en: "Inspired by the play of light and shadow, MUSE blends modern lines with timeless elegance.",
    },
  },
  hue: {
    specs: { ...ROLL, range: "24201 – 24208" },
    desc: {
      tr: "Tropikal yapraklar, modern damask ve sade düz desenlerle renk odaklı bir koleksiyon.",
      me: "Kolekcija posvećena boji: tropsko lišće, moderni damask i jednobojni dezeni.",
      en: "A colour-led collection of tropical leaves, modern damask and plain designs.",
    },
  },
  "opus-vol-1": {
    specs: OPUS,
    desc: {
      tr: "Tekstilin sıcak görünümünü profesyonel duvar kaplamalarının yüksek performansıyla buluşturan OPUS; konutlardan otellere ve ofislere kadar yoğun kullanıma uygun.",
      me: "OPUS spaja topli izgled tekstila sa visokim performansama profesionalnih zidnih obloga — za domove, hotele i kancelarije sa intenzivnom upotrebom.",
      en: "OPUS combines the warm look of textiles with the performance of professional wallcoverings — for homes, hotels and offices with heavy use.",
    },
  },
  "opus-vol-2": {
    specs: OPUS,
    desc: {
      tr: "OPUS serisinin ikinci cildi: keten, kenevir ve dokuma efektli yüzeylerle zamansız, yoğun kullanıma dayanıklı duvar kaplamaları.",
      me: "Drugi tom serije OPUS: površine sa efektom lana, konoplje i tkanja — bezvremenske, otporne zidne obloge.",
      en: "The second volume of OPUS: linen, hemp and woven-effect surfaces — timeless, hard-wearing wallcoverings.",
    },
  },
};

const MATERIAL: Record<Material, T3> = {
  "nonwoven-vinyl": { tr: "Non-woven taban + vinil kaplama", me: "Flis (non-woven) podloga + vinil", en: "Non-woven base + vinyl" },
  "paper-vinyl": { tr: "Kağıt taban + vinil kaplama", me: "Papirna podloga + vinil", en: "Paper base + vinyl" },
  "textile-vinyl": { tr: "Tekstil (Osnaburg) taban + vinil", me: "Tekstilna (Osnaburg) podloga + vinil", en: "Textile (Osnaburg) backing + vinyl" },
};

/* ME ve TR'de ondalık ayırıcı virgül */
const num = (n: number, lang: Lang) => (lang === "en" ? String(n) : String(n).replace(".", ","));
const or = (lang: Lang) => (lang === "me" ? " ili " : lang === "tr" ? " veya " : " or ");

/* Özellik tablosu satırları: [etiket, değer] */
export function specRows(sp: WpSpecs, lang: Lang): [string, string][] {
  const L = (t: T3) => t[lang];
  const rows: [string, string][] = [];
  if (sp.range) rows.push([L({ tr: "Seri numaraları", me: "Brojevi serija", en: "Series numbers" }), sp.range]);
  rows.push([L({ tr: "Rulo eni", me: "Širina rolne", en: "Roll width" }), `${num(sp.width, lang)} m`]);
  rows.push([L({ tr: "Rulo boyu", me: "Dužina rolne", en: "Roll length" }), sp.lengths.map((l) => `${num(l, lang)} m`).join(or(lang))]);
  rows.push([L({ tr: "Bir rulo kaplar", me: "Jedna rolna pokriva", en: "One roll covers" }), sp.lengths.map((l) => `≈ ${num(Math.round(sp.width * l * 10) / 10, lang)} m²`).join(or(lang))]);
  if (sp.packs) rows.push([L({ tr: "Paketleme", me: "Pakovanje", en: "Packaging" }), `${sp.packs.join(or(lang))} ${L({ tr: "rulo / koli", me: "rolne po kutiji", en: "rolls per box" })}`]);
  if (sp.weight) rows.push([L({ tr: "Ağırlık", me: "Težina", en: "Weight" }), `≈ ${sp.weight} g/m²`]);
  rows.push([L({ tr: "Malzeme", me: "Materijal", en: "Material" }), L(MATERIAL[sp.material])]);
  if (sp.paste) rows.push([L({ tr: "Uygulama", me: "Postavljanje", en: "Application" }), L({ tr: "Tutkal kağıda sürülür", me: "Ljepilo se nanosi na tapetu", en: "Paste the wallpaper" })]);
  return rows;
}

/* "3717 Serisi" / "9905 Serie" / "TWEED — Herringbone" → "3717" / "9905" / "TWEED" */
export const seriesNum = (code: string) => code.replace(/\s*—.*$/, "").replace(/\s+(serisi|serie|series)$/i, "").trim();

export const seriesWord = (lang: Lang) => (lang === "me" ? "Serija" : lang === "tr" ? "Seri" : "Series");

/* Seri adı seçili dilde; çeviri yoksa kısa orijinal başlık */
export const seriesName = (x: WpSeries, lang: Lang) => x.name?.[lang] ?? x.title;

/* OPUS renk adları (kaynakta yalnızca İngilizce) */
const COLOR_NAMES: Record<string, { tr: string; me: string }> = {
  "Cream Beige": { tr: "Krem Bej", me: "Krem bež" }, "Vanilla": { tr: "Vanilya", me: "Vanila" }, "Natural Beige": { tr: "Doğal Bej", me: "Prirodna bež" },
  "Pearl Grey": { tr: "İnci Gri", me: "Biserno siva" }, "Walnut Beige": { tr: "Ceviz Bej", me: "Orah bež" }, "Midnight Blue": { tr: "Gece Mavisi", me: "Ponoćno plava" },
  "Cloud": { tr: "Bulut", me: "Oblak" }, "Sand": { tr: "Kum", me: "Pijesak" }, "Fawn": { tr: "Açık Kahve", me: "Svijetlosmeđa" },
  "Honey": { tr: "Bal", me: "Med" }, "Mushroom": { tr: "Mantar", me: "Gljiva" }, "Almond Cream": { tr: "Badem Krem", me: "Bademova krem" },
  "Champagne": { tr: "Şampanya", me: "Šampanj" }, "Walnut": { tr: "Ceviz", me: "Orah" }, "Silver Mist": { tr: "Gümüş Sis", me: "Srebrna izmaglica" },
  "Ivory Sand": { tr: "Fildişi Kum", me: "Slonovača pijesak" }, "Pearl White": { tr: "İnci Beyaz", me: "Biserno bijela" }, "Ecru": { tr: "Ekru", me: "Ekru" },
  "Silver": { tr: "Gümüş", me: "Srebrna" }, "Oat": { tr: "Yulaf", me: "Zob" }, "Ice Grey": { tr: "Buz Gri", me: "Ledeno siva" },
  "Ash": { tr: "Kül", me: "Pepeljasta" }, "Navy": { tr: "Lacivert", me: "Teget" }, "Mink": { tr: "Vizon", me: "Vizon" },
  "Pale Sand": { tr: "Açık Kum", me: "Svijetli pijesak" }, "Pearl": { tr: "İnci", me: "Biser" }, "Greige": { tr: "Grej", me: "Grej" },
  "Dune": { tr: "Kumul", me: "Dina" }, "Silver Grey": { tr: "Gümüş Gri", me: "Srebrno siva" }, "Almond": { tr: "Badem", me: "Badem" },
  "Limestone": { tr: "Kireçtaşı", me: "Krečnjak" }, "Mocha": { tr: "Moka", me: "Moka" }, "Stone Grey": { tr: "Taş Gri", me: "Kameno siva" },
  "Ivory": { tr: "Fildişi", me: "Slonovača" }, "Taupe": { tr: "Vizon Gri", me: "Taupe" }, "Slate Blue": { tr: "Arduvaz Mavi", me: "Škriljac plava" },
  "Steel": { tr: "Çelik", me: "Čelik" }, "Charcoal": { tr: "Antrasit", me: "Antracit" }, "Graphite": { tr: "Grafit", me: "Grafit" },
  "Dark Taupe": { tr: "Koyu Vizon", me: "Tamni taupe" }, "Slate": { tr: "Arduvaz", me: "Škriljac" }, "Pebble": { tr: "Çakıl", me: "Šljunak" },
  "Camel": { tr: "Deve Tüyü", me: "Kamel" },
};
export const colorName = (n: string | null, lang: Lang) => (!n ? null : lang === "en" ? n : COLOR_NAMES[n]?.[lang] ?? n);
