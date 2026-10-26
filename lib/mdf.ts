/* MDF (medijapan) duvar paneli kataloğu — modeller, renkler, ölçüler (ürün kartlarından) */
import type { Txt } from "./site";

const T = (me: string, tr: string, en: string): Txt => ({ me, tr, en });

/* Renk türü: "grain" — kart fotoğrafındaki gerçek ahşap dokusu; "solid" — düz renk; "patina" — eskitme */
export type MdfFinish = {
  id: string; name: string; card: string;
  kind: "grain" | "solid" | "patina";
  color: string;            // ortalama renk (düz/patine yüzey ve yedek)
  dark?: string;            // patine damar rengi
  groove?: string;          // kanal dibi farklı renkse (ör. Teak Black)
};
export type MdfModel = {
  id: "18121" | "18118Y" | "18118B";
  name: Txt; text: Txt;
  width: number;            // mm
  packKg: string;
  finishes: MdfFinish[];
};

const grain = (id: string, name: string, card: string, color: string, groove?: string): MdfFinish => ({ id, name, card, kind: "grain", color, groove });
const solid = (id: string, name: string, card: string, color: string): MdfFinish => ({ id, name, card, kind: "solid", color });
const patina = (id: string, name: string, card: string, color: string, dark: string): MdfFinish => ({ id, name, card, kind: "patina", color, dark });

export const MDF_MODELS: MdfModel[] = [
  {
    id: "18121",
    name: T("Kanalni", "Kanallı", "Fluted"),
    text: T("Tri široka rebra i duboki kanali — klasični izgled lamela.", "Üç geniş kaburga ve derin kanallar — klasik lamel görünümü.", "Three wide ribs and deep channels — the classic slat look."),
    width: 121, packKg: "20,77",
    finishes: [
      grain("teak", "Teak", "/mdf-teak.jpg", "#bb8a63"),
      grain("walnut-322", "LMD 322 Antik Walnut", "/mdf-lmd-322-antik-walnut.jpg", "#ba8861"),
      grain("walnut-249", "LMD 249 Antik Walnut", "/mdf-lmd-249-antik-walnut.jpg", "#7a5c4e"),
      grain("asos", "Asos", "/mdf-asos.jpg", "#d5b596"),
      grain("light-oak-black", "Light Oak Black", "/mdf-light-oak-black.jpg", "#d8c1ac", "#141414"),
      grain("teak-black", "Teak Black", "/mdf-teak-black.jpg", "#a0795b", "#141414"),
      solid("st-white", "Soft Touch White", "/mdf-soft-touch-white.jpg", "#e4e7ea"),
      solid("st-anth", "Soft Touch Antrasit", "/mdf-soft-touch-antrasit.jpg", "#56585b"),
      solid("st-black", "Soft Touch Siyah", "/mdf-soft-touch-siyah.jpg", "#1c1b20"),
    ],
  },
  {
    id: "18118Y",
    name: T("Talasasti", "Dalgalı", "Wave"),
    text: T("Tri meka udubljenja — mekana igra svjetla i sjenke.", "Üç yumuşak oyuk — ışık ve gölgenin yumuşak oyunu.", "Three soft hollows — a gentle play of light and shadow."),
    width: 118, packKg: "19,77",
    finishes: [
      solid("water-green", "Water Green", "/21.jpg", "#8f9c93"),
      solid("iceland-blue", "İzlanda Blue", "/22.jpg", "#243950"),
      solid("y-anth", "Soft Touch Antrasit", "/23.jpg", "#3f4852"),
      solid("kiremit", "Kiremit", "/24.jpg", "#b94f46"),
    ],
  },
  {
    id: "18118B",
    name: T("Polukružni", "Yarım yuvarlak", "Half-round"),
    text: T("Pet zaobljenih rebara — mekan, klasičan ritam.", "Beş yuvarlak kaburga — yumuşak, klasik bir ritim.", "Five rounded ribs — a soft, classic rhythm."),
    width: 118, packKg: "18,77",
    finishes: [
      patina("patine-krem", "Patine Krem", "/31.jpg", "#e6e2da", "#c4b9a6"),
      patina("patine-pink", "Patine Pink", "/32.jpg", "#deaba8", "#bf8b82"),
      patina("b-iceland", "İzlanda Blue", "/33.jpg", "#344050", "#22324a"),
    ],
  },
];

export const MDF_SIZE = { thickness: 18, length: 2800, perPack: 6 };

/* Kart görselinde (700 × 800) panel yüzü fotoğrafının yeri ve ahşap şeridi */
export const CARD = { w: 700, h: 800, face: { x: 425, y: 165, w: 255, h: 470 }, strip: { x: 440, y: 180, w: 52, h: 440 } };

/* Bir alanda kartın yüz fotoğrafını göstermek için CSS arka planı.
   Yüzdeyle verilir; aynı en/boy oranındaki her boyutta (ör. mobil) doğru kırpar. aspect = yükseklik / genişlik */
export function faceStyle(f: MdfFinish, aspect: number) {
  const { w, h, face } = CARD;
  const ih = h / face.w;                                  // görsel yüksekliği / alan genişliği
  return {
    backgroundImage: `url("${f.card}")`,
    backgroundSize: `${(w / face.w) * 100}% auto`,
    backgroundPosition: `${(face.x / (w - face.w)) * 100}% ${((face.y / face.w) / (ih - aspect)) * 100}%`,
  };
}

/* 3D görünümün açılış rengi: kanalların net okunduğu düz renk */
export const MDF_DEFAULT_FINISH = "st-anth";
export const mdfDefault = () => {
  const model = MDF_MODELS[0];
  return { model, finish: model.finishes.find((f) => f.id === MDF_DEFAULT_FINISH) ?? model.finishes[0] };
};
