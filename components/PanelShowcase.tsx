"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import styles from "./PanelShowcase.module.css";

/* ===== Profil ölçüleri (mm) — ürün teknik çizimlerinden ===== */
const T = 18;        // kalınlık
const LIP = 6;       // bindirme kenarı genişliği
const LIP_H = 6;     // bindirme kenarı yüksekliği
const SHOW_L = 1.2;  // sahnede gösterilen boy (m) — gerçek boy 2800 mm
const BOARDS = 7;    // yan yana panel sayısı

/* ===== Renkler ===== */
type FinishType = "wood" | "solid" | "patina";
type Finish = { id: string; name: string; type: FinishType; base: string; dark: string; light: string };
const wood = (id: string, name: string, base: string, dark: string, light: string): Finish => ({ id, name, type: "wood", base, dark, light });
const solid = (id: string, name: string, base: string): Finish => ({ id, name, type: "solid", base, dark: base, light: base });
const patina = (id: string, name: string, base: string, dark: string): Finish => ({ id, name, type: "patina", base, dark, light: base });

/* ===== Modeller ===== */
type Model = { id: string; code: string; label: string; width: number; packKg: string; face: [number, number][]; finishes: Finish[] };

/* Yüzey profili: soldan sağa, 0..P aralığında (P = genişlik − bindirme) */
function grooveFace(P: number): [number, number][] {
  const g = 10, depth = 9, rib = (P - 3 * g) / 3;
  const pts: [number, number][] = [[0, T]];
  let x = 0;
  for (let i = 0; i < 3; i++) {
    x += rib;
    pts.push([x, T], [x, T - depth]);
    x += g;
    pts.push([x, T - depth]);
    if (i < 2) pts.push([x, T]);
  }
  return pts;
}

function arcFace(P: number, n: number, sag: number, convex: boolean): [number, number][] {
  const c = P / n;
  const r = (c * c / 4 + sag * sag) / (2 * sag);
  const pts: [number, number][] = [];
  const SEG = 28;
  for (let k = 0; k < n; k++) {
    const xc = c * k + c / 2;
    for (let j = k === 0 ? 0 : 1; j <= SEG; j++) {
      const x = c * k + (c * j) / SEG;
      const dx = Math.min(Math.abs(x - xc), r);
      const h = Math.sqrt(r * r - dx * dx);
      const y = convex ? T - sag + (h - (r - sag)) : T - sag + (r - h);
      pts.push([x, y]);
    }
  }
  return pts;
}

const MODELS: Model[] = [
  {
    id: "18121", code: "18121", label: "Kanallı", width: 121, packKg: "20,77", face: grooveFace(121 - LIP),
    finishes: [
      wood("teak", "Teak", "#9a6a40", "#6b4423", "#b8875a"),
      wood("walnut", "Antik Walnut", "#6e4b32", "#47301e", "#8c6546"),
      wood("asos", "Asos", "#c8a77d", "#a2804f", "#dfc39b"),
      solid("st-white", "Soft Touch White", "#e6e4df"),
      solid("st-black", "Soft Touch Siyah", "#1f1f20"),
      solid("st-anth", "Soft Touch Antrasit", "#3b3d40"),
    ],
  },
  {
    id: "18118Y", code: "18118Y", label: "Dalgalı", width: 118, packKg: "19,77", face: arcFace(118 - LIP, 3, 7, false),
    finishes: [
      solid("water-green", "Water Green", "#8ea597"),
      solid("iceland-blue", "İzlanda Blue", "#2d405a"),
      solid("y-anth", "Soft Touch Antrasit", "#3b3d40"),
      solid("kiremit", "Kiremit", "#b0533b"),
    ],
  },
  {
    id: "18118B", code: "18118B", label: "Yarım yuvarlak", width: 118, packKg: "18,77", face: arcFace(118 - LIP, 5, 9, true),
    finishes: [
      patina("patine-krem", "Patine Krem", "#ece6da", "#c4b9a6"),
      patina("patine-pink", "Patine Pink", "#e2b2aa", "#bf8b82"),
      patina("b-iceland", "İzlanda Blue", "#33475f", "#22324a"),
    ],
  },
];

