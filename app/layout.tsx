import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baudecor — Premium Zidni Paneli | Crna Gora",
  description: "Inovativna rješenja u uređenju enterijera. PVC, MDF i modularni zidni paneli. Najveći izložbeni salon u Crnoj Gori.",
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
