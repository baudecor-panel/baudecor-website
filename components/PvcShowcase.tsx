"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import styles from "./PanelShowcase.module.css";
import pvc from "./PvcShowcase.module.css";

/* ===== Levha ölçüleri (m) — 122 × 280 cm, 2,8 mm ===== */
const SW = 1.22;
const SH = 2.8;
const ST = 0.0028;
const GHOST_T = 0.02;   // karşılaştırma: doğal mermer plaka
const GHOST_Z = -0.16;  // levhanın arkasındaki konumu
const HERO_HOME = new THREE.Vector3(0, SH / 2, ST / 2 + 0.0002);

/* ===== Desenler — sitedeki gerçek ürün fotoğrafları ===== */
type Pattern = { name: string; code: string; img: string };
const PATTERNS: Pattern[] = [
  { name: "Carrara Gold", code: "PVC-03", img: "/pvc-Carrara-Gold.jpeg" },
  { name: "Bianco Carrara", code: "PVC-01", img: "/pvc-bianco-carrara.jpg" },
  { name: "Arabescato Brown", code: "PVC-02", img: "/pvc-Arebescato-Brown.jpg" },
  { name: "Marmori Grey", code: "PVC-04", img: "/pvc-Marmori-Grey.jpg" },
  { name: "Nero Black", code: "PVC-05", img: "/pvc-Nero-Black.jpg" },
  { name: "Onyx Green", code: "PVC-06", img: "/pvc-Onyx-Green.jpg" },
  { name: "Picasso", code: "PVC-07", img: "/pvc-Picasso.jpg" },
  { name: "Sahara Black", code: "PVC-08", img: "/pvc-Sahara-Black.jpg" },
  { name: "Sahara White", code: "PVC-09", img: "/pvc-Sahara-White.jpg" },
  { name: "Vanilla", code: "PVC-10", img: "/pvc-Vanilla.jpg" },
  { name: "Viola", code: "PVC-11", img: "/pvc-Viola.jpg" },
  { name: "Anthracite Gray", code: "PVC-12", img: "/pvc-ANTHRACITHE-GRAY.jpg" },
  { name: "Alu Gray", code: "PVC-13", img: "/pvc-Alu-Gray.jpg" },
  { name: "Bolzano Bej", code: "PVC-14", img: "/pvc-BOLZANO-BEJ.jpg" },
  { name: "Blue Nile", code: "PVC-15", img: "/pvc-Blue-Nile.jpg" },
  { name: "Calacatta Gold", code: "PVC-16", img: "/pvc-CALACATTA-GOLD.jpg" },
  { name: "New Carrara Gold", code: "PVC-17", img: "/pvc-NEW-CARRARA-GOLD.jpg" },
  { name: "Solid White", code: "PVC-18", img: "/pvc-Solid-White.jpg" },
];

/* ===== Alüminyum profil renkleri ===== */
type Metal = { id: string; name: string; color: string; roughness: number; metalness: number };
const METALS: Metal[] = [
  { id: "krom", name: "Krom", color: "#dcdfe2", roughness: 0.18, metalness: 1 },
  { id: "altin", name: "Altın", color: "#d2a54e", roughness: 0.22, metalness: 1 },
  { id: "siyah", name: "Siyah", color: "#1d1d1f", roughness: 0.45, metalness: 0.6 },
];

