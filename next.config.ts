import type { NextConfig } from "next";

/* Eski WordPress sitesinin (baudecor.me) adresleri — Google'daki kayıtlar ve paylaşılan linkler
   yeni sayfalara kalıcı (308) yönlenir. */
const OLD_PRODUCTS: [string, string][] = [
  ["pvc-.*", "/urunler/pvc-paneli"],
  ["medijapan-.*|mediapan-.*", "/urunler/mdf-paneli"],
  ["modularni-.*", "/urunler/moduler-duvar-paneli"],
  ["akusticni-.*", "/urunler/akustik-duvar-paneli"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...OLD_PRODUCTS.flatMap(([re, destination]) => [
        { source: `/proizvod/:slug(${re})`, destination, permanent: true },
        { source: `/kategorija-proizvoda/:slug(${re})`, destination, permanent: true },
      ]),
      { source: "/proizvod/:slug*", destination: "/#products", permanent: true },
      { source: "/kategorija-proizvoda/:slug*", destination: "/#products", permanent: true },
      { source: "/shop", destination: "/#products", permanent: true },
      { source: "/katalozi", destination: "/katalog", permanent: true },
      { source: "/kontakt", destination: "/#contact", permanent: true },
      { source: "/o-nama", destination: "/#about", permanent: true },
      { source: "/zasto-su-akusticni-zidni-paneli-idealno-rjesenje-za-apartmane-u-crnoj-gori", destination: "/urunler/akustik-duvar-paneli", permanent: true },
      { source: "/kupovina-na-rate", destination: "/", permanent: true },
      { source: "/blog/:slug*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
