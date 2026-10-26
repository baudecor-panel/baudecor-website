"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { LANGS, PHONE } from "@/lib/site";
import s from "./Site.module.css";

export type Crumb = { href?: string; label: string };

export default function PageHeader({ lang, setLang, crumbs }: { lang: Lang; setLang: (l: Lang) => void; crumbs: Crumb[] }) {
  return (
    <header className={s.top}>
      <Link href="/" aria-label="Baudecor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Baudecor" className={s.logo} />
      </Link>
      <nav className={s.crumbs}>
        {crumbs.map((c, i) => (
          <span key={i} className={s.crumb}>
            {i > 0 && <span>/</span>}
            {c.href ? <Link href={c.href}>{c.label}</Link> : <b>{c.label}</b>}
          </span>
        ))}
      </nav>
      <div className={s.topRight}>
        <div className={s.langs}>
          {LANGS.map((l) => <button key={l.code} className={lang === l.code ? s.on : ""} onClick={() => setLang(l.code)}>{l.label}</button>)}
        </div>
        <a href={PHONE.href} className={s.tel}>{PHONE.label}</a>
      </div>
    </header>
  );
}
