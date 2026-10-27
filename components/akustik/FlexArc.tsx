"use client";

import { useEffect, useState } from "react";
import type { AkColor } from "@/lib/akustik";

/* Esneklik çizimi: keçe şerit ve üstündeki çıtalar, panel boyu sabit kalarak bükülür (SVG — her boyutta net) */
const SLAT: Record<AkColor["id"], { face: string; side: string; edge?: string }> = {
  "light-oak": { face: "#dcb98f", side: "#b8916a" },
  teak: { face: "#be864f", side: "#8f5f36" },
  white: { face: "#f4f1ec", side: "#d9d3c9", edge: "#b9b0a3" },
  black: { face: "#4a4947", side: "#2a2928" },
};

const S = 470;          // panel boyu (yay uzunluğu) — bükülünce değişmez
const N = 11;           // çizilen çıta sayısı
const FELT = 16, SLAT_H = 30, SLAT_W = 31;   // gerçek panel oranı: çıta aralığın ~2 katı

export default function FlexArc({ color, label }: { color: AkColor["id"]; label: string }) {
  const [phi, setPhi] = useState(1.25);   // yayın açısı (radyan)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      setPhi(1.05 + 0.4 * Math.sin((t - t0) / 1400));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const c = SLAT[color];
  const R = S / phi, cx = 260, cy = 40 + SLAT_H + R;
  const pt = (r: number, a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)] as const;
  const h = phi / 2;
  const [ox1, oy1] = pt(R, -h), [ox2, oy2] = pt(R, h), [ix2, iy2] = pt(R - FELT, h), [ix1, iy1] = pt(R - FELT, -h);
  const felt = `M${ox1},${oy1} A${R},${R} 0 0 1 ${ox2},${oy2} L${ix2},${iy2} A${R - FELT},${R - FELT} 0 0 0 ${ix1},${iy1} Z`;
  const step = (S - SLAT_W) / (N - 1) / R;

  return (
    <svg viewBox="0 0 520 225" role="img" aria-label={label} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="feltG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2a29" /><stop offset="1" stopColor="#111" />
        </linearGradient>
      </defs>
      <path d={felt} fill="url(#feltG)" />
      {Array.from({ length: N }, (_, i) => {
        const a = -h + SLAT_W / 2 / R + i * step;
        const [x, y] = pt(R + SLAT_H / 2, a);
        const deg = (a * 180) / Math.PI;
        return (
          <g key={i} transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${deg.toFixed(2)})`}>
            <rect x={-SLAT_W / 2} y={-SLAT_H / 2} width={SLAT_W} height={SLAT_H} rx="1.5" fill={c.side} stroke={c.edge} strokeWidth={c.edge ? 0.8 : 0} />
            <rect x={-SLAT_W / 2} y={-SLAT_H / 2} width={SLAT_W} height={SLAT_H * 0.42} rx="1.5" fill={c.face} />
          </g>
        );
      })}
    </svg>
  );
}