/* ===== Kaydırma senaryosu: kamera, levha ve sahne öğeleri ===== */
type Pose = {
  cx: number; cy: number; cz: number;   // kamera
  tx: number; ty: number; tz: number;   // kameranın baktığı nokta
  fx: number;                           // mobilde ortalanacak nesne
  hx: number; hy: number; hz: number; hry: number; // ana levha
  room: number; ghost: number; water: number;
};
const P = (o: Pose) => o;
const POSES: Pose[] = [
  P({ cx: -1.15, cy: 1.5, cz: 7.6, tx: -1.15, ty: 1.45, tz: 2.4, fx: 0, hx: 0, hy: 1.45, hz: 2.4, hry: -0.35, room: 0, ghost: 0, water: 0 }), // giriş
  P({ cx: 0.9, cy: 1.9, cz: 4.6, tx: 0.75, ty: 1.7, tz: 2.4, fx: 0, hx: 0, hy: 1.45, hz: 2.4, hry: 0.55, room: 0, ghost: 0, water: 0 }),      // doku
  P({ cx: 1.3, cy: 1.92, cz: 2.56, tx: 0.61, ty: 1.82, tz: 2.5, fx: 0.61, hx: 0, hy: 1.45, hz: 2.4, hry: 0, room: 0, ghost: 1, water: 0 }), // incelik — kenarlardan bakış
  P({ cx: 0.75, cy: 1.65, cz: 4.0, tx: 0.65, ty: 1.55, tz: 2.4, fx: 0, hx: 0, hy: 1.45, hz: 2.4, hry: 0.4, room: 0, ghost: 0, water: 1 }),      // su
  P({ cx: 0.05, cy: 2.4, cz: 1.35, tx: 0.61, ty: 2.35, tz: 0, fx: 0.61, hx: HERO_HOME.x, hy: HERO_HOME.y, hz: HERO_HOME.z, hry: 0, room: 1, ghost: 0, water: 0 }), // profiller
  P({ cx: 2.5, cy: 1.8, cz: 9.4, tx: -1.65, ty: 1.3, tz: 0.8, fx: 0, hx: HERO_HOME.x, hy: HERO_HOME.y, hz: HERO_HOME.z, hry: 0, room: 1, ghost: 0, water: 0 }),    // sanal banyo
];
const NAV = ["Giriş", "Doku", "İncelik", "Su", "Profil", "Banyo"];

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

/* Ceviz dolap dokusu */
function grainTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#6e4c33";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 90; i++) {
    const y0 = Math.random() * 256, amp = 1 + Math.random() * 4, ph = Math.random() * 6;
    ctx.globalAlpha = 0.1 + Math.random() * 0.25;
    ctx.strokeStyle = Math.random() > 0.4 ? "#4a3020" : "#8a6446";
    ctx.lineWidth = 0.5 + Math.random() * 1.5;
    ctx.beginPath();
    for (let x = 0; x <= 256; x += 8) {
      const y = y0 + Math.sin(x * 0.02 + ph) * amp;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* Ayna: odayı yansıtıyormuş gibi yumuşak geçiş */
function mirrorTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, "#f7f8f8");
  g.addColorStop(0.45, "#dfe4e6");
  g.addColorStop(0.55, "#eef1f2");
  g.addColorStop(1, "#c9d0d3");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function solidCanvas(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 4;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 4, 4);
  return c;
}

