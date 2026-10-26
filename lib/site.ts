/* Sayfalar arasında ortak site bilgileri */
import type { Lang } from "./i18n";

export type Txt = { tr: string; me: string; en: string };

export const LANGS: { code: Lang; label: string }[] = [
  { code: "me", label: "ME" },
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
];

export const PHONE = { label: "+382 68 361 700", href: "tel:+38268361700", wa: "https://wa.me/38268361700" };

export const PRODUCT_LINKS: { href: string; name: Txt }[] = [
  { href: "/urunler/pvc-paneli", name: { tr: "PVC Paneller", me: "PVC Paneli", en: "PVC Panels" } },
  { href: "/urunler/mdf-paneli", name: { tr: "MDF Paneller", me: "MDF Paneli", en: "MDF Panels" } },
  { href: "/urunler/moduler-duvar-paneli", name: { tr: "Modüler Duvar Paneli", me: "Modularni Zidni Panel", en: "Modular Wall Panel" } },
  { href: "/urunler/akustik-duvar-paneli", name: { tr: "Akustik Duvar Paneli", me: "Akustični Zidni Panel", en: "Acoustic Wall Panel" } },
  { href: "/urunler/esnek-tas-panel", name: { tr: "Esnek Taş Panel", me: "Fleksibilni Kamen", en: "Flexible Stone" } },
  { href: "/duvar-kagidi", name: { tr: "Duvar Kağıdı", me: "Tapete", en: "Wallpaper" } },
];

export const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/baudecor.me/" },
  { label: "Facebook", href: "https://www.facebook.com/baudecor.me/" },
  { label: "YouTube", href: "https://www.youtube.com/@baudecormontenegro" },
];

export const CONTACTS: { l: Txt; v: string; href?: string }[] = [
  { l: { tr: "Telefon", me: "Telefon", en: "Phone" }, v: PHONE.label, href: PHONE.href },
  { l: { tr: "E-posta", me: "Email", en: "Email" }, v: "info@baudecor.me", href: "mailto:info@baudecor.me" },
  { l: { tr: "Adres", me: "Adresa", en: "Address" }, v: "Bratica bb, Ulcinj" },
  { l: { tr: "Çalışma Saatleri", me: "Radno Vrijeme", en: "Working Hours" }, v: "08:30 — 17:30" },
];

/* Dile göre metin seçici: L("me", "tr", "en") */
export const pick = (lang: Lang) => (me: string, tr: string, en: string) => (lang === "me" ? me : lang === "tr" ? tr : en);
