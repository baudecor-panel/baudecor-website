"use client";

import { useEffect, type DependencyList } from "react";

/* [data-flip] işaretli kartlar ekrana girince sırayla dönerek yerine oturur.
   Aynı anda görünür olanlar arka arkaya gelir; görselleri yüklenene kadar (en fazla 1,2 sn) beklenir.
   Animasyonun kendisi sayfanın CSS'inde: [data-flip] gizli, [data-flip][data-in] animasyonlu. */
export function useFlipIn(deps: DependencyList = [], step = 0.12) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const els = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      if (!els.length) return;
      els.forEach((el) => io.unobserve(el));
      const imgs = els.flatMap((el) => [...el.querySelectorAll("img")].map((img) => img.decode().catch(() => {})));
      Promise.race([Promise.all(imgs), new Promise((r) => setTimeout(r, 1200))]).then(() =>
        els.forEach((el, i) => {
          el.style.animationDelay = `${i * (window.innerWidth < 900 ? step * 0.6 : step)}s`;   // telefonda daha kısa sıra
          el.setAttribute("data-in", "");
        })
      );
    }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });
    document.querySelectorAll<HTMLElement>("[data-flip]:not([data-in])").forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
