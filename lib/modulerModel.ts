/* Modüler panel 3D model dosyalarını (scripts/moduler-models.mjs çıktısı) yükler */
import * as THREE from "three";

const cache = new Map<string, Promise<THREE.BufferGeometry>>();

/* public/models/moduler/<ad>.bin → BufferGeometry (metre; ön yüz +z, arka yüz z = 0) */
export function loadModulerGeometry(name: string) {
  let p = cache.get(name);
  if (!p) {
    p = fetch(`/models/moduler/${name}.bin`)
      .then((r) => { if (!r.ok) throw new Error(`${name}: ${r.status}`); return r.arrayBuffer(); })
      .then((buf) => {
        const n = new DataView(buf).getUint32(0, true);
        const pos = new Int16Array(buf, 4, n * 3);
        const nor = new Int8Array(buf, 4 + n * 6, n * 3);
        const g = new THREE.BufferGeometry();
        const P = new Float32Array(n * 3), N = new Float32Array(n * 3);
        for (let i = 0; i < n * 3; i++) { P[i] = pos[i] * 0.00005; N[i] = nor[i] / 127; }
        g.setAttribute("position", new THREE.BufferAttribute(P, 3));
        g.setAttribute("normal", new THREE.BufferAttribute(N, 3));
        g.computeBoundingBox();
        return g;
      });
    cache.set(name, p);
  }
  return p;
}
