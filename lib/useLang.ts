"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Lang } from "./i18n";

/* Site her yeni ziyarette Karadağca açılır; seçilen dil yalnızca o ziyaret boyunca (sekme açıkken)
   sayfalar arasında hatırlanır — sessionStorage. Eskiden localStorage'da kalıcıydı. */
const KEY = "baudecor-lang";
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    const v = sessionStorage.getItem(KEY);
    if (v === "me" || v === "tr" || v === "en") return v;
  } catch {}
  return "me";
}

export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      try { localStorage.removeItem(KEY); } catch {}   // eski kalıcı seçimi temizle
      return () => listeners.delete(cb);
    },
    read,
    () => "me" as Lang,
  );
  const setLang = useCallback((l: Lang) => {
    try { sessionStorage.setItem(KEY, l); } catch {}
    listeners.forEach((cb) => cb());
  }, []);
  return [lang, setLang];
}