export default function PvcShowcase() {
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
  const [pattern, setPattern] = useState<Pattern>(PATTERNS[0]);
  const [metal, setMetal] = useState<Metal>(METALS[0]);

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

    /* --- Zemin: yalnızca gölgeyi gösterir, sayfa rengiyle bütünleşir --- */
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.1 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    /* --- Malzemeler --- */
    const edgeMat = new THREE.MeshStandardMaterial({ color: "#d9d2c6", roughness: 0.5 });
    const backMat = new THREE.MeshStandardMaterial({ color: "#d9d5ce", roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: METALS[0].color, roughness: METALS[0].roughness, metalness: METALS[0].metalness });
    const placeholder = new THREE.CanvasTexture(solidCanvas("#ece8e2"));
    placeholder.colorSpace = THREE.SRGBColorSpace;

    const makeFrontMat = () =>
      new THREE.MeshPhysicalMaterial({ map: placeholder, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 });

    // desen dokuları — her levhada fotoğraftaki desen aynen
    const texCache = new Map<string, Promise<THREE.Texture>>();
    const textureFor = (p: Pattern) => {
      let pr = texCache.get(p.img);
      if (!pr) {
        pr = loadPatternCanvas(p.img).then((c) => {
          const t = new THREE.CanvasTexture(c);
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = renderer.capabilities.getMaxAnisotropy();
          return t;
        });
        texCache.set(p.img, pr);
      }
      return pr;
    };

    const sheetGeo = new THREE.BoxGeometry(SW, SH, ST);
    type Sheet = { mesh: THREE.Mesh; front: THREE.MeshPhysicalMaterial; base: THREE.Vector3; normal: THREE.Vector3 };
    const makeSheet = (base: THREE.Vector3, rotY: number): Sheet => {
      const front = makeFrontMat();
      // BoxGeometry yüz sırası: +x, −x, +y, −y, +z (ön), −z (arka)
      const mesh = new THREE.Mesh(sheetGeo, [edgeMat, edgeMat, edgeMat, edgeMat, front, backMat]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.copy(base);
      mesh.rotation.y = rotY;
      const normal = new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY));
      return { mesh, front, base: base.clone(), normal };
    };

    /* --- Ana levha (sonunda arka duvarın ortasına yerleşir) --- */
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);
    const hero = makeSheet(new THREE.Vector3(), 0);
    heroGroup.add(hero.mesh);

    // karşılaştırma için doğal mermer plaka (yarı saydam)
    const ghostFront = new THREE.MeshPhysicalMaterial({ map: placeholder, roughness: 0.35, transparent: true, opacity: 0 });
    const ghostEdge = new THREE.MeshStandardMaterial({ color: "#c9c1b4", roughness: 0.7, transparent: true, opacity: 0 });
    const ghost = new THREE.Mesh(new THREE.BoxGeometry(SW, SH, GHOST_T), [ghostEdge, ghostEdge, ghostEdge, ghostEdge, ghostFront, ghostFront]);
    ghost.position.z = GHOST_Z;
    heroGroup.add(ghost);

    /* --- Su damlaları --- */
    const dropMat = new THREE.MeshPhysicalMaterial({ color: "#c9d3d8", roughness: 0.03, clearcoat: 1, transparent: true, opacity: 0, envMapIntensity: 3 });
    const dropGeo = new THREE.SphereGeometry(1, 16, 12);
    const drops = Array.from({ length: 22 }, () => {
      const m = new THREE.Mesh(dropGeo, dropMat);
      const s = 0.012 + Math.random() * 0.01;
      m.scale.set(s, s * 1.5, 0.004);
      m.position.set((Math.random() - 0.5) * SW * 0.9, (Math.random() - 0.5) * SH, ST / 2 + 0.002);
      heroGroup.add(m);
      return { m, speed: 0.05 + Math.random() * 0.2, phase: Math.random() * 10 };
    });
    for (let i = 0; i < 80; i++) {
      const m = new THREE.Mesh(dropGeo, dropMat);
      const s = 0.004 + Math.random() * 0.006;
      m.scale.set(s, s, 0.002);
      m.position.set((Math.random() - 0.5) * SW * 0.95, (Math.random() - 0.5) * SH * 0.95, ST / 2 + 0.0012);
      heroGroup.add(m);
    }

    /* --- Banyo: duvarlar, profiller, lavabo, ayna --- */
    const room = new THREE.Group();
    scene.add(room);
    const roomSheets: Sheet[] = [
      makeSheet(new THREE.Vector3(-SW, SH / 2, HERO_HOME.z), 0),
      makeSheet(new THREE.Vector3(SW, SH / 2, HERO_HOME.z), 0),
      makeSheet(new THREE.Vector3(-1.5 * SW + HERO_HOME.z, SH / 2, SW / 2), Math.PI / 2),
      makeSheet(new THREE.Vector3(-1.5 * SW + HERO_HOME.z, SH / 2, SW * 1.5), Math.PI / 2),
    ];
    roomSheets.forEach((s) => room.add(s.mesh));

    const profiles = new THREE.Group();
    const addProfile = (w: number, d: number, x: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, SH, d), metalMat);
      m.position.set(x, SH / 2, z);
      m.castShadow = true;
      profiles.add(m);
    };
    addProfile(0.01, 0.004, -SW / 2, 0.004);            // T geçiş profilleri
    addProfile(0.01, 0.004, SW / 2, 0.004);
    addProfile(0.004, 0.01, -1.5 * SW + 0.004, SW);     // yan duvar geçişi
    addProfile(0.012, 0.012, -1.5 * SW + 0.006, 0.006); // iç köşe
    addProfile(0.008, 0.008, 1.5 * SW + 0.004, 0.004);  // bitiş profilleri
    addProfile(0.008, 0.008, -1.5 * SW + 0.004, 2 * SW + 0.004);
    room.add(profiles);

    const furniture = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ map: grainTexture(), roughness: 0.5 });
    const ceramicMat = new THREE.MeshPhysicalMaterial({ color: "#fbfaf7", roughness: 0.15, clearcoat: 0.6 });
    const mirrorMat = new THREE.MeshStandardMaterial({ map: mirrorTexture(), roughness: 0.06, metalness: 0.2 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: "#e6dfd5", roughness: 0.85 });
    const roomFloor = new THREE.Mesh(new THREE.PlaneGeometry(3 * SW, 2 * SW), stoneMat);
    roomFloor.rotation.x = -Math.PI / 2;
    roomFloor.position.set(0, 0.001, SW);
    roomFloor.receiveShadow = true;
    furniture.add(roomFloor);
    const cabinet = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.42, 0.48, 4, 0.012), woodMat);
    cabinet.position.set(0, 0.75, 0.25);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.12, 48), ceramicMat);
    basin.position.set(0, 1.02, 0.27);
    const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.16, 16), metalMat);
    tap.rotation.x = Math.PI / 2;
    tap.position.set(0, 1.16, 0.08);
    const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.012, 64), mirrorMat);
    mirror.rotation.x = Math.PI / 2;
    mirror.position.set(0, 1.78, 0.02);
    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.365, 0.012, 16, 96), metalMat);
    frame.position.set(0, 1.78, 0.026);
    [cabinet, basin, tap, mirror, frame].forEach((m) => { m.castShadow = true; m.receiveShadow = true; furniture.add(m); });
    room.add(furniture);

    const roomMats = [woodMat, ceramicMat, mirrorMat, metalMat, stoneMat];

    /* --- Desen değişimi: levhalar sırayla öne çıkıp yeni desene geçer --- */
    const allSheets = [hero, ...roomSheets];
    let swap: { tex: THREE.Texture; start: number; done: boolean[] } | null = null;
    const applyGhost = (t: THREE.Texture) => { ghostFront.map = t; ghostFront.needsUpdate = true; };
    textureFor(PATTERNS[0]).then((t) => {
      if (disposed) return;
      allSheets.forEach((s) => { s.front.map = t; s.front.needsUpdate = true; });
      applyGhost(t);
    });
    patternRef.current = (p) => {
      textureFor(p).then((t) => {
        if (disposed) return;
        swap = { tex: t, start: performance.now(), done: allSheets.map(() => false) };
        applyGhost(t);
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
      const t = smooth(0.2, 0.8, seg - i);
      const a = POSES[i], b = POSES[i + 1];
      const out = {} as Pose;
      (Object.keys(a) as (keyof Pose)[]).forEach((k) => (out[k] = a[k] + (b[k] - a[k]) * t));
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
      key.position.set(2 + tmx * 2.2, 6 - tmy * 1.2, 7);

      // açılış: levha aşağıdan yükselir
      const intro = easeOut(clamp(((now - introStart) / 1000 - 0.2) / 1.4));
      const floatY = (1 - cur.room) * Math.sin(time * 0.8) * 0.015;
      heroGroup.position.set(cur.hx, cur.hy + floatY - (1 - intro) * 3.2, cur.hz);
      heroGroup.rotation.y = cur.hry + (1 - cur.room) * tmx * 0.06;

      // parlama ışığı levhanın önünden geçer (yalnızca levha havadayken)
      const sw = ((time * 0.18) % 1) * 2 - 0.5;
      sweep.position.set(cur.hx + (sw - 0.5) * 3.2, cur.hy + 0.8, cur.hz + 0.9);
      sweep.intensity = (1 - cur.room) * 5;

      // karşılaştırma plakası
      ghost.visible = cur.ghost > 0.01;
      ghostFront.opacity = cur.ghost * 0.45;
      ghostEdge.opacity = cur.ghost * 0.9;

      // su damlaları süzülür
      dropMat.opacity = cur.water * 0.7;
      drops.forEach((d) => {
        d.m.visible = cur.water > 0.01;
        const stick = 0.35 + 0.65 * Math.max(0, Math.sin(time * 1.3 + d.phase));
        d.m.position.y -= d.speed * stick * dt * (0.4 + cur.water);
        d.m.position.x += Math.sin(time * 2 + d.phase) * 0.0004;
        if (d.m.position.y < -SH / 2) { d.m.position.y = SH / 2; d.m.position.x = (Math.random() - 0.5) * SW * 0.9; }
      });
      heroGroup.children.forEach((c) => { if (c !== hero.mesh && c !== ghost && !drops.some((d) => d.m === c)) c.visible = cur.water > 0.01; });

      // banyo öğeleri sırayla belirir
      roomSheets.forEach((s, i) => {
        const r = smooth(i * 0.12, 0.55 + i * 0.12, cur.room);
        s.mesh.visible = r > 0.001;
        s.front.transparent = r < 0.999;
        s.front.opacity = r;
        s.mesh.position.copy(s.base).addScaledVector(s.normal, (1 - r) * 0.4);
      });
      const fr = smooth(0.5, 1, cur.room);
      furniture.visible = profiles.visible = fr > 0.001;
      roomMats.forEach((m) => { m.transparent = fr < 0.999; m.opacity = fr; });
      furniture.position.y = (1 - fr) * -0.3;
      floorMat.opacity = 0.1;

      // desen değişimi
      if (swap) {
        let finished = true;
        allSheets.forEach((s, i) => {
          const t = clamp((now - swap!.start - i * 110) / 650);
          if (t < 1) finished = false;
          const pop = Math.sin(t * Math.PI) * 0.06;
          if (s !== hero) s.mesh.position.addScaledVector(s.normal, pop);
          else hero.mesh.position.z = pop;
          if (t >= 0.5 && !swap!.done[i]) {
            s.front.map = swap!.tex;
            s.front.needsUpdate = true;
            swap!.done[i] = true;
          }
        });
        if (finished) { swap = null; hero.mesh.position.z = 0; }
      }

      // 3D etiketler
      const seg = progress * (POSES.length - 1);
      heroGroup.updateMatrixWorld();
      place(labelPvcRef.current, heroGroup.localToWorld(tmp.set(SW / 2, 0.42, 0)), cur.ghost * (1 - smooth(0.1, 0.35, Math.abs(seg - 2))));
      place(labelStoneRef.current, heroGroup.localToWorld(tmp.set(SW / 2, 0.3, GHOST_Z)), cur.ghost * (1 - smooth(0.1, 0.35, Math.abs(seg - 2))));
      place(labelJointRef.current, tmp.set(SW / 2, 2.45, 0.006), 1 - smooth(0.1, 0.35, Math.abs(seg - 4)));

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
      texCache.forEach((p) => p.then((t) => t.dispose()).catch(() => {}));
      placeholder.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  const choosePattern = (p: Pattern) => {
    if (p.code === pattern.code) return;
    setPattern(p);
    patternRef.current(p);
  };
  const chooseMetal = (m: Metal) => {
    setMetal(m);
    metalRef.current(m);
  };
  const goTo = (i: number) => {
    const top = scrollRef.current!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight, behavior: "smooth" });
  };

  const metalButtons = (
    <div className={pvc.metals}>
      {METALS.map((m) => (
        <button key={m.id} className={`${pvc.metalBtn} ${m.id === metal.id ? pvc.metalActive : ""}`} onClick={() => chooseMetal(m)}>
          <span style={{ background: m.color }} />{m.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden />
      <div className={styles.vignette} aria-hidden />
      <div className={styles.gridLines} aria-hidden><span /><span /><span /></div>

      <header className={styles.topbar}>
        <Link href="/" aria-label="Baudecor - Ana Sayfa">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Baudecor" className={styles.logo} />
        </Link>
        <p className={styles.topMeta}>PVC · Mermer Koleksiyon</p>
        <Link href="/" className={styles.back}>← Ana sayfa</Link>
      </header>

      <nav ref={navRef} className={styles.sideNav} aria-label="Bölümler">
        <div className={styles.progressTrack}><div ref={progressRef} className={styles.progressBar} /></div>
        {NAV.map((n, i) => (
          <button key={n} onClick={() => goTo(i)}>
            <span className={styles.navLabel}>{n}</span>
            <span className={styles.navNum}>0{i + 1}</span>
          </button>
        ))}
      </nav>

      <footer className={styles.bottomBar}>
        <span>Showroom · Ulcinj, Crna Gora</span>
        <a href="tel:+38268361700">+382 68 361 700</a>
      </footer>

      <div ref={scrollRef} className={styles.scroll} style={{ height: `${POSES.length * 100}vh` }}>
        <div className={styles.sticky}>
          <div className={styles.glow} />
          <div ref={bgWordsRef} className={styles.bgWords} aria-hidden>
            <span>PVC</span><span>Doku</span><span>2,8</span><span>Su</span><span>Profil</span><span>{pattern.code}</span>
          </div>
          <div ref={canvasHostRef} className={styles.canvas} />
          <div ref={labelPvcRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>PVC panel</b> · 2,8 mm</span>
          </div>
          <div ref={labelStoneRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>Doğal mermer</b> · ~20 mm</span>
          </div>
          <div ref={labelJointRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>T geçiş profili</b> · {metal.name.toLowerCase()}</span>
          </div>
        </div>

        <div className={styles.sections}>
          <section className={`${styles.section} ${styles.left}`}>
            <p className={`${styles.kicker} ${styles.introFade}`}>Baudecor · PVC Mermer Panel</p>
            <h1 className={`${styles.title} ${styles.introTitle}`}>
              <span><span>Mermerin</span></span>
              <span><span><em>ışıltısı</em></span></span>
            </h1>
            <p className={`${styles.text} ${styles.introFade}`}>Gerçek mermer görünümlü PVC duvar panelleri. Aşağı kaydırın, yakından tanıyın.</p>
            <div className={`${styles.scrollHint} ${styles.introFade}`}><span />Kaydırın</div>
          </section>

          <section className={`${styles.section} ${styles.right}`}>
            <p className={styles.kicker}>01 — Doku</p>
            <h2 className={styles.title}>Gerçek mermer <em>dokusu</em></h2>
            <p className={styles.text}>Her desen doğal taşın damarlarını aslına uygun yansıtır. Parlak yüzey ışığı tıpkı cilalı mermer gibi yakalar.</p>
            <p className={styles.hint}><span className={styles.hintIcon} />İmleci hareket ettirin — ışık sizi takip eder</p>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>02 — İncelik</p>
            <h2 className={styles.title}>Sadece <em>2,8 mm</em></h2>
            <dl className={styles.specs}>
              <div><dt>Kalınlık</dt><dd>2,8<small>mm</small></dd></div>
              <div><dt>Genişlik</dt><dd>122<small>cm</small></dd></div>
              <div><dt>Uzunluk</dt><dd>280<small>cm</small></dd></div>
            </dl>
            <p className={styles.pack}>Doğal mermerden kat kat ince ve hafif</p>
          </section>

          <section className={`${styles.section} ${styles.right}`}>
            <p className={styles.kicker}>03 — Suya dayanıklı</p>
            <h2 className={styles.title}>Banyoda <em>bile</em> kusursuz</h2>
            <p className={styles.text}>Neme ve suya dayanıklı yüzey; banyo, mutfak ve ıslak hacimler için ideal. Silinmesi kolay, derz ve fuga yok.</p>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>04 — Alüminyum profiller</p>
            <h2 className={styles.title}>Kusursuz <em>birleşim</em></h2>
            <p className={styles.text}>Alüminyum profiller levhaları birleştirir; köşeleri ve kenarları temiz bir çizgiyle tamamlar.</p>
            <div className={pvc.metalsWrap}>{metalButtons}</div>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>05 — Sanal banyo</p>
            <h2 className={styles.title}><em>{pattern.name}</em></h2>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Desen · {PATTERNS.length} seçenek</p>
              <div className={pvc.patterns}>
                {PATTERNS.map((p) => (
                  <button
                    key={p.code}
                    className={`${pvc.pattern} ${p.code === pattern.code ? pvc.patternActive : ""}`}
                    style={{ backgroundImage: `url("${p.img}")` }}
                    onClick={() => choosePattern(p)}
                    aria-label={p.name}
                    title={p.name}
                  />
                ))}
              </div>
              <p className={styles.cardLabel}>Profil rengi</p>
              {metalButtons}
              <div className={styles.ctas}>
                <a href="tel:+38268361700" className={styles.cta}>Bizi arayın</a>
                <Link href="/urunler/pvc-paneli" className={styles.ctaOutline}>Tüm PVC desenler</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
