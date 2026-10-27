/* Akustik lamel panel — MDF çıtalar esnek akustik keçe üzerinde; Baudecor ürün föylerinden (Light Oak, Teak)
   White ve Black görselleri Light Oak fotoğraflarından yeniden renklendirildi (yalnızca çıtalar) */
import type { Txt } from "./site";

export type AkColor = { id: "light-oak" | "teak" | "white" | "black"; name: string; tone: Txt };

export const AK_COLORS: AkColor[] = [
  { id: "light-oak", name: "Light Oak", tone: { me: "Svijetli hrast", tr: "Açık meşe", en: "Light oak" } },
  { id: "teak", name: "Teak", tone: { me: "Tikovina", tr: "Tik ağacı", en: "Teak" } },
  { id: "white", name: "White", tone: { me: "Bijela", tr: "Beyaz", en: "White" } },
  { id: "black", name: "Black", tone: { me: "Crna", tr: "Siyah", en: "Black" } },
];

/* föylerden kırpılan görseller: tam panel, yakın çekim, 3 detay (MDF, kaplama, keçe), esneklik fotoğrafı, renk kutusu */
export const akImg = (id: AkColor["id"], part: "panel" | "closeup" | "d1" | "d2" | "d3" | "flex" | "swatch") => `/akustik/${id}-${part}.webp`;

export const AK_SIZE = { width: 60, height: 280 };   // cm

/* yakın çekimdeki işaret noktaları (% konum) — föydeki 1-2-3 noktalarıyla aynı yer */
export const AK_HOTSPOTS = [
  { x: 86.1, y: 4.1 },
  { x: 74.4, y: 43.0 },
  { x: 80.4, y: 76.9 },
];
