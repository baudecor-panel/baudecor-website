"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { Lang } from "@/lib/i18n";
import { pick } from "@/lib/site";
import {
  METAL_NAMES, METAL_SWATCH, PVC_PATTERNS as PATTERNS, PVC_PROFILES,
  type MetalId, type ProfileKind, type PvcPattern as Pattern,
} from "@/lib/pvc";
import styles from "../PanelShowcase.module.css";
import pvc from "./PvcStory.module.css";

/* ===== Levha ölçüleri (m) — 122 × 280 cm, 2,8 mm ===== */
const SW = 1.22;
const SH = 2.8;
const ST = 0.0028;
const GHOST_T = 0.02;   // karşılaştırma: doğal mermer plaka
const GHOST_Z = -0.16;  // levhanın arkasındaki konumu

/* ===== Profil detayı: ölçüler mm, sahnede DS katı büyüklükte ===== */
const DS = 0.006;                // 1 mm → 6 mm (yakın çekim)
const DT = 2.8;                  // panel kalınlığı (mm)
const DW = 45;                   // örnek panel genişliği (mm)
const DH = 90;                   // örnek yüksekliği (mm)
const DETAIL = new THREE.Vector3(4.5, 1.1, 2.4); // detay sahnesinin yeri
const TOP = DETAIL.y + DH * DS;  // örneğin kesik üst ucu

/* ===== Alüminyum profil renkleri ===== */
type Metal = { id: MetalId; color: string; roughness: number; metalness: number };
const METALS: Metal[] = [
  { id: "krom", color: METAL_SWATCH.krom, roughness: 0.18, metalness: 1 },
  { id: "altin", color: METAL_SWATCH.altin, roughness: 0.22, metalness: 1 },
  { id: "siyah", color: METAL_SWATCH.siyah, roughness: 0.45, metalness: 0.6 },
];

/* ===== Kaydırma senaryosu: kamera, levha ve sahne öğeleri ===== */
type Pose = {
  cx: number; cy: number; cz: number;   // kamera
  tx: number; ty: number; tz: number;   // kameranın baktığı nokta
  fx: number;                           // mobilde ortalanacak nesne
  hry: number;                          // ana levha dönüşü
  ghost: number; water: number; detail: number;
};
const P = (o: Pose) => o;
const POSES: Pose[] = [
  P({ cx: -1.15, cy: 1.5, cz: 7.6, tx: -1.15, ty: 1.45, tz: 2.4, fx: 0, hry: -0.35, ghost: 0, water: 0, detail: 0 }),   // giriş
  P({ cx: 0.9, cy: 1.9, cz: 4.6, tx: 0.75, ty: 1.7, tz: 2.4, fx: 0, hry: 0.55, ghost: 0, water: 0, detail: 0 }),        // doku
  P({ cx: 1.3, cy: 1.92, cz: 2.56, tx: 0.61, ty: 1.82, tz: 2.5, fx: 0.61, hry: 0, ghost: 1, water: 0, detail: 0 }),     // incelik — kenardan bakış
  P({ cx: 0.75, cy: 1.65, cz: 4.0, tx: 0.65, ty: 1.55, tz: 2.4, fx: 0, hry: 0.4, ghost: 0, water: 1, detail: 0 }),      // su
  // profiller — kesik üst uca yukarıdan yakın çekim, kesit okunur
  P({ cx: DETAIL.x - 0.16, cy: TOP + 0.46, cz: DETAIL.z + 0.36, tx: DETAIL.x - 0.12, ty: TOP - 0.03, tz: DETAIL.z, fx: DETAIL.x, hry: 0.4, ghost: 0, water: 0, detail: 1 }), // profiller
];

/* ===== Yardımcılar ===== */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* Fotoğrafı olduğu gibi kullanır; yalnızca sağdaki desen adı etiketini
   hemen üstündeki mermer şeridiyle, kenarları yumuşatarak kapatır */
