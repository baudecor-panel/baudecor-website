"use client";

import type { CSSProperties } from "react";
import type { AkColor } from "@/lib/akustik";
import k from "./Akustik.module.css";

/* Lamel panel çizimi: siyah keçe üzerinde çıtalar. Doku SVG gürültüsünden — fotoğraf kullanılmaz.
   Renk değişince çıtalar soldan sağa dalga halinde yeni renge geçer. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='900'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.55 0.006' numOctaves='4' seed='7'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>"
)}")`;
const FELT = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' seed='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#f)' opacity='0.35'/></svg>"
)}")`;

/* çıta yüzeyi: yuvarlatılmış kenar gölgesi + türüne göre damar/parlaklık */
function slatStyle(c: AkColor, i: number, wave: boolean): CSSProperties {
  const shade = "linear-gradient(90deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 18%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)";
  const layers =
    c.kind === "wood" ? { backgroundImage: `${shade}, ${GRAIN}`, backgroundBlendMode: "normal, soft-light" }
    : c.kind === "metal" ? { backgroundImage: `${shade}, linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 35%, rgba(0,0,0,0.12) 70%, rgba(255,255,255,0.2))`, backgroundBlendMode: "normal, overlay" }
    : { backgroundImage: shade, backgroundBlendMode: "normal" };
  return {
    backgroundColor: c.base,
    backgroundSize: "100% 100%, 160px 900px",
    backgroundPosition: `0 0, ${(i * 37) % 160}px ${(i * 211) % 900}px`,
    transitionDelay: wave ? `${i * 18}ms` : "0ms",
    ...layers,
  };
}

export default function SlatWall({ color, slats, className, wave = true }: { color: AkColor; slats: number; className?: string; wave?: boolean }) {
  return (
    <div className={`${k.wall} ${className ?? ""}`} style={{ backgroundImage: FELT }}>
      {Array.from({ length: slats }, (_, i) => (
        <span key={i} className={k.slat} style={slatStyle(color, i, wave)} />
      ))}
    </div>
  );
}
