"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import a from "./HeroAccordion.module.css";

/* Açılıştaki ürün akordeonu: altı ürün grubu, biri sırayla genişler; fareyle gelinen açılır */
export type HeroPanel = { num: string; href: string; name: string; tag: string; img: string };

const STEP = 5200; // her panelin açık kaldığı süre (ms) — ilerleme çubuğuyla aynı

export default function HeroAccordion({ items, cta }: { items: HeroPanel[]; cta: string }) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % items.length), STEP);
    return () => clearTimeout(t);
  }, [active, hover, items.length]);

  return (
    <div className={a.wrap} onMouseLeave={() => setHover(false)}>
      {items.map((p, i) => (
        <Link
          key={p.href}
          href={p.href}
          className={a.panel}
          data-on={i === active || undefined}
          onMouseEnter={() => { setHover(true); setActive(i); }}
          onFocus={() => { setHover(true); setActive(i); }}
          style={{ animationDelay: `${0.25 + i * 0.09}s` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.img} alt={p.name} />
          <span className={a.shade} />
          <span className={a.num}>{p.num}</span>
          <span className={a.vert}>{p.name}</span>
          <span className={a.body}>
            <small>{p.num} / {String(items.length).padStart(2, "0")}</small>
            <b>{p.name}</b>
            <i>{p.tag}</i>
            <em>{cta} <span>→</span></em>
          </span>
          {i === active && <span key={active} className={a.bar} data-paused={hover || undefined} style={{ animationDuration: `${STEP}ms` }} />}
        </Link>
      ))}
    </div>
  );
}
