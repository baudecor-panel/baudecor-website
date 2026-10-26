/* Panel sahneleri için ortak 3D yardımcıları (yalnızca tarayıcıda çağrılır) */
import * as THREE from "three";

export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Kodla üretilen ahşap dokusu — damarlar boy yönünde */
export function woodTexture(base: string, dark: string, light: string, seed = 1234) {
  const W = 256, H = 2048;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const rnd = seeded(seed);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) {
    const g = ctx.createLinearGradient(rnd() * W, 0, rnd() * W, H);
    g.addColorStop(0, "transparent");
    g.addColorStop(0.5, rnd() > 0.5 ? light : dark);
    g.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = g;
    ctx.fillRect(rnd() * W - 60, 0, 60 + rnd() * 120, H);
  }
  for (let i = 0; i < 140; i++) {
    const x0 = rnd() * W, amp = 2 + rnd() * 10, freq = 0.002 + rnd() * 0.004, phase = rnd() * Math.PI * 2;
    ctx.globalAlpha = 0.08 + rnd() * 0.25;
    ctx.strokeStyle = rnd() > 0.35 ? dark : light;
    ctx.lineWidth = 0.5 + rnd() * 1.8;
    ctx.beginPath();
    for (let y = 0; y <= H; y += 16) {
      const x = x0 + Math.sin(y * freq + phase) * amp + Math.sin(y * freq * 3.1) * amp * 0.25;
      if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = rnd() > 0.5 ? dark : light;
    ctx.fillRect(rnd() * W, rnd() * H, 1, 2 + rnd() * 5);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* Akustik keçe dokusu */
export function feltTexture() {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#2c2a27";
  ctx.fillRect(0, 0, S, S);
  const rnd = seeded(7);
  for (let i = 0; i < 9000; i++) {
    const v = 34 + Math.floor(rnd() * 26);
    ctx.fillStyle = `rgb(${v},${v - 1},${v - 2})`;
    ctx.fillRect(rnd() * S, rnd() * S, 1 + rnd() * 2, 1 + rnd() * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 6);
  return t;
}

/* MDF 18121 profili (mm): 18 kalınlık, 6 mm bindirme, üç kanal */
export const MDF_T = 18, MDF_LIP = 6, MDF_LIP_H = 6;
export function grooveFace(P: number): [number, number][] {
  const g = 10, depth = 9, rib = (P - 3 * g) / 3;
  const pts: [number, number][] = [[0, MDF_T]];
  let x = 0;
  for (let i = 0; i < 3; i++) {
    x += rib;
    pts.push([x, MDF_T], [x, MDF_T - depth]);
    x += g;
    pts.push([x, MDF_T - depth]);
    if (i < 2) pts.push([x, MDF_T]);
  }
  return pts;
}

/* Profil şeklinden panel geometrisi — boy yönü dikey, yüz +z'ye bakar */
export function mdfBoardGeometry(widthMm: number, face: [number, number][], length: number) {
  const W = widthMm, P = W - MDF_LIP;
  const pts: [number, number][] = [[0, 0], [P, 0], [P, MDF_LIP_H], [W, MDF_LIP_H]];
  for (let i = face.length - 1; i >= 0; i--) pts.push([face[i][0] + MDF_LIP, face[i][1]]);
  pts.push([MDF_LIP, MDF_LIP_H], [0, MDF_LIP_H]);
  const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2((x - W / 2) / 1000, (y - MDF_T / 2) / 1000)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false, steps: 1 });
  geo.translate(0, 0, -length / 2);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/* PVC desen fotoğrafı — sağdaki desen adı etiketi üstündeki şeritle kapatılır */
export function loadPatternTexture(url: string, anisotropy = 4) {
  return new Promise<THREE.CanvasTexture>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const px = Math.floor(w * 0.56), pw = w - px;
      const py = Math.floor(h * 0.652), ph = Math.ceil(h * 0.088);
      const patch = document.createElement("canvas");
      patch.width = pw; patch.height = ph;
      const pctx = patch.getContext("2d")!;
      pctx.drawImage(img, px, py - ph, pw, ph, 0, 0, pw, ph);
      const fy = ph * 0.16, fx = pw * 0.09;
      pctx.globalCompositeOperation = "destination-in";
      const gv = pctx.createLinearGradient(0, 0, 0, ph);
      gv.addColorStop(0, "rgba(0,0,0,0)");
      gv.addColorStop(fy / ph, "rgba(0,0,0,1)");
      gv.addColorStop(1 - fy / ph, "rgba(0,0,0,1)");
      gv.addColorStop(1, "rgba(0,0,0,0)");
      pctx.fillStyle = gv;
      pctx.fillRect(0, 0, pw, ph);
      const gh = pctx.createLinearGradient(0, 0, pw, 0);
      gh.addColorStop(0, "rgba(0,0,0,0)");
      gh.addColorStop(fx / pw, "rgba(0,0,0,1)");
      gh.addColorStop(1, "rgba(0,0,0,1)");
      pctx.fillStyle = gh;
      pctx.fillRect(0, 0, pw, ph);
      ctx.drawImage(patch, px, py);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = anisotropy;
      resolve(t);
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* Yumuşak temas gölgesi dokusu */
export function contactShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(40,25,10,0.5)");
  g.addColorStop(0.5, "rgba(40,25,10,0.18)");
  g.addColorStop(1, "rgba(40,25,10,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
