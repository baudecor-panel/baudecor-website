export type Lang = "tr" | "me" | "en";

export const t = {
  nav: {
    home:       { tr: "Ana Sayfa",   me: "Početna" },
    products:   { tr: "Ürünler",     me: "Proizvodi" },
    about:      { tr: "Hakkımızda",  me: "O nama" },
    contact:    { tr: "İletişim",    me: "Kontakt" },
  },
  hero: {
    title:    { tr: "Mekanınızı Güzelleştirin", me: "Uljepšajte vaš prostor" },
    subtitle: { tr: "Karadağ'ın en kapsamlı iç mekan dekorasyon showroom'u", me: "Najkompletniji showroom unutrašnjeg uređenja u Crnoj Gori" },
    cta:      { tr: "Ürünleri Keşfet", me: "Pogledajte proizvode" },
    contact:  { tr: "İletişime Geç",   me: "Kontaktirajte nas" },
  },
  products: {
    title:      { tr: "Ürünlerimiz",    me: "Naši proizvodi" },
    subtitle:   { tr: "Geniş ürün yelpazemizle her tarza uygun çözümler",  me: "Rješenja za svaki stil iz naše bogate ponude" },
    allGroups:  { tr: "Tümü",           me: "Sve" },
    stock:      { tr: "Stok",           me: "Zaliha" },
    price:      { tr: "Fiyat",          me: "Cijena" },
    noProducts: { tr: "Ürün bulunamadı", me: "Nema proizvoda" },
  },
  about: {
    title:    { tr: "Hakkımızda",    me: "O nama" },
    text:     { tr: "Baudecor olarak Karadağ'da iç mekan dekorasyon, zemin kaplama ve duvar paneli alanında hizmet veriyoruz. Geniş ürün yelpazemiz ve uzman ekibimizle hayalinizdeki mekanı gerçeğe dönüştürüyoruz.", me: "U Baudecor-u pružamo usluge unutrašnjeg uređenja, obloge podova i zidnih panela u Crnoj Gori. Uz širok asortiman proizvoda i stručni tim, pretvaramo vaš idealni prostor u stvarnost." },
  },
  contact: {
    title:   { tr: "İletişim",      me: "Kontakt" },
    address: { tr: "Adres",         me: "Adresa" },
    phone:   { tr: "Telefon",       me: "Telefon" },
    email:   { tr: "E-posta",       me: "E-mail" },
    hours:   { tr: "Çalışma Saatleri", me: "Radno vrijeme" },
    instagram: { tr: "Instagram",   me: "Instagram" },
  },
  footer: {
    rights: { tr: "Tüm hakları saklıdır.", me: "Sva prava zadržana." },
  },
};

export function tx(key: { tr: string; me: string; en: string }, lang: Lang): string {
  return key[lang];
}
