/* SPC parke — 7 koleksiyon, 71 desen. Kaynak: üreticinin 2025 kataloğu (desen kodları ve teknik tablolar).
   Görseller public/spc-parke/<koleksiyon>-<no>-<parça>.webp
   parça: kart (640×480 oda) · oda (1400 oda) · pl (düz tahta dokusu) · hb (balıksırtı dokusu) */
import type { Txt } from "./site";

export type SpcFormat = { kind: "pl" | "hb" | "tile" | "xl"; w: number; l: number; pcs: number; m2: number };
export type SpcDecor = { no: number; name: string };
export type SpcColl = {
  id: string; name: string; prefix: string;
  total: number; wear: number; ixpe: number; warranty: [number, number];
  formats: SpcFormat[]; look: Txt; desc: Txt; decors: SpcDecor[];
};

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });
const D = (start: number, names: string[]): SpcDecor[] => names.map((name, i) => ({ no: start + i, name }));

const AUTHENTIC = ["Gold Oak", "Natural Oak", "Amber Oak", "Melange Oak", "Kaschmir Oak", "Cognac Oak", "Bitter Oak", "Crocant Oak", "Smoked Oak", "Coffee Oak"];
const DIAMONDS = ["Ruby", "Lesedi", "Excelsior", "Eternity", "Lesatho", "Hope", "Luciano", "Sierra", "Cullinan", "Sancy"];

const PL_1220_7: SpcFormat = { kind: "pl", w: 228, l: 1220, pcs: 7, m2: 1.947 };
const HB_750_14: SpcFormat = { kind: "hb", w: 150, l: 750, pcs: 14, m2: 1.575 };
const PL_1220_9: SpcFormat = { kind: "pl", w: 228, l: 1220, pcs: 9, m2: 2.503 };
const HB_750_16: SpcFormat = { kind: "hb", w: 150, l: 750, pcs: 16, m2: 1.8 };