function loadPatternCanvas(url: string) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // etiket tüm fotoğraflarda ~%61–100 genişlik, ~%67–72 yükseklik aralığında
      const px = Math.floor(w * 0.56), pw = w - px;
      const py = Math.floor(h * 0.652), ph = Math.ceil(h * 0.088);
      const patch = document.createElement("canvas");
      patch.width = pw; patch.height = ph;
      const pctx = patch.getContext("2d")!;
      pctx.drawImage(img, px, py - ph, pw, ph, 0, 0, pw, ph);
      // kenar yumuşatma: üst/alt ve sol kenar saydamlaşır, etiket alanı tamamen örtülür
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
      resolve(c);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function solidCanvas(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 4;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 4, 4);
  return c;
}

/* ===== Profil kesitleri (mm). x: duvar boyunca, f: duvardan öne doğru ===== */
const t = DT;
const SECTIONS: Record<ProfileKind, [number, number][]> = {
  // bitiş: panelin açık kenarını saran U kanal (sağda kapalı)
  end: [[-8.8, 0], [1.2, 0], [1.2, 1.6 + t], [-8.8, 1.6 + t], [-8.8, 0.8 + t], [0, 0.8 + t], [0, 0.8], [-8.8, 0.8]],
  // T geçiş: önde 10 mm başlık, iki panelin arasına giren gövde
  t: [[-5, t + 0.3], [-4.6, t + 1.2], [4.6, t + 1.2], [5, t + 0.3], [5, t], [0.6, t], [0.6, 0], [-0.6, 0], [-0.6, t], [-5, t]],
  // iç köşe: iki panel yüzeyini birleştiren eğimli köşe
  inner: [[-12, t], [-12, t + 0.8], [-t - 0.8, t + 12], [-t, t + 12], [-t, t]],
  // H geçiş: iki paneli önden ve arkadan kavrayan kanal
  h: [[-6.5, 0], [6.5, 0], [6.5, 0.8], [0.6, 0.8], [0.6, 0.8 + t], [6.5, 0.8 + t], [6.5, 1.6 + t], [-6.5, 1.6 + t], [-6.5, 0.8 + t], [-0.6, 0.8 + t], [-0.6, 0.8], [-6.5, 0.8]],
  // dış köşe: iki paneli dıştan saran L
  outer: [[-12, t], [-12, t + 0.9], [t + 0.9, t + 0.9], [t + 0.9, -12], [t, -12], [t, 0], [0, 0], [0, t]],
};
/* panel örnekleri: [x0, x1, f0, f1, yön] — yön: z (öne bakar), +x / −x (yana bakar) */
type Piece = [number, number, number, number, "z" | "+x" | "-x"];
const PIECES: Record<ProfileKind, Piece[]> = {
  end: [[-DW, 0, 0.8, 0.8 + t, "z"]],
  t: [[-DW, -0.6, 0, t, "z"], [0.6, DW, 0, t, "z"]],
  inner: [[-DW, -t, 0, t, "z"], [-t, 0, t, DW, "-x"]],
  h: [[-DW, -0.6, 0.8, 0.8 + t, "z"], [0.6, DW, 0.8, 0.8 + t, "z"]],
  outer: [[-DW, 0, 0, t, "z"], [0, t, -DW, 0, "+x"]],
};
/* etiketin işaret ettiği nokta ve kameraya göre dönüş */
const ANCHOR: Record<ProfileKind, [number, number]> = { end: [-3.8, 1.6 + t], t: [0, t + 1.2], inner: [-7, t + 6], h: [0, 1.6 + t], outer: [t, t] };
const TURN: Record<ProfileKind, number> = { end: -0.7, t: -0.75, inner: Math.PI / 4, h: -0.75, outer: -Math.PI / 4 - 0.25 };

/* ön yüzün UV'sini desenin bir bölümüne sıkıştırır (BoxGeometry +z yüzü = köşe 16–19) */
function cropFront(geo: THREE.BoxGeometry, u0: number, v0: number, u1: number, v1: number) {
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 16; i < 20; i++) uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
  uv.needsUpdate = true;
}