/* ===== Kaydırma senaryosu ===== */
type Pose = { ry: number; rx: number; x: number; y: number; ex: number; z: number };
const POSES: Pose[] = [
  { ry: -0.55, rx: 0.12, x: 0.5, y: 0, ex: 0, z: 2.75 },     // giriş
  { ry: 0.55, rx: 0.06, x: -0.5, y: 0, ex: 0, z: 2.45 },     // doku
  { ry: 0.3, rx: 0.8, x: 0.16, y: -0.34, ex: 0, z: 1.8 },   // profil — üst kesit
  { ry: 0.45, rx: 0.1, x: -0.45, y: 0, ex: 1, z: 2.9 },      // montaj
  { ry: -0.4, rx: 0.06, x: 0.45, y: 0, ex: 0, z: 2.7 },      // model & renk
];

const NAV = ["Giriş", "Doku", "Profil", "Montaj", "Model"];

/* ===== Yardımcılar ===== */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Kodla üretilen yüzey dokusu — damarlar boy yönünde */
function makeFinishCanvas(f: Finish) {
  const W = 256, H = 2048;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const rnd = seeded(1234);
  ctx.fillStyle = f.base;
  ctx.fillRect(0, 0, W, H);

  if (f.type === "solid") {
    // mat yüzey — çok hafif kumlama
    for (let i = 0; i < 6000; i++) {
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = rnd() > 0.5 ? "#000" : "#fff";
      ctx.fillRect(rnd() * W, rnd() * H, 1, 1);
    }
    ctx.globalAlpha = 1;
    return c;
  }

  const strong = f.type === "wood";
  if (strong) {
    for (let i = 0; i < 6; i++) {
      const g = ctx.createLinearGradient(rnd() * W, 0, rnd() * W, H);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.5, rnd() > 0.5 ? f.light : f.dark);
      g.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = g;
      ctx.fillRect(rnd() * W - 60, 0, 60 + rnd() * 120, H);
    }
  }
  for (let i = 0; i < 140; i++) {
    const x0 = rnd() * W;
    const amp = 2 + rnd() * 10;
    const freq = 0.002 + rnd() * 0.004;
    const phase = rnd() * Math.PI * 2;
    ctx.globalAlpha = strong ? 0.08 + rnd() * 0.25 : 0.05 + rnd() * 0.18;
    ctx.strokeStyle = rnd() > 0.35 ? f.dark : f.light;
    ctx.lineWidth = 0.5 + rnd() * 1.8;
    ctx.beginPath();
    for (let y = 0; y <= H; y += 16) {
      const x = x0 + Math.sin(y * freq + phase) * amp + Math.sin(y * freq * 3.1) * amp * 0.25;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = strong ? 0.12 : 0.08;
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = rnd() > 0.5 ? f.dark : f.light;
    ctx.fillRect(rnd() * W, rnd() * H, 1, 2 + rnd() * 5);
  }
  ctx.globalAlpha = 1;
  return c;
}

/* Ham MDF kesit dokusu */
function makeMdfTexture() {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#a47b52";
  ctx.fillRect(0, 0, S, S);
  const rnd = seeded(11);
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle = rnd() > 0.5 ? "rgba(70,45,20,0.35)" : "rgba(210,170,120,0.3)";
    ctx.fillRect(rnd() * S, rnd() * S, 1, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(25, 25);
  return t;
}

/* Profil şeklinden panel geometrisi — boy yönü dikey, yüz kameraya bakar */
function makeBoardGeometry(m: Model) {
  const W = m.width, P = W - LIP;
  const pts: [number, number][] = [[0, 0], [P, 0], [P, LIP_H], [W, LIP_H]];
  for (let i = m.face.length - 1; i >= 0; i--) pts.push([m.face[i][0] + LIP, m.face[i][1]]);
  pts.push([LIP, LIP_H], [0, LIP_H]);
  const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2((x - W / 2) / 1000, (y - T / 2) / 1000)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: SHOW_L, bevelEnabled: false, steps: 1 });
  geo.translate(0, 0, -SHOW_L / 2);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/* Paneller birbirine bindiği için adım = genişlik − bindirme */
const boardX = (m: Model, i: number) => {
  const P = (m.width - LIP) / 1000, total = BOARDS * P + LIP / 1000;
  return -total / 2 + i * P + m.width / 2000;
};

