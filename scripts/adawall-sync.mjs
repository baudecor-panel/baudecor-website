/*
 * AdaWall katalog senkronizasyonu
 * Girdi:  scripts/adawall/catalog.json + series.json (katalog ve seri sayfalarından çıkarılan ham veri)
 * Çıktı:  public/duvar-kagidi/{desen,oda}/*.webp ve data/wallpapers.json
 * Kullanım: node scripts/adawall-sync.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..");
const SRC = path.join(ROOT, "scripts", "adawall");
const OUT_IMG = path.join(ROOT, "public", "duvar-kagidi");
const OUT_DATA = path.join(ROOT, "data", "wallpapers.json");
const BASE = "https://www.adawall.com.tr/resimler";
const SWATCH_PX = 800, THUMB_PX = 360, ROOM_PX = 1400, CONCURRENCY = 4;

const slug = (s) =>
  s.toLowerCase()
    .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[c])
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* katalog adındaki "OCTAGON KOLEKSİYONU" gibi ekleri sadeleştir */
const collectionName = (c) => c.replace(/\s*KOLEKS[İI]YONU\s*/i, "").trim();

async function download(url, file, width, thumb) {
  try { await fs.access(file); return true; } catch {}
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Baudecor dealer catalog sync)" } });
      if (!res.ok) throw new Error(res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(file);
      if (thumb) await sharp(buf).resize({ width: THUMB_PX }).webp({ quality: 74 }).toFile(thumb);
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  return false;
}

async function pool(tasks, n) {
  let i = 0, done = 0, failed = [];
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < tasks.length) {
      const t = tasks[i++];
      if (!(await t.run())) failed.push(t.name);
      if (++done % 50 === 0) console.log(`  ${done}/${tasks.length}`);
    }
  }));
  return failed;
}

const catalog = JSON.parse(await fs.readFile(path.join(SRC, "catalog.json"), "utf8"));
const series = JSON.parse(await fs.readFile(path.join(SRC, "series.json"), "utf8"));
await fs.mkdir(path.join(OUT_IMG, "desen"), { recursive: true });
await fs.mkdir(path.join(OUT_IMG, "oda"), { recursive: true });
await fs.mkdir(path.join(OUT_IMG, "kucuk"), { recursive: true });
await fs.mkdir(path.dirname(OUT_DATA), { recursive: true });

/* seri → renkler */
const bySeries = new Map();
for (const v of catalog.variants) {
  if (!bySeries.has(v.series_url)) bySeries.set(v.series_url, []);
  bySeries.get(v.series_url).push(v);
}

const tasks = [];
const collections = new Map();
for (const [url, variants] of bySeries) {
  const info = series[url];
  const first = variants[0];
  const colName = collectionName(first.collection);
  const colId = slug(colName);
  const [seriesCode, ...rest] = (info?.title || first.series_title).split("|").map((s) => s.trim());
  const id = slug(`${colId}-${seriesCode}`);

  let room = null;
  if (info?.main) {
    const [dir, file] = info.main;
    room = `/duvar-kagidi/oda/${id}.webp`;
    tasks.push({ name: `oda ${id}`, run: () => download(`${BASE}/${ROOM_PX}/${dir}/${file}`, path.join(ROOT, "public", room), ROOM_PX) });
  }

  const colors = variants.map((v) => {
    const m = v.img.match(/\/resimler\/[^/]+\/([^/]+)\/(.+)$/);
    const [code, name] = v.code.split(/\s+—\s+/);
    const img = `/duvar-kagidi/desen/${slug(code)}.webp`;
    const thumb = `/duvar-kagidi/kucuk/${slug(code)}.webp`;
    tasks.push({ name: `desen ${code}`, run: () => download(`${BASE}/1600/${m[1]}/${m[2]}`, path.join(ROOT, "public", img), SWATCH_PX, path.join(ROOT, "public", thumb)) });
    return { code: code.trim(), name: name?.trim() || null, img, thumb, colors: v.colors };
  }).sort((a, b) => a.code.localeCompare(b.code, "tr", { numeric: true })); // 7816-2, 7816-10 sırası

  const merge = (key) => [...new Set(variants.flatMap((v) => v[key]))];
  const entry = {
    id,
    code: seriesCode,
    title: rest.join(" | ") || seriesCode,
    collection: colId,
    room,
    rooms: merge("rooms"),
    styles: merge("styles"),
    repeat: first.repeat,
    isNew: variants.some((v) => v.new),
    colors,
  };
  if (!collections.has(colId)) collections.set(colId, { id: colId, name: colName, series: [] });
  collections.get(colId).series.push(entry);
}

console.log(`${tasks.length} görsel indirilecek…`);
const failed = await pool(tasks, CONCURRENCY);

const data = {
  source: "https://www.adawall.com.tr",
  syncedAt: new Date().toISOString(),
  collections: [...collections.values()].sort((a, b) => b.series.length - a.series.length),
};
await fs.writeFile(OUT_DATA, JSON.stringify(data, null, 1));
console.log(`Bitti. ${data.collections.length} koleksiyon, ${[...collections.values()].reduce((a, c) => a + c.series.length, 0)} seri.`);
if (failed.length) console.log(`İndirilemeyen ${failed.length}:`, failed.slice(0, 20));
