import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baudecor — Zidni paneli, tapete i SPC parket | Ulcinj, Crna Gora",
  description: "Zidni paneli (PVC, MDF, modularni i akustični), fleksibilni kamen, tapete i SPC parket. Izložbeni salon u Ulcinju, Crna Gora.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