export default function PvcStory({ lang, pattern, onPattern }: { lang: Lang; pattern: Pattern; onPattern: (p: Pattern) => void }) {
  const L = pick(lang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bgWordsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const labelPvcRef = useRef<HTMLDivElement>(null);
  const labelStoneRef = useRef<HTMLDivElement>(null);
  const labelJointRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<(p: Pattern) => void>(() => {});
  const metalRef = useRef<(m: Metal) => void>(() => {});
  const kindRef = useRef<(k: ProfileKind) => void>(() => {});
  const [metal, setMetal] = useState<Metal>(METALS[0]);
  const [kind, setKind] = useState(1); // T geçiş profili ile başlar
  const profile = PVC_PROFILES[kind];

  useEffect(() => {
    const host = canvasHostRef.current!;
    const scrollEl = scrollRef.current!;
    const sections = Array.from(scrollEl.querySelectorAll<HTMLElement>("section"));
    const bgWords = Array.from(bgWordsRef.current!.children) as HTMLElement[];
    const navItems = Array.from(navRef.current!.querySelectorAll<HTMLElement>("button"));
    const isMobile = () => window.innerWidth < 768;
    const introStart = performance.now();
    let disposed = false;

    /* --- Renderer & sahne --- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.6;

    const camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.02, 60);

    /* --- Işıklar --- */
    const key = new THREE.DirectionalLight(0xfff3e6, 2.0);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048);
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.target.position.set(0, 1.2, 1);
    scene.add(key, key.target);
    scene.add(new THREE.HemisphereLight(0xfffaf2, 0x9a8a78, 0.55));

    // parlak yüzeyde süzülen ışık çizgisi — cilalı mermer etkisi
    const sweep = new THREE.PointLight(0xffffff, 0, 6, 1.5);
    scene.add(sweep);

    // profil detayı için yakın ışık: metalin parlaması
    const detailLight = new THREE.PointLight(0xffffff, 0, 3, 1.6);
    scene.add(detailLight);

    /* --- Zemin: yalnızca gölgeyi gösterir, sayfa rengiyle bütünleşir --- */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    /* --- Malzemeler --- */
    const edgeMat = new THREE.MeshStandardMaterial({ color: "#d9d2c6", roughness: 0.5 });
    const backMat = new THREE.MeshStandardMaterial({ color: "#d9d5ce", roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: METALS[0].color, roughness: METALS[0].roughness, metalness: METALS[0].metalness, envMapIntensity: 1.8 });
    const placeholder = new THREE.CanvasTexture(solidCanvas("#ece8e2"));
    placeholder.colorSpace = THREE.SRGBColorSpace;
    const frontMat = new THREE.MeshPhysicalMaterial({ map: placeholder, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 });
    const detailFront = new THREE.MeshPhysicalMaterial({ map: placeholder, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 });

    // desen dokuları — levhada fotoğraftaki desen aynen
    const texCache = new Map<string, Promise<THREE.Texture>>();
    const textureFor = (p: Pattern) => {
      let pr = texCache.get(p.img);
      if (!pr) {
        pr = loadPatternCanvas(p.img).then((c) => {
          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          return tex;
        });
        texCache.set(p.img, pr);
      }
      return pr;
    };

    /* --- Ana levha --- */
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 1.45, 2.4);
    scene.add(heroGroup);
    // BoxGeometry yüz sırası: +x, −x, +y, −y, +z (ön), −z (arka)
    const hero = new THREE.Mesh(new THREE.BoxGeometry(SW, SH, ST), [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]);
    hero.castShadow = true;
    hero.receiveShadow = true;
    heroGroup.add(hero);

    // karşılaştırma için doğal mermer plaka (yarı saydam)
    const ghostFront = new THREE.MeshPhysicalMaterial({ map: placeholder, roughness: 0.35, transparent: true, opacity: 0 });
    const ghostEdge = new THREE.MeshStandardMaterial({ color: "#c9c1b4", roughness: 0.7, transparent: true, opacity: 0 });
    const ghost = new THREE.Mesh(new THREE.BoxGeometry(SW, SH, GHOST_T), [ghostEdge, ghostEdge, ghostEdge, ghostEdge, ghostFront, ghostFront]);
    ghost.position.z = GHOST_Z;
    heroGroup.add(ghost);

    /* --- Su damlaları --- */
    const dropMat = new THREE.MeshPhysicalMaterial({ color: "#c9d3d8", roughness: 0.03, clearcoat: 1, transparent: true, opacity: 0, envMapIntensity: 3 });
    const dropGeo = new THREE.SphereGeometry(1, 16, 12);
    const dropLayer = new THREE.Group();
    heroGroup.add(dropLayer);
    const drops = Array.from({ length: 22 }, () => {
      const m = new THREE.Mesh(dropGeo, dropMat);
      const s = 0.012 + Math.random() * 0.01;
      m.scale.set(s, s * 1.5, 0.004);
      m.position.set((Math.random() - 0.5) * SW * 0.9, (Math.random() - 0.5) * SH, ST / 2 + 0.002);
      dropLayer.add(m);
      return { m, speed: 0.05 + Math.random() * 0.2, phase: Math.random() * 10 };
    });
    for (let i = 0; i < 80; i++) {
      const m = new THREE.Mesh(dropGeo, dropMat);
      const s = 0.004 + Math.random() * 0.006;
      m.scale.set(s, s, 0.002);
      m.position.set((Math.random() - 0.5) * SW * 0.95, (Math.random() - 0.5) * SH * 0.95, ST / 2 + 0.0012);
      dropLayer.add(m);
    }

    /* --- Profil detayı: her profil tipi için kesit + panel örnekleri --- */
    const detail = new THREE.Group();
    detail.position.copy(DETAIL);
    detail.scale.setScalar(DS);
    scene.add(detail);
    const kinds = Object.keys(SECTIONS) as ProfileKind[];
    const kindGroups = {} as Record<ProfileKind, THREE.Group>;
    kinds.forEach((k) => {
      const g = new THREE.Group();
      // profil: kesit şekli DH boyunca yukarı uzatılır (şekil y = −f → dünya z = f)
      const shape = new THREE.Shape(SECTIONS[k].map(([x, f]) => new THREE.Vector2(x, -f)));
      const geo = new THREE.ExtrudeGeometry(shape, { depth: DH, bevelEnabled: false, curveSegments: 1 });
      geo.rotateX(-Math.PI / 2);
      const prof = new THREE.Mesh(geo, metalMat);
      prof.castShadow = true;
      prof.receiveShadow = true;
      g.add(prof);
      // panel örnekleri — desenin farklı bölümlerinden kesilmiş gibi
      PIECES[k].forEach(([x0, x1, f0, f1, dir], i) => {
        const along = dir === "z" ? x1 - x0 : f1 - f0;
        const thick = dir === "z" ? f1 - f0 : x1 - x0;
        const box = new THREE.BoxGeometry(along, DH, thick);
        const u0 = 0.18 + i * 0.36, span = 0.3;
        cropFront(box, u0, 0.55, u0 + span, 0.55 + span * (DH / along) * (SW / SH));
        const m = new THREE.Mesh(box, [edgeMat, edgeMat, edgeMat, edgeMat, detailFront, backMat]);
        m.position.set((x0 + x1) / 2, DH / 2, (f0 + f1) / 2);
        if (dir === "+x") m.rotation.y = Math.PI / 2;
        if (dir === "-x") m.rotation.y = -Math.PI / 2;
        m.castShadow = true;
        m.receiveShadow = true;
        g.add(m);
      });
      g.visible = false;
      detail.add(g);
      kindGroups[k] = g;
    });
    let curKind: ProfileKind = PVC_PROFILES[1].id;
    let kindStart = performance.now();
    kindGroups[curKind].visible = true;
    kindRef.current = (k) => {
      if (k === curKind) return;
      kindGroups[curKind].visible = false;
      curKind = k;
      kindGroups[k].visible = true;
      kindStart = performance.now();
    };

    /* --- Desen değişimi: levha öne çıkıp yeni desene geçer --- */
    let swap: { tex: THREE.Texture; start: number; done: boolean } | null = null;
    const applyTo = (mats: THREE.MeshPhysicalMaterial[], tex: THREE.Texture) => mats.forEach((m) => { m.map = tex; m.needsUpdate = true; });
    textureFor(PATTERNS[0]).then((tex) => {
      if (disposed) return;
      applyTo([frontMat, ghostFront, detailFront], tex);
    });
    let shown = PATTERNS[0].code;
    patternRef.current = (p) => {
      if (p.code === shown) return;
      shown = p.code;
      textureFor(p).then((tex) => {
        if (disposed) return;
        swap = { tex, start: performance.now(), done: false };
        applyTo([ghostFront, detailFront], tex);
      });
    };
    metalRef.current = (m) => {
      metalMat.color.set(m.color);
      metalMat.roughness = m.roughness;
      metalMat.metalness = m.metalness;
    };

    /* --- Girdi --- */
    let progress = 0;
    const onScroll = () => {
      const r = scrollEl.getBoundingClientRect();
      progress = clamp(-r.top / (r.height - window.innerHeight));
    };
    let mx = 0, my = 0;
    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onResize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    /* --- Animasyon --- */
    const targetPose = (p: number): Pose => {
      const seg = p * (POSES.length - 1);
      const i = Math.min(POSES.length - 2, Math.floor(seg));
      const k = smooth(0.2, 0.8, seg - i);
      const a = POSES[i], b = POSES[i + 1];
      const out = {} as Pose;
      (Object.keys(a) as (keyof Pose)[]).forEach((key) => (out[key] = a[key] + (b[key] - a[key]) * k));
      if (isMobile()) {
        const shift = out.fx - out.tx;
        out.tx += shift; out.cx += shift;
        const d = Math.hypot(out.cx - out.tx, out.cy - out.ty, out.cz - out.tz);
        out.cx = out.tx + (out.cx - out.tx) * 1.7;
        out.cy = out.ty + (out.cy - out.ty) * 1.7;
        out.cz = out.tz + (out.cz - out.tz) * 1.7;
        out.ty -= d * 0.22; out.cy -= d * 0.22;
      }
      return out;
    };

    const cur: Pose = targetPose(progress);
    let tmx = 0, tmy = 0;
    let turn = TURN[curKind];
    const clock = new THREE.Clock();
    const v = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    let raf = 0;

    const place = (el: HTMLDivElement | null, world: THREE.Vector3, opacity: number) => {
      if (!el) return;
      v.copy(world).project(camera);
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * host.clientWidth}px, ${(-v.y * 0.5 + 0.5) * host.clientHeight}px)`;
      el.style.opacity = String(v.z < 1 ? opacity : 0);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      const k = 1 - Math.exp(-dt * 4.5);
      const now = performance.now();

      const tp = targetPose(progress);
      (Object.keys(cur) as (keyof Pose)[]).forEach((key) => (cur[key] += (tp[key] - cur[key]) * k));
      tmx += (mx - tmx) * k;
      tmy += (my - tmy) * k;

      camera.position.set(cur.cx + tmx * 0.08, cur.cy - tmy * 0.05, cur.cz);
      camera.lookAt(cur.tx, cur.ty, cur.tz);

      // ışık imleci takip eder
      key.position.set(2 + tmx * 2.2 + cur.detail * DETAIL.x, 6 - tmy * 1.2, 7);
      key.target.position.set(cur.detail * DETAIL.x, 1.2, 1);

      // açılış: levha aşağıdan yükselir
      const intro = easeOut(clamp(((now - introStart) / 1000 - 0.2) / 1.4));
      heroGroup.position.y = 1.45 + Math.sin(time * 0.8) * 0.015 - (1 - intro) * 3.2;
      heroGroup.rotation.y = cur.hry + tmx * 0.06;

      // parlama ışığı levhanın önünden geçer
      const sw = ((time * 0.18) % 1) * 2 - 0.5;
      sweep.position.set((sw - 0.5) * 3.2, 2.25, 3.3);
      sweep.intensity = (1 - cur.detail) * 5;

      // karşılaştırma plakası
      ghost.visible = cur.ghost > 0.01;
      ghostFront.opacity = cur.ghost * 0.45;
      ghostEdge.opacity = cur.ghost * 0.9;

      // su damlaları süzülür
      dropMat.opacity = cur.water * 0.7;
      dropLayer.visible = cur.water > 0.01;
      drops.forEach((d) => {
        const stick = 0.35 + 0.65 * Math.max(0, Math.sin(time * 1.3 + d.phase));
        d.m.position.y -= d.speed * stick * dt * (0.4 + cur.water);
        d.m.position.x += Math.sin(time * 2 + d.phase) * 0.0004;
        if (d.m.position.y < -SH / 2) { d.m.position.y = SH / 2; d.m.position.x = (Math.random() - 0.5) * SW * 0.9; }
      });

      // profil detayı: seçilen tip aşağıdan yükselir, kameraya göre döner
      const rise = easeOut(clamp((now - kindStart) / 700));
      kindGroups[curKind].position.y = (1 - rise) * -40;
      turn += (TURN[curKind] - turn) * k;
      detail.rotation.y = turn + tmx * 0.12;
      detail.position.y = DETAIL.y + Math.sin(time * 0.9) * 0.002;
      detail.visible = cur.detail > 0.02;
      detailLight.intensity = cur.detail * 1.6;
      detailLight.position.set(DETAIL.x + 0.25 + Math.sin(time * 0.5) * 0.2, TOP + 0.5, DETAIL.z + 0.4);

      // desen değişimi
      if (swap) {
        const s = clamp((now - swap.start) / 650);
        hero.position.z = Math.sin(s * Math.PI) * 0.06;
        if (s >= 0.5 && !swap.done) { applyTo([frontMat], swap.tex); swap.done = true; }
        if (s >= 1) { swap = null; hero.position.z = 0; }
      }

      // 3D etiketler
      const seg = progress * (POSES.length - 1);
      heroGroup.updateMatrixWorld();
      detail.updateMatrixWorld();
      const near = (i: number) => 1 - smooth(0.1, 0.35, Math.abs(seg - i));
      place(labelPvcRef.current, heroGroup.localToWorld(tmp.set(SW / 2, 0.42, 0)), cur.ghost * near(2));
      place(labelStoneRef.current, heroGroup.localToWorld(tmp.set(SW / 2, 0.3, GHOST_Z)), cur.ghost * near(2));
      const [ax, af] = ANCHOR[curKind];
      place(labelJointRef.current, detail.localToWorld(tmp.set(ax, DH, af)), near(4) * rise);

      // bölüm metinleri, arka plan yazıları, menü
      sections.forEach((el, i) => {
        const d = Math.abs(seg - i);
        const o = 1 - smooth(0.22, 0.55, d);
        el.style.opacity = String(o);
        el.style.setProperty("--shift", `${(seg - i) * -40}px`);
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
      bgWords.forEach((el, i) => {
        const d = seg - i;
        el.style.opacity = String(1 - smooth(0.15, 0.6, Math.abs(d)));
        el.style.transform = `translate(-50%, -50%) translateX(${d * -12}vw)`;
      });
      const active = Math.round(seg);
      navItems.forEach((el, i) => el.toggleAttribute("data-active", i === active));
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${progress})`;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      const mats = new Set<THREE.Material>();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => mats.add(m));
        }
      });
      mats.forEach((m) => m.dispose());
      texCache.forEach((p) => p.then((tex) => tex.dispose()).catch(() => {}));
      placeholder.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  // sayfadaki desen değişince sahne de değişir (galeriden "3D'de dene" dahil)
  useEffect(() => { patternRef.current(pattern); }, [pattern]);

  const chooseMetal = (m: Metal) => {
    setMetal(m);
    metalRef.current(m);
  };
  const chooseKind = (i: number) => {
    setKind(i);
    kindRef.current(PVC_PROFILES[i].id);
    // seçilen renk bu profilde yoksa kroma döner
    if (!PVC_PROFILES[i].imgs[metal.id]) chooseMetal(METALS[0]);
  };
  const nav = [L("Uvod", "Giriş", "Intro"), L("Tekstura", "Doku", "Texture"), L("Debljina", "İncelik", "Slim"), L("Voda", "Su", "Water"), L("Profili", "Profil", "Profiles")];
  const goTo = (i: number) => {
    const top = scrollRef.current!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <div ref={scrollRef} className={styles.scroll} style={{ height: `${POSES.length * 100}vh` }}>
        <div className={styles.sticky}>
          <div className={styles.glow} />
          <nav ref={navRef} className={`${styles.sideNav} ${pvc.sideNav}`} aria-label={L("Poglavlja", "Bölümler", "Chapters")}>
            <div className={styles.progressTrack}><div ref={progressRef} className={styles.progressBar} /></div>
            {nav.map((n, i) => (
              <button key={i} onClick={() => goTo(i)}>
                <span className={styles.navLabel}>{n}</span>
                <span className={styles.navNum}>0{i + 1}</span>
              </button>
            ))}
          </nav>
          <div ref={bgWordsRef} className={styles.bgWords} aria-hidden>
            <span>PVC</span><span>{L("Tekstura", "Doku", "Texture")}</span><span>2,8</span><span>{L("Voda", "Su", "Water")}</span><span>{profile.size}</span>
          </div>
          <div ref={canvasHostRef} className={styles.canvas} />
          <div ref={labelPvcRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>PVC panel</b> · 2,8 mm</span>
          </div>
          <div ref={labelStoneRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>{L("Prirodni mermer", "Doğal mermer", "Natural marble")}</b> · ~20 mm</span>
          </div>
          <div ref={labelJointRef} className={`${styles.label} ${pvc.jointLabel}`}>
            <span className={styles.labelDot} />
            <span><b>{profile.type[lang]}</b> · {profile.size} · {METAL_NAMES[metal.id][lang].toLowerCase()}</span>
          </div>
        </div>

        <div className={styles.sections}>
          <section className={`${styles.section} ${styles.left}`}>
            <p className={`${styles.kicker} ${styles.introFade}`}>{L("PVC mermer paneli", "PVC mermer panel", "PVC marble panels")}</p>
            <h1 className={`${styles.title} ${styles.introTitle}`}>
              <span><span>{L("Sjaj", "Mermerin", "The gleam")}</span></span>
              <span><span><em>{L("mermera", "ışıltısı", "of marble")}</em></span></span>
            </h1>
            <p className={`${styles.text} ${styles.introFade}`}>{L("PVC zidni paneli sa izgledom pravog mermera. Skrolujte i upoznajte ih izbliza.", "Gerçek mermer görünümlü PVC duvar panelleri. Aşağı kaydırın, yakından tanıyın.", "PVC wall panels with the look of real marble. Scroll down to see them up close.")}</p>
            <div className={`${styles.scrollHint} ${styles.introFade}`}><span />{L("Skrolujte", "Kaydırın", "Scroll")}</div>
          </section>

          <section className={`${styles.section} ${styles.right}`}>
            <p className={styles.kicker}>01 — {L("Tekstura", "Doku", "Texture")}</p>
            <h2 className={styles.title}>{L("Prava tekstura", "Gerçek mermer", "True marble")} <em>{L("mermera", "dokusu", "texture")}</em></h2>
            <p className={styles.text}>{L("Svaki dezen vjerno prenosi žile prirodnog kamena. Sjajna površina hvata svjetlost baš kao polirani mermer.", "Her desen doğal taşın damarlarını aslına uygun yansıtır. Parlak yüzey ışığı tıpkı cilalı mermer gibi yakalar.", "Every design faithfully reproduces the veins of natural stone. The gloss surface catches light just like polished marble.")}</p>
            <div className={pvc.patternPick}>
              <div className={pvc.patterns}>
                {PATTERNS.map((p) => (
                  <button
                    key={p.code}
                    className={`${pvc.pattern} ${p.code === pattern.code ? pvc.patternActive : ""}`}
                    style={{ backgroundImage: `url("${p.img}")` }}
                    onClick={() => onPattern(p)}
                    aria-label={p.name}
                    title={p.name}
                  />
                ))}
              </div>
              <p className={pvc.patternName}>{pattern.code} · <b>{pattern.name}</b></p>
            </div>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>02 — {L("Tanko", "İncelik", "Slim")}</p>
            <h2 className={styles.title}>{L("Samo", "Sadece", "Only")} <em>2,8 mm</em></h2>
            <dl className={styles.specs}>
              <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>2,8<small>mm</small></dd></div>
              <div><dt>{L("Širina", "Genişlik", "Width")}</dt><dd>122<small>cm</small></dd></div>
              <div><dt>{L("Dužina", "Uzunluk", "Length")}</dt><dd>280<small>cm</small></dd></div>
            </dl>
            <p className={styles.pack}>{L("Višestruko tanji i lakši od prirodnog mermera", "Doğal mermerden kat kat ince ve hafif", "Many times thinner and lighter than natural marble")}</p>
          </section>

          <section className={`${styles.section} ${styles.right}`}>
            <p className={styles.kicker}>03 — {L("Vodootporno", "Suya dayanıklı", "Waterproof")}</p>
            <h2 className={styles.title}>{lang === "me" ? <>Savršen <em>i u kupatilu</em></> : lang === "tr" ? <>Banyoda <em>bile</em> kusursuz</> : <>Flawless <em>even in the bathroom</em></>}</h2>
            <p className={styles.text}>{L("Površina otporna na vlagu i vodu — idealna za kupatila, kuhinje i vlažne prostorije. Lako se briše, bez fugni.", "Neme ve suya dayanıklı yüzey; banyo, mutfak ve ıslak hacimler için ideal. Silinmesi kolay, derz ve fuga yok.", "A moisture- and water-resistant surface — ideal for bathrooms, kitchens and wet rooms. Wipes clean, no grout lines.")}</p>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>04 — {L("Aluminijumski profili", "Alüminyum profiller", "Aluminium profiles")}</p>
            <h2 className={styles.title}>{L("Profil za", "Her birleşime", "A profile for")} <em>{L("svaki spoj", "bir profil", "every joint")}</em></h2>
            <div className={styles.card}>
              <p className={styles.cardLabel}>{L("Vrsta profila", "Profil çeşidi", "Profile type")} · {PVC_PROFILES.length}</p>
              <div className={pvc.kinds}>
                {PVC_PROFILES.map((p, i) => (
                  <button key={p.id} className={`${pvc.kindBtn} ${i === kind ? pvc.kindActive : ""}`} onClick={() => chooseKind(i)}>
                    <b>{p.type[lang]}</b><small>{p.size}</small>
                  </button>
                ))}
              </div>
              <p className={pvc.kindText}>{profile.text[lang]}</p>
              <p className={styles.cardLabel}>{L("Boja", "Renk", "Colour")}</p>
              <div className={pvc.metals}>
                {METALS.map((m) => {
                  const ok = Boolean(profile.imgs[m.id]);
                  return (
                    <button key={m.id} disabled={!ok} className={`${pvc.metalBtn} ${m.id === metal.id ? pvc.metalActive : ""}`} onClick={() => chooseMetal(m)}
                      title={ok ? undefined : L("Nije dostupno za ovaj profil", "Bu profilde yok", "Not available for this profile")}>
                      <span style={{ background: m.color }} />{METAL_NAMES[m.id][lang]}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
