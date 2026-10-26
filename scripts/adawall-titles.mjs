/*
 * Seri adı çevirilerini data/wallpapers.json'a ekler (her seriye name: { tr, me, en }).
 * Girdi: scripts/adawall/titles.txt — koleksiyon başına "# id" başlığı, altında seri sırasıyla "tr|me|en" satırları.
 * Kullanım: node scripts/adawall-sync.mjs && node scripts/adawall-titles.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..");
const DATA = path.join(ROOT, "data", "wallpapers.json");

const groups = new Map();
let cur = null;
for (const raw of (await fs.readFile(path.join(ROOT, "scripts", "adawall", "titles.txt"), "utf8")).split(/\r?\n/)) {
  const line = raw.trim();
  if (!line) continue;
  if (line.startsWith("# ")) { cur = line.slice(2).trim(); groups.set(cur, []); continue; }
  if (line.startsWith("#") || !cur) continue;
  const [tr, me = tr, en = tr] = line.replace(/^=/, "").split("|").map((s) => s.trim());
  groups.get(cur).push({ tr, me, en });
}

const data = JSON.parse(await fs.readFile(DATA, "utf8"));
const errors = [];
for (const c of data.collections) {
  const names = groups.get(c.id) ?? [];
  if (names.length !== c.series.length) errors.push(`${c.id}: ${c.series.length} seri, ${names.length} çeviri`);
  c.series.forEach((x, i) => { if (names[i]) x.name = names[i]; });
}
if (errors.length) { console.error("Sayılar tutmuyor:\n" + errors.join("\n")); process.exit(1); }
await fs.writeFile(DATA, JSON.stringify(data, null, 1));
console.log(`Tamam: ${data.collections.reduce((a, c) => a + c.series.length, 0)} seri adı eklendi.`);