export const SPC_COLLS: SpcColl[] = [
  { id: "authentic", name: "Authentic", prefix: "AC", total: 6.5, wear: 0.5, ixpe: 1.5, warranty: [20, 7], formats: [PL_1220_7, HB_750_14],
    look: T("Hrast sa čvorovima", "Budaklı meşe", "Knotty oak"),
    desc: T("Najdeblja kolekcija — 6,5 mm, sa podlogom od 1,5 mm i EIR površinom čija struktura prati crtež drveta. Topli tonovi hrasta sa izraženim čvorovima, od zlatnog do tamne kafe.", "En kalın koleksiyon — 1,5 mm alt katmanlı 6,5 mm, dokusu ahşap desenini takip eden EIR yüzeyli. Belirgin budaklı sıcak meşe tonları; altın sarısından koyu kahveye.", "The thickest collection — 6.5 mm, with a 1.5 mm underlay and an EIR surface whose texture follows the wood grain. Warm oak tones with pronounced knots, from gold to dark coffee."),
    decors: D(501, AUTHENTIC) },
  { id: "diamonds", name: "Diamonds", prefix: "DM", total: 6, wear: 0.5, ixpe: 1, warranty: [20, 7], formats: [PL_1220_7, HB_750_14],
    look: T("Mirni prirodni tonovi", "Sakin doğal tonlar", "Calm natural tones"),
    desc: T("Mirna struktura drveta u svijetlim i srednjim tonovima, sa EIR površinom — za moderne i skandinavske enterijere.", "Açık ve orta tonlarda sakin ahşap dokusu, EIR yüzeyli — modern ve İskandinav iç mekânlar için.", "A calm wood grain in light and mid tones, with an EIR surface — for modern and Scandinavian interiors."),
    decors: D(301, DIAMONDS) },
  { id: "originals", name: "Originals", prefix: "OG", total: 5, wear: 0.5, ixpe: 1, warranty: [20, 7], formats: [PL_1220_9, HB_750_16],
    look: T("Od bijele do antracit", "Beyazdan antrasite", "From white to anthracite"),
    desc: T("Najširi raspon boja: od izbijeljenog i sivog hrasta do skoro crnog. Dezeni nose imena prirodnih ljepota svijeta.", "En geniş renk yelpazesi: ağartılmış ve gri meşeden neredeyse siyaha. Desenler dünyanın doğal güzelliklerinin adını taşır.", "The widest colour range: from bleached and grey oak to almost black. The designs are named after natural wonders of the world."),
    decors: D(101, ["Bryce Canyon", "Moraine Lake", "Amazon", "Kakadu", "Victoria", "Gran Canaria", "Halong Bay", "Cappadocia"]) },
  { id: "wood", name: "Wood", prefix: "WD", total: 5, wear: 0.3, ixpe: 1, warranty: [15, 3], formats: [PL_1220_9, HB_750_16],
    look: T("Klasični hrast", "Klasik meşe", "Classic oak"),
    desc: T("Klasični tonovi hrasta sa površinom „Wood“ i habajućim slojem 0,3 mm — za stanove, apartmane i spavaće sobe.", "\"Wood\" yüzeyli ve 0,3 mm aşınma tabakalı klasik meşe tonları — daireler, apartlar ve yatak odaları için.", "Classic oak tones with a \"Wood\" surface and a 0.3 mm wear layer — for flats, holiday apartments and bedrooms."),
    decors: D(201, ["Canyon Oak", "Dominicano Oak", "Havanna Oak", "Slate Oak", "Bosland Oak", "Valley Oak", "Desert Oak", "Walnut Oak", "Scraped Oak", "Cambridge Oak"]) },
  { id: "grande", name: "Grande", prefix: "GR", total: 6, wear: 0.5, ixpe: 1, warranty: [20, 7], formats: [{ kind: "pl", w: 228, l: 1524, pcs: 7, m2: 2.432 }],
    look: T("Duge daske 152 cm", "152 cm uzun tahta", "Long 152 cm planks"),
    desc: T("Duge daske od 228 × 1524 mm, pa je i poprečnih spojeva manje. Dezeni nose imena iz kolekcija Diamonds i Authentic, u većem formatu.", "228 × 1524 mm uzun tahtalar; enine birleşim daha azdır. Desenler Diamonds ve Authentic koleksiyonlarının adlarını taşır, daha büyük ebatta.", "Long 228 × 1524 mm planks, so there are fewer end joints. The designs share their names with the Diamonds and Authentic collections, in a larger format."),
    decors: [...D(301, DIAMONDS), ...D(501, AUTHENTIC)] },
  { id: "elegant", name: "Elegant", prefix: "EG", total: 6, wear: 0.5, ixpe: 1, warranty: [20, 7], formats: [{ kind: "pl", w: 182, l: 1524, pcs: 7, m2: 1.942 }],
    look: T("Uske duge daske", "İnce uzun tahta", "Slim long planks"),
    desc: T("Uske i duge daske (182 × 1524 mm) sa površinom „Wood“ — elegantan, ujednačen pod.", "\"Wood\" yüzeyli ince ve uzun tahtalar (182 × 1524 mm) — zarif, dengeli bir zemin.", "Slim, long planks (182 × 1524 mm) with a \"Wood\" surface — an elegant, even floor."),
    decors: D(203, ["Havanna Oak"]).concat(D(206, ["Valley Oak", "Desert Oak", "Walnut Oak"]), D(210, ["Cambridge Oak"])) },
  { id: "stone", name: "Stone", prefix: "ST", total: 5, wear: 0.5, ixpe: 1, warranty: [20, 7], formats: [{ kind: "tile", w: 305, l: 600, pcs: 9, m2: 1.647 }, { kind: "xl", w: 305, l: 1220, pcs: 6, m2: 2.233 }],
    look: T("Beton, mermer i škriljac", "Beton, mermer ve arduvaz", "Concrete, marble & slate"),
    desc: T("Izgled betona, mermera i škriljca u pločama na klik, 305 × 600 i 305 × 1220 mm — za kuhinje, kupatila i poslovne prostore.", "Beton, mermer ve arduvaz görünümü; 305 × 600 ve 305 × 1220 mm tıklamalı karolarda — mutfak, banyo ve iş yerleri için.", "The look of concrete, marble and slate in 305 × 600 and 305 × 1220 mm click tiles — for kitchens, bathrooms and commercial spaces."),
    decors: D(801, ["Concrete Light", "Concrete Sand", "Concrete Grey", "Concrete Dark", "Carrara Marmor", "Botticino Light", "Monreal Slate", "Botticino Dark"]) },
];

export const SPC_COUNT = SPC_COLLS.reduce((n, c) => n + c.decors.length, 0);

export const spcImg = (coll: string, no: number, part: "kart" | "oda" | "pl" | "hb") => `/spc-parke/${coll}-${no}-${part}.webp`;
export const spcCode = (c: SpcColl, no: number, kind?: SpcFormat["kind"]) =>
  `${c.prefix}-${no}${kind === "pl" ? "-PL" : kind === "hb" ? "-HB" : kind === "xl" ? "-XL" : ""}`;
