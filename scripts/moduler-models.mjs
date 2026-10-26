/*
 * Modüler panel 3D dosyalarını (OBJ / 3DS / FBX) sitede kullanılacak küçük ikili dosyalara çevirir.
 * Girdi:  üretici zip'lerinden çıkarılmış klasör (node scripts/moduler-models.mjs <klasör>)
 * Çıktı:  public/models/moduler/<ad>.bin  — [uint32 köşe sayısı][int16 x,y,z (0,05 mm)][int8 nx,ny,nz]
 *         ve konsola her modelin ölçüleri (lib/moduler.ts'e yazılır)
 * Dönüşüm: birim → metre, ön yüz +z (kameraya bakar), arka yüz z = 0, x/y ortalanır.
 */
import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { TDSLoader } from "three/addons/loaders/TDSLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const SRC = process.argv[2];
const OUT = path.resolve("public/models/moduler");
fs.mkdirSync(OUT, { recursive: true });

// unit: dosya biriminden metreye çarpan; up: derinlik ekseni
const MODELS = {
  penta: { file: "PENTA/PENTA-3d-model/3.obj", unit: 0.01, up: "y" },
  zeta: { file: "ZETA/5.obj", unit: 0.001, up: "y" },
  norm: { file: "NORM/2.obj", unit: 0.01, up: "y" },
  mabel: { file: "MABEL/1.obj", unit: 0.01, up: "y" },
  nava: { file: "NAVA/4.obj", unit: 0.01, up: "y" },
  soho: { file: "SOHO/obj format.obj", unit: 0.01, up: "y" },
  spline: { file: "SPLINE/dosya36.3DS", unit: 0.001, up: "y" },
  vava: { file: "VAVA/dosya61.fbx", unit: 0.01, up: "z" },
};

const buf = (p) => { const b = fs.readFileSync(p); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };

for (const [name, m] of Object.entries(MODELS)) {
  const p = path.join(SRC, m.file);
  const obj = m.file.endsWith(".obj") ? new OBJLoader().parse(fs.readFileSync(p, "utf8"))
    : /\.3ds$/i.test(m.file) ? new TDSLoader().parse(buf(p), "")
    : new FBXLoader().parse(buf(p), "");
  obj.updateMatrixWorld(true);

  // tüm parçaları dünya koordinatında tek geometride birleştir
  const geos = [];
  obj.traverse((o) => {
    if (!o.isMesh) return;
    let g = o.geometry.clone().applyMatrix4(o.matrixWorld);
    g = g.index ? g.toNonIndexed() : g;
    for (const k of Object.keys(g.attributes)) if (k !== "position" && k !== "normal") g.deleteAttribute(k);
    if (!g.attributes.normal) g.computeVertexNormals();
    g.clearGroups();
    geos.push(g);
  });
  const g = mergeGeometries(geos, false);
  g.scale(m.unit, m.unit, m.unit);
  if (m.up === "y") g.rotateX(Math.PI / 2); // derinlik (y) → +z
  g.computeBoundingBox();
  const bb = g.boundingBox;
  g.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -bb.min.z);
  g.computeBoundingBox();
  const size = g.boundingBox.getSize(new THREE.Vector3());

  // ikili yaz
  const pos = g.attributes.position, nor = g.attributes.normal, n = pos.count;
  const out = Buffer.alloc(4 + n * 6 + n * 3 + ((n * 3) % 2));
  out.writeUInt32LE(n, 0);
  let o = 4;
  for (let i = 0; i < n; i++) for (const v of [pos.getX(i), pos.getY(i), pos.getZ(i)]) { out.writeInt16LE(Math.round(v / 0.00005), o); o += 2; }
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3(nor.getX(i), nor.getY(i), nor.getZ(i)).normalize();
    for (const c of [v.x, v.y, v.z]) { out.writeInt8(Math.round(c * 127), o); o += 1; }
  }
  fs.writeFileSync(path.join(OUT, `${name}.bin`), out);
  console.log(`${name}: ${n / 3} üçgen, ${(out.length / 1024).toFixed(0)} KB, ölçü ${size.toArray().map((v) => (v * 100).toFixed(1)).join(" × ")} cm`);
}
