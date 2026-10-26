"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Lang } from "./i18n";

/* Seçilen dil sayfalar arasında hatırlanır (yalnızca bu tarayıcıda) */
const KEY = "baudecor-lang";
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "me" || v === "tr" || v === "en") return v;
  } catch {}
  return "me";
}

export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    () => "me" as Lang,
  );
  const setLang = useCallback((l: Lang) => {
    try { localStorage.setItem(KEY, l); } catch {}
    listeners.forEach((cb) => cb());
  }, []);
  return [lang, setLang];
}
