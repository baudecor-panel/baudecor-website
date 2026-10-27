/* Akustik lamel paneller — MDF çıtalar siyah akustik keçe üzerinde; 3 seri ve renkleri */
import type { Txt } from "./site";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

/* yüzey: ahşap damarlı, düz boya veya metalik */
export type AkColor = { id: string; name: Txt; base: string; kind: "wood" | "solid" | "metal" };
export type AkSeries = {
  id: "klasik" | "premium" | "flex";
  name: string; tag: Txt; desc: Txt;
  depth: number;               // mm, keçe dahil
  sizes: string[];             // cm
  colors: AkColor[];
};

const wood = (id: string, name: Txt, base: string): AkColor => ({ id, name, base, kind: "wood" });
const solid = (id: string, name: Txt, base: string): AkColor => ({ id, name, base, kind: "solid" });
const metal = (id: string, name: Txt, base: string): AkColor => ({ id, name, base, kind: "metal" });

const OAK = T("Hrast", "Meşe", "Oak");
const WALNUT = T("Orah", "Ceviz", "Walnut");
const BLACK = T("Crna", "Siyah", "Black");
const WHITE = T("Bijela", "Beyaz", "White");

export const AK_SERIES: AkSeries[] = [
  {
    id: "klasik", name: "Klasik",
    tag: T("Prirodni furnir", "Doğal kaplama", "Natural veneer"),
    desc: T("Lamele od MDF-a sa furnirom u toplim drvenim tonovima, na crnom akustičnom filcu. Najtraženiji izgled za dnevne sobe, TV zidove i spavaće sobe.",
      "Sıcak ahşap tonlarında kaplamalı MDF çıtalar, siyah akustik keçe üzerinde. Salon, TV duvarı ve yatak odaları için en çok tercih edilen görünüm.",
      "Veneered MDF slats in warm wood tones on black acoustic felt. The most popular look for living rooms, TV walls and bedrooms."),
    depth: 14, sizes: ["60 × 245", "60 × 120", "60 × 60"],
    colors: [wood("hrast", OAK, "#c8ad86"), wood("orah", WALNUT, "#8a5f45"), solid("bijela", WHITE, "#e6e4df"), solid("crna", BLACK, "#2b2b2c")],
  },
  {
    id: "premium", name: "Premium",
    tag: T("Obloženo sa tri strane", "Üç tarafı kaplı", "Wrapped on three sides"),
    desc: T("Svaka lamela obložena je sa prednje i obje bočne strane, pa se između lamela ne vidi sirovi MDF. Najširi izbor boja — od drveta do zlatne i srebrne.",
      "Her çıta ön yüzden ve iki yandan kaplanır; çıtalar arasında ham MDF görünmez. Ahşaptan altın ve gümüşe en geniş renk seçeneği.",
      "Every slat is wrapped on the front and both sides, so no raw MDF shows between the slats. The widest choice of colours — from wood to gold and silver."),
    depth: 16, sizes: ["60 × 245"],
    colors: [
      wood("hrast", OAK, "#d4b48f"), wood("orah", WALNUT, "#8b5833"), solid("crna", BLACK, "#161616"),
      wood("antik", T("Tamni antik", "Koyu antik", "Dark antique"), "#7f6a58"), wood("venge", T("Venge", "Venge", "Wenge"), "#463f43"),
      wood("svijetli", T("Svijetli hrast", "Açık meşe", "Light oak"), "#c4b2a5"), wood("sivi-hrast", T("Sivi hrast", "Gri meşe", "Grey oak"), "#9b9fa4"),
      solid("pijesak", T("Pješčano siva", "Kum gri", "Sand grey"), "#8b968b"),
      metal("zlatna", T("Zlatna", "Altın", "Gold"), "#c99a72"), metal("srebrna", T("Srebrna", "Gümüş", "Silver"), "#c3c7c8"),
    ],
  },
  {
    id: "flex", name: "Flex",
    tag: T("Savitljivi filc", "Esnek keçe", "Flexible felt"),
    desc: T("Tanji, savitljivi filc omogućava da panel obavije stubove, zaobljene zidove i uglove. Isti izgled lamela, a postavlja se tamo gdje ravna ploča ne može.",
      "Daha ince, esnek keçe sayesinde panel kolonları, kavisli duvarları ve köşeleri sarar. Aynı lamel görünümü, düz levhanın giremediği yerlerde.",
      "A thinner, flexible felt lets the panel wrap columns, curved walls and corners. The same slat look, where a rigid board can't go."),
    depth: 14, sizes: ["60 × 245"],
    colors: [wood("hrast", OAK, "#c9b08c"), wood("orah", WALNUT, "#a8735a"), solid("crna", BLACK, "#2e2c2e"), solid("bijela", WHITE, "#e2e5e5")],
  },
];

export const AK_SLATS = 15;      // 60 cm genişlikte çıta sayısı
