/* AdaWall duvar kağıdı kataloğu — veri tipleri, öne çıkanlar ve etiket çevirileri */
import type { Lang } from "./i18n";

export type WpColor = { code: string; name: string | null; img: string; thumb: string; colors: string[] };
export type WpSeries = {
  id: string; code: string; title: string; collection: string; room: string | null;
  rooms: string[]; styles: string[]; repeat: string | null; isNew: boolean; colors: WpColor[];
  name?: { tr: string; me: string; en: string };
};
export type WpCollection = { id: string; name: string; series: WpSeries[] };
export type WpCatalog = { source: string; syncedAt: string; collections: WpCollection[] };

/* Ana sayfadaki "Duvarında Gör" için seçilen desenler */
export type Featured = { code: string; series: string; collection: string; img: string; room: string; tile: number };
export const FEATURED: Featured[] = [
  { code: "7811-3", series: "7811", collection: "SEVEN", img: "/duvar-kagidi/desen/7811-3.webp", room: "/duvar-kagidi/oda/seven-7811-serie.webp", tile: 0.53 },
  { code: "1303-5", series: "1303", collection: "ROCOCO", img: "/duvar-kagidi/desen/1303-5.webp", room: "/duvar-kagidi/oda/rococo-1303-series.webp", tile: 0.6 },
  { code: "9909-3", series: "9909", collection: "TROPICANO", img: "/duvar-kagidi/desen/9909-3.webp", room: "/duvar-kagidi/oda/tropicano-9909-serisi.webp", tile: 0.7 },
  { code: "23105-3", series: "23105", collection: "ROKA", img: "/duvar-kagidi/desen/23105-3.webp", room: "/duvar-kagidi/oda/roka-23105-serisi.webp", tile: 0.6 },
  { code: "1109-4", series: "1109", collection: "BETA", img: "/duvar-kagidi/desen/1109-4.webp", room: "/duvar-kagidi/oda/beta-1109-series.webp", tile: 0.9 },
  { code: "1215-1", series: "1215", collection: "OCTAGON", img: "/duvar-kagidi/desen/1215-1.webp", room: "/duvar-kagidi/oda/octagon-1215-series.webp", tile: 0.8 },
  { code: "5806-6", series: "5806", collection: "EPHES", img: "/duvar-kagidi/desen/5806-6.webp", room: "/duvar-kagidi/oda/ephes-5806-serie.webp", tile: 0.6 },
  { code: "OP2206", series: "LINO", collection: "OPUS", img: "/duvar-kagidi/desen/op2206.webp", room: "/duvar-kagidi/oda/opus-vol-1-lino-series.webp", tile: 0.53 },
];

/* AdaWall etiketleri Türkçe gelir — ME/EN karşılıkları */
const LABELS: Record<string, { me: string; en: string }> = {
  "Oturma odası": { me: "Dnevna soba", en: "Living room" },
  "Mutfak": { me: "Kuhinja", en: "Kitchen" },
  "Çalışma odası / ofis": { me: "Radna soba / kancelarija", en: "Study / office" },
  "Banyo": { me: "Kupatilo", en: "Bathroom" },
  "Çocuk odası": { me: "Dječija soba", en: "Kids' room" },
  "Stüdyo / Loft": { me: "Studio / loft", en: "Studio / loft" },
  "Yatak odası": { me: "Spavaća soba", en: "Bedroom" },
  "Koridor ve hol": { me: "Hodnik", en: "Hallway" },
  "Genç Odası": { me: "Tinejdžerska soba", en: "Teen room" },
  "Yemek odası": { me: "Trpezarija", en: "Dining room" },
  "Klasik": { me: "Klasično", en: "Classic" },
  "Taş ve Çini": { me: "Kamen i keramika", en: "Stone & tile" },
  "Kentsel": { me: "Urbano", en: "Urban" },
  "Çiçek": { me: "Cvjetno", en: "Floral" },
  "Provence ve Romantik": { me: "Provansa i romantika", en: "Provence & romantic" },
  "Yapraklar": { me: "Listovi", en: "Leaves" },
  "Doğa": { me: "Priroda", en: "Nature" },
  "Soyut": { me: "Apstraktno", en: "Abstract" },
  "Minimalizm": { me: "Minimalizam", en: "Minimalism" },
  "Doğu": { me: "Orijentalno", en: "Oriental" },
  "Modern": { me: "Moderno", en: "Modern" },
  "Geometrik": { me: "Geometrijsko", en: "Geometric" },
  "Plain or Textured": { me: "Jednobojno / teksturirano", en: "Plain or textured" },
  "Damask": { me: "Damask", en: "Damask" },
  "Çizgili": { me: "Prugasto", en: "Striped" },
  "Gri": { me: "Siva", en: "Grey" }, "Yeşil": { me: "Zelena", en: "Green" }, "Koyu": { me: "Tamna", en: "Dark" },
  "Gümüş": { me: "Srebrna", en: "Silver" }, "Mor": { me: "Ljubičasta", en: "Purple" }, "Mavi": { me: "Plava", en: "Blue" },
  "Bej": { me: "Bež", en: "Beige" }, "Beyaz": { me: "Bijela", en: "White" }, "Kahverengi": { me: "Smeđa", en: "Brown" },
  "Altın": { me: "Zlatna", en: "Gold" }, "Kırmızı": { me: "Crvena", en: "Red" }, "Pembe": { me: "Roze", en: "Pink" },
  "Sarı": { me: "Žuta", en: "Yellow" }, "Turuncu": { me: "Narandžasta", en: "Orange" }, "Siyah": { me: "Crna", en: "Black" },
  "Açık": { me: "Svijetla", en: "Light" }, "Krem": { me: "Krem", en: "Cream" }, "Turkuaz": { me: "Tirkizna", en: "Turquoise" },
  "Bordo": { me: "Bordo", en: "Burgundy" }, "Lacivert": { me: "Teget", en: "Navy" },
  "Bakır": { me: "Bakarna", en: "Copper" }, "Çok renkli": { me: "Višebojna", en: "Multicolour" },
  "Hayvan ve Kuş": { me: "Životinje i ptice", en: "Animals & birds" }, "Poster": { me: "Poster", en: "Mural" },
  "Küçük": { me: "Mali", en: "Small" }, "Orta": { me: "Srednji", en: "Medium" }, "Büyük": { me: "Veliki", en: "Large" },
};
export const label = (tr: string, lang: Lang) => (lang === "tr" ? tr : LABELS[tr]?.[lang] ?? tr);

