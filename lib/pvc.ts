/* PVC mermer panel kataloğu — desenler, profiller, ölçüler */
import type { Txt } from "./site";

export type PvcPattern = { name: string; code: string; img: string; tone: Txt };

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });
const WHITE = T("Bijeli mermer", "Beyaz mermer", "White marble");
const GOLD = T("Mermer sa zlatnim žilama", "Altın damarlı mermer", "Gold-veined marble");
const DARK = T("Tamni mermer", "Koyu mermer", "Dark marble");
const GREY = T("Sivi mermer", "Gri mermer", "Grey marble");
const WARM = T("Topli tonovi", "Sıcak tonlar", "Warm tones");
const COLOUR = T("Mermer u boji", "Renkli mermer", "Coloured marble");
const SOLID = T("Jednobojni", "Düz renk", "Solid colour");

export const PVC_PATTERNS: PvcPattern[] = [
  { name: "Carrara Gold", code: "PVC-03", img: "/pvc-Carrara-Gold.jpeg", tone: GOLD },
  { name: "Bianco Carrara", code: "PVC-01", img: "/pvc-bianco-carrara.jpg", tone: WHITE },
  { name: "Arabescato Brown", code: "PVC-02", img: "/pvc-Arebescato-Brown.jpg", tone: WARM },
  { name: "Marmori Grey", code: "PVC-04", img: "/pvc-Marmori-Grey.jpg", tone: GREY },
  { name: "Nero Black", code: "PVC-05", img: "/pvc-Nero-Black.jpg", tone: DARK },
  { name: "Onyx Green", code: "PVC-06", img: "/pvc-Onyx-Green.jpg", tone: COLOUR },
  { name: "Picasso", code: "PVC-07", img: "/pvc-Picasso.jpg", tone: COLOUR },
  { name: "Sahara Black", code: "PVC-08", img: "/pvc-Sahara-Black.jpg", tone: DARK },
  { name: "Sahara White", code: "PVC-09", img: "/pvc-Sahara-White.jpg", tone: WHITE },
  { name: "Vanilla", code: "PVC-10", img: "/pvc-Vanilla.jpg", tone: WARM },
  { name: "Viola", code: "PVC-11", img: "/pvc-Viola.jpg", tone: COLOUR },
  { name: "Anthracite Gray", code: "PVC-12", img: "/pvc-ANTHRACITHE-GRAY.jpg", tone: DARK },
  { name: "Alu Gray", code: "PVC-13", img: "/pvc-Alu-Gray.jpg", tone: GREY },
  { name: "Bolzano Bej", code: "PVC-14", img: "/pvc-BOLZANO-BEJ.jpg", tone: WARM },
  { name: "Blue Nile", code: "PVC-15", img: "/pvc-Blue-Nile.jpg", tone: COLOUR },
  { name: "Calacatta Gold", code: "PVC-16", img: "/pvc-CALACATTA-GOLD.jpg", tone: GOLD },
  { name: "New Carrara Gold", code: "PVC-17", img: "/pvc-NEW-CARRARA-GOLD.jpg", tone: GOLD },
  { name: "Solid White", code: "PVC-18", img: "/pvc-Solid-White.jpg", tone: SOLID },
];

/* Levha: 122 × 280 cm, 2,8 mm → 3,42 m² */
export const PVC_SHEET = { width: 122, height: 280, thickness: "2,8", area: "3,42" };

export type MetalId = "krom" | "altin" | "siyah";
export const METAL_NAMES: Record<MetalId, Txt> = {
  krom: T("Hrom", "Krom", "Chrome"),
  altin: T("Zlatna", "Altın", "Gold"),
  siyah: T("Crna", "Siyah", "Black"),
};
export const METAL_SWATCH: Record<MetalId, string> = { krom: "#dcdfe2", altin: "#d2a54e", siyah: "#1d1d1f" };

/* Alüminyum profiller — tip başına mevcut renkler ve ürün fotoğrafları */
export const PVC_PROFILES: { type: Txt; text: Txt; size: string; imgs: Partial<Record<MetalId, string>> }[] = [
  {
    type: T("Završni profil", "Bitiş profili", "End profile"), size: "10 mm",
    text: T("Čist završetak slobodnih ivica panela.", "Panelin açık kenarlarını temiz bir çizgiyle bitirir.", "A clean finish for exposed panel edges."),
    imgs: { krom: "/10-MM-ALUMINYUM-BITIS-PROFILI.jpg", siyah: "/10-MM-ALUMINYUM-BITIS-PROFILI_SIYAH.jpg" },
  },
  {
    type: T("T prelazni profil", "T geçiş profili", "T transition profile"), size: "10 mm",
    text: T("Spaja dva panela u ravni u jednu tanku liniju.", "Yan yana iki paneli ince bir çizgiyle birleştirir.", "Joins two panels side by side with a slim line."),
    imgs: { krom: "/10-MM-ALUMINYUM-T-GECIS-PROFILI.jpg", altin: "/10-MM-ALUMINYUM-T-GECIS-PROFILI-ALTIN.jpg", siyah: "/10-MM-ALUMINYUM-T-GECIS-PROFILI_SIYAH.jpg" },
  },
  {
    type: T("Unutrašnji ugaoni profil", "İç köşe profili", "Inner corner profile"), size: "12 mm",
    text: T("Za unutrašnje uglove prostorije.", "Odanın iç köşeleri için.", "For the inner corners of a room."),
    imgs: { krom: "/12-MM-ALUMINYUM-IC-KOSE-PROFILI.jpg", altin: "/12-MM-ALUMINYUM-IC-KOSE-PROFILI-ALTIN.jpg", siyah: "/12-MM-ALUMINYUM-IC-KOSE-PROFILI_SIYAH.jpg" },
  },
  {
    type: T("H prelazni profil", "H geçiş profili", "H transition profile"), size: "13 mm",
    text: T("Nosi i spaja panele sa obje strane.", "Panelleri iki taraftan kavrayarak birleştirir.", "Holds and joins panels from both sides."),
    imgs: { krom: "/13-MM-ALUMINYUM-H-GECIS-PROFILI.jpg", altin: "/13-MM-ALUMINYUM-H-GECIS-PROFILI-ALTIN.jpg", siyah: "/13-MM-ALUMINYUM-H-GECIS-PROFILI_SIYAH.jpg" },
  },
  {
    type: T("Spoljašnji ugaoni profil", "Dış köşe profili", "Outer corner profile"), size: "16 mm",
    text: T("Štiti i oblikuje spoljašnje uglove.", "Dış köşeleri korur ve şekillendirir.", "Protects and shapes outer corners."),
    imgs: { krom: "/16-MM-ALUMINYUM-DIS-KOSE-PROFILI.jpg", altin: "/16-MM-ALUMINYUM-DIS-KOSE-PROFILI-ALTIN.jpg", siyah: "/16-MM-ALUMINYUM-DIS-KOSE-PROFILI_SIYAH.jpg" },
  },
];
