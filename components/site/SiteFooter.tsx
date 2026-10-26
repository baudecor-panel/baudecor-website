"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { CONTACTS, PHONE, PRODUCT_LINKS, SOCIAL, pick } from "@/lib/site";
import s from "../home/Home.module.css";

/* Sayfa sonu iletişim bölümü — başlık sayfaya göre değişir */
export function ContactSection({ lang, title, text }: { lang: Lang; title?: ReactNode; text?: string }) {
  const L = pick(lang);
  return (
    <section id="contact" className={s.contact}>
      <div className={s.contactInner} data-reveal>
        <p className={s.kicker}>{L("Kontaktirajte Nas", "İletişime Geçin", "Contact Us")}</p>
        <h2 className={s.contactTitle}>
          {title ?? (lang === "me" ? <>Spremni Za Novu <em>Transformaciju</em>?</>
            : lang === "tr" ? <>Yeni Bir <em>Dönüşüme</em> Hazır mısınız?</>
            : <>Ready for a New <em>Transformation</em>?</>)}
        </h2>
        <p className={s.contactText}>{text ?? L("Posjetite naš izložbeni salon u Ulcinju ili nas kontaktirajte. Naš tim je spreman da vam pomogne realizovati vaše ideje.", "Ulcinj'deki showroom'umuzu ziyaret edin veya bizimle iletişime geçin. Ekibimiz size yardımcı olmaya hazır.", "Visit our showroom in Ulcinj or contact us. Our team is ready to help you realize your ideas.")}</p>
        <a href={PHONE.href} className={s.btnPrimary}>{L("Pozovite Nas Odmah", "Hemen Arayın", "Call Us Now")} <span>→</span></a>
        <div className={s.contactGrid}>
          {CONTACTS.map((c) => (
            <div key={c.v}>
              <span>{c.l[lang]}</span>
              {c.href ? <a href={c.href}>{c.v}</a> : <strong>{c.v}</strong>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SiteFooter({ lang }: { lang: Lang }) {
  const L = pick(lang);
  return (
    <footer className={s.footer}>
      <div className={s.footerTop}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Baudecor" className={s.footerLogo} />
        <div className={s.footerCols}>
          <div>
            <span>{L("Proizvodi", "Ürünler", "Products")}</span>
            {PRODUCT_LINKS.map((p) => <Link key={p.href} href={p.href}>{p.name[lang]}</Link>)}
          </div>
          <div>
            <span>{L("Kontakt", "İletişim", "Contact")}</span>
            <a href={PHONE.href}>{PHONE.label}</a>
            <a href="mailto:info@baudecor.me">info@baudecor.me</a>
            <p>Bratica bb, Ulcinj</p>
          </div>
          <div>
            <span>{L("Pratite nas", "Bizi takip edin", "Follow us")}</span>
            {SOCIAL.map((x) => <a key={x.label} href={x.href} target="_blank" rel="noopener noreferrer">{x.label}</a>)}
          </div>
        </div>
      </div>
      <div className={s.footerBottom}>
        <p>© 2026 Baudecor · Crna Gora · {L("Sva prava zadržana", "Tüm hakları saklıdır", "All rights reserved")}</p>
        <p>{L("Premium zidni paneli", "Premium duvar panelleri", "Premium wall panels")}</p>
      </div>
    </footer>
  );
}