export default function PanelShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const labelJointRef = useRef<HTMLDivElement>(null);
  const labelCoreRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bgWordsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const applyRef = useRef<(m: Model, f: Finish) => void>(() => {});
  const [model, setModel] = useState<Model>(MODELS[0]);
  const [finish, setFinish] = useState<Finish>(MODELS[0].finishes[0]);

  useEffect(() => {
    const host = canvasHostRef.current!;
    const scrollEl = scrollRef.current!;
    const sections = Array.from(scrollEl.querySelectorAll<HTMLElement>("section"));
    const bgWords = Array.from(bgWordsRef.current!.children) as HTMLElement[];
    const navItems = Array.from(navRef.current!.querySelectorAll<HTMLElement>("button"));
    const introStart = performance.now();
    const isMobile = () => window.innerWidth < 768;

    /* --- Renderer & sahne --- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.4;

    const camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.05, 50);
    camera.position.set(0, 0, POSES[0].z);

    /* --- Işıklar: soldan üstten vuran ana ışık kanallarda gölge oluşturur --- */
    const key = new THREE.DirectionalLight(0xfff1e0, 3.4);
    key.position.set(-2.6, 1.1, 1.0);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048);
    key.shadow.camera.left = -0.9; key.shadow.camera.right = 0.9;
    key.shadow.camera.top = 0.9; key.shadow.camera.bottom = -0.9;
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 6;
    key.shadow.bias = -0.0003;
    key.shadow.normalBias = 0.004;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xfff6ec, 1.0); // arka kenar ışığı
    rim.position.set(2, 0.6, -1.5);
    scene.add(rim);

    const warm = new THREE.PointLight(0xc8864a, 3, 4, 2); // bakır dolgu ışığı
    warm.position.set(1.2, -0.8, 1.2);
    scene.add(warm);

    scene.add(new THREE.HemisphereLight(0xfff6ec, 0x8a7a68, 0.45));

    /* --- Paneller --- */
    const geos = new Map(MODELS.map((m) => [m.id, makeBoardGeometry(m)]));
    const mdfTex = makeMdfTexture();
    const capMat = new THREE.MeshStandardMaterial({ map: mdfTex, roughness: 0.95 });

    const canvasCache = new Map<string, HTMLCanvasElement>();
    const textureFor = (f: Finish, i: number) => {
      let c = canvasCache.get(f.id);
      if (!c) { c = makeFinishCanvas(f); canvasCache.set(f.id, c); }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      t.repeat.set(1 / 0.2, 1 / 1.4); // doku 20 cm × 140 cm alanı kaplar
      t.offset.set((i * 0.37) % 1, (i * 0.53) % 1);
      return t;
    };
    const roughnessFor = (f: Finish) => (f.type === "solid" ? 0.88 : f.type === "patina" ? 0.75 : 0.6);

    const panel = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.add(panel);
    scene.add(tilt);

    let curModel = MODELS[0];
    const boards = Array.from({ length: BOARDS }, (_, i) => {
      const f = curModel.finishes[0];
      const mat = new THREE.MeshStandardMaterial({ map: textureFor(f, i), roughness: roughnessFor(f) });
      const mesh = new THREE.Mesh(geos.get(curModel.id)!, [capMat, mat]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      panel.add(mesh);
      return { mesh, mat, baseX: boardX(curModel, i) };
    });

    /* --- Zemin gölgesi: panelin altında yumuşak temas gölgesi --- */
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext("2d")!;
    const sg = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    sg.addColorStop(0, "rgba(40,25,10,0.55)");
    sg.addColorStop(0.5, "rgba(40,25,10,0.2)");
    sg.addColorStop(1, "rgba(40,25,10,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false });
    const shadowGeo = new THREE.PlaneGeometry(1.4, 0.45);
    shadowGeo.rotateX(-Math.PI / 2);
    const contact = new THREE.Mesh(shadowGeo, shadowMat);
    scene.add(contact);

    /* --- Model / renk değişimi: paneller dalga halinde döner --- */
    let swap: { model: Model; finish: Finish; start: number; done: boolean[] } | null = null;
    applyRef.current = (m, f) => {
      swap = { model: m, finish: f, start: performance.now(), done: boards.map(() => false) };
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

    /* --- Animasyon döngüsü --- */
    const cur: Pose = { ...POSES[0] };
    let tmx = 0, tmy = 0;
    const clock = new THREE.Clock();
    const v = new THREE.Vector3();
    let raf = 0;

    const targetPose = (p: number): Pose => {
      const seg = p * (POSES.length - 1);
      const i = Math.min(POSES.length - 2, Math.floor(seg));
      const t = smooth(0.2, 0.8, seg - i); // bölüm ortasında panel durur, metin okunur
      const a = POSES[i], b = POSES[i + 1];
      const out = {} as Pose;
      (Object.keys(a) as (keyof Pose)[]).forEach((k) => (out[k] = a[k] + (b[k] - a[k]) * t));
      if (isMobile()) { out.x = 0; out.z += 1.4; out.y += 0.24; }
      return out;
    };

    const place = (el: HTMLDivElement | null, obj: THREE.Object3D, local: THREE.Vector3, opacity: number) => {
      if (!el) return;
      v.copy(local);
      obj.localToWorld(v);
      v.project(camera);
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * host.clientWidth}px, ${(-v.y * 0.5 + 0.5) * host.clientHeight}px)`;
      el.style.opacity = String(opacity);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      const k = 1 - Math.exp(-dt * 5);

      const tp = targetPose(progress);
      (Object.keys(cur) as (keyof Pose)[]).forEach((key) => (cur[key] += (tp[key] - cur[key]) * k));
      tmx += (mx - tmx) * k;
      tmy += (my - tmy) * k;

      tilt.position.set(cur.x, cur.y + Math.sin(time * 0.8) * 0.01, 0);
      tilt.rotation.set(cur.rx + tmy * 0.08, cur.ry + tmx * 0.14, 0);
      camera.position.z = cur.z;

      // ışık imleci takip eder — kanallardaki gölgeler canlı olarak değişir
      key.position.set(-2.6 + tmx * 1.6, 1.1 - tmy * 0.9, 1.0);

      // açılış: paneller sırayla aşağıdan yükselir
      const introT = (performance.now() - introStart) / 1000;
      const rise = (i: number) => 1 - Math.pow(1 - clamp((introT - 0.25 - i * 0.09) / 1.1), 3);

      contact.position.set(cur.x, cur.y - SHOW_L / 2 - 0.02, 0.02);
      contact.rotation.y = tilt.rotation.y;
      shadowMat.opacity = (1 - smooth(0.15, 0.45, Math.abs(cur.rx))) * (1 - cur.ex * 0.6) * rise(BOARDS - 1);

      // montaj: paneller kenarlarından ayrılır, sırayla öne çıkar
      const now = performance.now();
      boards.forEach((b, i) => {
        const st = easeInOut(clamp(cur.ex * 1.5 - (i / BOARDS) * 0.5));
        b.mesh.position.x = b.baseX + (i - (BOARDS - 1) / 2) * st * 0.06;
        b.mesh.position.y = (1 - rise(i)) * -1.6;
        b.mesh.position.z = st * (i % 2 ? 0.07 : 0.025);

        if (swap) {
          const t = clamp((now - swap.start - i * 70) / 650);
          b.mesh.rotation.y = easeInOut(t) * Math.PI * 2;
          if (t >= 0.5 && !swap.done[i]) {
            b.mesh.geometry = geos.get(swap.model.id)!;
            b.baseX = boardX(swap.model, i);
            b.mat.map?.dispose();
            b.mat.map = textureFor(swap.finish, i);
            b.mat.roughness = roughnessFor(swap.finish);
            b.mat.needsUpdate = true;
            swap.done[i] = true;
          }
          if (t >= 1 && i === BOARDS - 1) {
            boards.forEach((x) => (x.mesh.rotation.y = 0));
            curModel = swap.model;
            swap = null;
          }
        }
      });

      // 3D noktalara bağlı etiketler
      const seg = progress * (POSES.length - 1);
      const W = curModel.width / 1000;
      place(labelCoreRef.current, boards[2].mesh, new THREE.Vector3(0, SHOW_L / 2, 0), 1 - smooth(0.12, 0.4, Math.abs(seg - 2)));
      place(labelJointRef.current, boards[1].mesh, new THREE.Vector3(W / 2, 0.22, 0), smooth(0.55, 0.95, cur.ex));

      // bölüm metinleri
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
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      boards.forEach((b) => { b.mat.map?.dispose(); b.mat.dispose(); });
      geos.forEach((g) => g.dispose());
      mdfTex.dispose();
      shadowTex.dispose();
      shadowMat.dispose();
      shadowGeo.dispose();
      capMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  const choose = (m: Model, f: Finish) => {
    if (m.id === model.id && f.id === finish.id) return;
    setModel(m);
    setFinish(f);
    applyRef.current(m, f);
  };

  const goTo = (i: number) => {
    const top = scrollRef.current!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight, behavior: "smooth" });
  };

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
        <p className={styles.topMeta}>Medijapan · MDF Koleksiyon</p>
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

      <div ref={scrollRef} className={styles.scroll}>
        <div className={styles.sticky}>
          <div className={styles.glow} />
          <div ref={bgWordsRef} className={styles.bgWords} aria-hidden>
            <span>MDF</span><span>Doku</span><span>Profil</span><span>Montaj</span><span>{model.code}</span>
          </div>
          <div ref={canvasHostRef} className={styles.canvas} />
          <div ref={labelCoreRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>MDF gövde</b> · {T} mm</span>
          </div>
          <div ref={labelJointRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>Bindirmeli kenar</b> · görünmez birleşim</span>
          </div>
        </div>

        <div className={styles.sections}>
          <section className={`${styles.section} ${styles.left}`}>
            <p className={`${styles.kicker} ${styles.introFade}`}>Baudecor · MDF Duvar Paneli</p>
            <h1 className={`${styles.title} ${styles.introTitle}`}>
              <span><span>Duvarlara</span></span>
              <span><span><em>derinlik</em> katın</span></span>
            </h1>
            <p className={`${styles.text} ${styles.introFade}`}>Medijapan MDF duvar paneli. Aşağı kaydırın, yakından tanıyın.</p>
            <div className={`${styles.scrollHint} ${styles.introFade}`}><span />Kaydırın</div>
          </section>

          <section className={`${styles.section} ${styles.right}`}>
            <p className={styles.kicker}>01 — Doku</p>
            <h2 className={styles.title}>Işıkla <em>canlanan</em> yüzey</h2>
            <p className={styles.text}>Profilli yüzey ışığı yakalar; gün boyunca duvarınızda değişen bir gölge oyunu oluşur.</p>
            <p className={styles.hint}><span className={styles.hintIcon} />İmleci hareket ettirin — ışık sizi takip eder</p>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>02 — Profil · Model {model.code}</p>
            <h2 className={styles.title}>Sağlam <em>MDF</em> gövde</h2>
            <dl className={styles.specs}>
              <div><dt>Kalınlık</dt><dd>{T}<small>mm</small></dd></div>
              <div><dt>Genişlik</dt><dd>{model.width}<small>mm</small></dd></div>
              <div><dt>Uzunluk</dt><dd>2800<small>mm</small></dd></div>
            </dl>
            <p className={styles.pack}>Paket: 6 adet · {model.packKg} kg</p>
          </section>

          <section className={`${styles.section} ${styles.right}`}>
            <p className={styles.kicker}>03 — Montaj</p>
            <h2 className={styles.title}>Kolay <em>montaj</em></h2>
            <p className={styles.text}>Paneller kenarlarından birbirine bindirilerek geçer. Birleşim yerleri görünmez, montaj hızlı ve temiz olur.</p>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>04 — Model ve renk</p>
            <h2 className={styles.title}><em>{finish.name}</em></h2>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Model</p>
              <div className={styles.models}>
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    className={`${styles.modelBtn} ${m.id === model.id ? styles.modelActive : ""}`}
                    onClick={() => choose(m, m.finishes[0])}
                  >
                    {m.code}<small>{m.label}</small>
                  </button>
                ))}
              </div>
              <p className={styles.cardLabel}>Renk · {model.finishes.length} seçenek</p>
              <div className={styles.swatches}>
                {model.finishes.map((f) => (
                  <button
                    key={f.id}
                    className={`${styles.swatch} ${f.id === finish.id ? styles.swatchActive : ""}`}
                    style={{ background: f.base }}
                    onClick={() => choose(model, f)}
                    aria-label={f.name}
                    title={f.name}
                  />
                ))}
              </div>
              <div className={styles.ctas}>
                <a href="tel:+38268361700" className={styles.cta}>Bizi arayın</a>
                <Link href="/urunler/mdf-paneli" className={styles.ctaOutline}>Tüm MDF modeller</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
