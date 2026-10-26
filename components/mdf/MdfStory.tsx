"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { Lang } from "@/lib/i18n";
import { pick } from "@/lib/site";
import { CARD, MDF_MODELS, MDF_SIZE, mdfDefault, type MdfFinish, type MdfModel } from "@/lib/mdf";
import styles from "../PanelShowcase.module.css";
import mdf from "./MdfStory.module.css";

/* ===== Profil ölçüleri (mm) — ürün teknik çizimlerinden ===== */
const T = MDF_SIZE.thickness; // kalınlık
const LIP = 6;       // bindirme kenarı genişliği
const LIP_H = 6;     // bindirme kenarı yüksekliği
const SHOW_L = 1.2;  // sahnede gösterilen boy (m) — gerçek boy 2800 mm
const BOARDS = 7;    // yan yana panel sayısı
const INSTALL_N = 3;        // montajda sırayla yerine oturan panel sayısı
const INSTALL_CYCLE = 6.2;  // montaj döngüsü (sn)

/* Yüzey profili: soldan sağa, 0..P aralığında (P = genişlik − bindirme) */
function grooveFace(P: number): [number, number][] {
  const g = 10, depth = 9, rib = (P - 3 * g) / 3, c = 0.8; // c: kenar pahı
  const pts: [number, number][] = [];
  let x = 0;
  for (let i = 0; i < 3; i++) {
    const a = x, b = x + rib;
    pts.push([a, T - c], [a + c, T], [b - c, T], [b, T - c], [b, T - depth]);
    x = b + g;
    pts.push([x, T - depth]);
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

const FACES: Record<MdfModel["id"], (P: number) => [number, number][]> = {
  "18121": grooveFace,
  "18118Y": (P) => arcFace(P, 3, 7, false),
  "18118B": (P) => arcFace(P, 5, 9, true),
};

/* ===== Kaydırma senaryosu ===== */
type Pose = { ry: number; rx: number; x: number; y: number; ex: number; z: number };
const POSES: Pose[] = [
  { ry: -0.55, rx: 0.12, x: 0.5, y: 0, ex: 0, z: 2.75 },   // giriş
  { ry: 0.3, rx: 0.8, x: 0.3, y: -0.34, ex: 0, z: 1.8 },   // model — üst kesit
  { ry: 0.62, rx: 0.08, x: -0.42, y: 0, ex: 1, z: 2.6 },   // montaj — duvara yerleşen paneller
];

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

/* Düz ve patine yüzeyler için kodla üretilen doku */
function makeFinishCanvas(f: MdfFinish) {
  const W = 256, H = 2048;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const rnd = seeded(1234);
  ctx.fillStyle = f.color;
  ctx.fillRect(0, 0, W, H);
  if (f.kind === "solid") {
    // mat yüzey — çok hafif kumlama
    for (let i = 0; i < 6000; i++) {
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = rnd() > 0.5 ? "#000" : "#fff";
      ctx.fillRect(rnd() * W, rnd() * H, 1, 1);
    }
    ctx.globalAlpha = 1;
    return c;
  }
  // patine: boy yönünde ince, soluk damarlar
  const dark = f.dark ?? f.color;
  for (let i = 0; i < 140; i++) {
    const x0 = rnd() * W, amp = 2 + rnd() * 10, freq = 0.002 + rnd() * 0.004, phase = rnd() * Math.PI * 2;
    ctx.globalAlpha = 0.05 + rnd() * 0.18;
    ctx.strokeStyle = rnd() > 0.35 ? dark : "#ffffff";
    ctx.lineWidth = 0.5 + rnd() * 1.8;
    ctx.beginPath();
    for (let y = 0; y <= H; y += 16) {
      const x = x0 + Math.sin(y * freq + phase) * amp + Math.sin(y * freq * 3.1) * amp * 0.25;
      if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  return c;
}

/* Ahşap: ürün kartındaki gerçek panel fotoğrafından boy yönünde bir şerit */
function loadGrainCanvas(f: MdfFinish) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { x, y, w, h } = CARD.strip;
      const sx = img.naturalWidth / CARD.w, sy = img.naturalHeight / CARD.h;
      const c = document.createElement("canvas");
      c.width = w * 2; c.height = h * 2;
      c.getContext("2d")!.drawImage(img, x * sx, y * sy, w * sx, h * sy, 0, 0, c.width, c.height);
      resolve(c);
    };
    img.onerror = reject;
    img.src = f.card;
  });
}

/* Ham MDF kesit dokusu */
function makeMdfTexture() {
  // ürün fotoğraflarındaki kesit: açık kahve, çok ince ve yoğun lif
  const S = 256;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#c49a6c";
  ctx.fillRect(0, 0, S, S);
  const rnd = seeded(11);
  for (let i = 0; i < 9000; i++) {
    const d = rnd();
    ctx.fillStyle = d > 0.55 ? "rgba(120,80,45,0.22)" : d > 0.2 ? "rgba(225,190,145,0.22)" : "rgba(90,60,30,0.3)";
    ctx.fillRect(rnd() * S, rnd() * S, 1 + rnd() * 1.5, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(14, 14);
  return t;
}

/* Profil şeklinden panel geometrisi — boy yönü dikey, yüz kameraya bakar.
   Malzeme grupları: 0 kesit (MDF), 1 ön yüz, 2 kanal içi (bazı renklerde siyah) */
function makeBoardGeometry(m: MdfModel) {
  const W = m.width, P = W - LIP;
  const face = FACES[m.id](P);
  const pts: [number, number][] = [[0, 0], [P, 0], [P, LIP_H], [W, LIP_H]];
  for (let i = face.length - 1; i >= 0; i--) pts.push([face[i][0] + LIP, face[i][1]]);
  pts.push([LIP, LIP_H], [0, LIP_H]);
  const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2((x - W / 2) / 1000, (y - T / 2) / 1000)));
  const src = new THREE.ExtrudeGeometry(shape, { depth: SHOW_L, bevelEnabled: false, steps: 1 });

  // yan yüz üçgenlerini ayır: yüz seviyesindekiler "ön yüz", altındakiler "kanal"
  const pos = src.attributes.position, nor = src.attributes.normal, uv = src.attributes.uv;
  const top = (T / 2) / 1000, lip = (LIP_H - T / 2) / 1000;
  const buckets: number[][] = [[], [], []];
  const sideStart = src.groups[1].start, sideEnd = sideStart + src.groups[1].count;
  for (let v = 0; v < pos.count; v += 3) {
    let b = 0;
    if (v >= sideStart && v < sideEnd) {
      const cy = (pos.getY(v) + pos.getY(v + 1) + pos.getY(v + 2)) / 3;
      b = cy > top - 0.0005 ? 1 : cy > lip + 0.0005 ? 2 : cy < -top + 0.0005 ? 0 : 1;
    }
    buckets[b].push(v, v + 1, v + 2);
  }
  const geo = new THREE.BufferGeometry();
  const order = buckets.flat();
  const copy = (a: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, n: number) => {
    const out = new Float32Array(order.length * n);
    order.forEach((v, i) => { for (let k = 0; k < n; k++) out[i * n + k] = a.array[v * n + k]; });
    return new THREE.BufferAttribute(out, n);
  };
  geo.setAttribute("position", copy(pos, 3));
  geo.setAttribute("normal", copy(nor, 3));
  geo.setAttribute("uv", copy(uv, 2));
  let start = 0;
  buckets.forEach((b, i) => { geo.addGroup(start, b.length, i); start += b.length; });
  src.dispose();
  geo.translate(0, 0, -SHOW_L / 2);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/* Paneller birbirine bindiği için adım = genişlik − bindirme */
const boardX = (m: MdfModel, i: number) => {
  const P = (m.width - LIP) / 1000, total = BOARDS * P + LIP / 1000;
  return -total / 2 + i * P + m.width / 2000;
};

export default function MdfStory({ lang, model, finish, onChoose }: {
  lang: Lang; model: MdfModel; finish: MdfFinish; onChoose: (m: MdfModel, f: MdfFinish) => void;
}) {
  const L = pick(lang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const labelJointRef = useRef<HTMLDivElement>(null);
  const labelCoreRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bgWordsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const applyRef = useRef<(m: MdfModel, f: MdfFinish) => void>(() => {});

  useEffect(() => {
    const host = canvasHostRef.current!;
    const scrollEl = scrollRef.current!;
    const sections = Array.from(scrollEl.querySelectorAll<HTMLElement>("section"));
    const bgWords = Array.from(bgWordsRef.current!.children) as HTMLElement[];
    const navItems = Array.from(navRef.current!.querySelectorAll<HTMLElement>("button"));
    let introStart = Infinity; // paneller dokusu yüklenince yükselir
    let disposed = false;
    const isMobile = () => window.innerWidth < 768;

    /* --- Renderer & sahne --- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping; // renkleri ürün fotoğrafına yakın tutar
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.05, 50);
    camera.position.set(0, 0, POSES[0].z);

    /* --- Işıklar: soldan üstten vuran ana ışık kanallarda gölge oluşturur --- */
    const key = new THREE.DirectionalLight(0xfffaf4, 2.1);
    key.position.set(-2.6, 1.1, 1.0);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048);
    key.shadow.camera.left = -1.2; key.shadow.camera.right = 1.2;
    key.shadow.camera.top = 1.2; key.shadow.camera.bottom = -1.2;
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 6;
    key.shadow.bias = -0.0003;
    key.shadow.normalBias = 0.004;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xfff6ec, 1.0); // arka kenar ışığı
    rim.position.set(2, 0.6, -1.5);
    scene.add(rim);
    const warm = new THREE.PointLight(0xf3d9bd, 0.6, 4, 2); // hafif sıcak dolgu
    warm.position.set(1.2, -0.8, 1.2);
    scene.add(warm);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8ad9f, 0.55));

    /* --- Paneller --- */
    const geos = new Map(MDF_MODELS.map((m) => [m.id, makeBoardGeometry(m)]));
    const mdfTex = makeMdfTexture();
    const capMat = new THREE.MeshStandardMaterial({ map: mdfTex, roughness: 0.95 });

    // her renk için temel doku bir kez hazırlanır; her panel kendi kaydırmasıyla kopyasını kullanır
    const baseCache = new Map<string, Promise<HTMLCanvasElement>>();
    const baseFor = (f: MdfFinish) => {
      let p = baseCache.get(f.id);
      if (!p) {
        p = f.kind === "grain" ? loadGrainCanvas(f).catch(() => makeFinishCanvas({ ...f, kind: "solid" })) : Promise.resolve(makeFinishCanvas(f));
        baseCache.set(f.id, p);
      }
      return p;
    };
    const textureFor = (c: HTMLCanvasElement, f: MdfFinish, i: number) => {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      if (f.kind === "grain") {
        // şerit ≈ 25 mm × 210 mm gerçek yüzey (kart: ~2,1 px/mm); aynalayarak döşenir
        t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
        t.repeat.set(1 / 0.025, 1 / 0.21);
      } else {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(1 / 0.2, 1 / 1.4);
      }
      t.offset.set((i * 0.37) % 1, (i * 0.53) % 1);
      return t;
    };
    const roughnessFor = (f: MdfFinish) => (f.kind === "solid" ? 0.85 : f.kind === "patina" ? 0.75 : 0.62);

    const panel = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.add(panel);
    scene.add(tilt);

    // montaj sahnesinde arkada sıva duvar
    const wallMat = new THREE.MeshStandardMaterial({ color: "#fffaf3", roughness: 1, transparent: true, opacity: 0 });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), wallMat);
    wall.position.set(0, 0, -T / 2000 - 0.0008);
    wall.receiveShadow = true;
    wall.visible = false;
    panel.add(wall);

    let curModel = MDF_MODELS[0];
    const boards = Array.from({ length: BOARDS }, (_, i) => {
      const face = new THREE.MeshStandardMaterial({ color: "#d8cdbd", roughness: 0.7 });
      const groove = new THREE.MeshStandardMaterial({ color: "#d8cdbd", roughness: 0.7 });
      const mesh = new THREE.Mesh(geos.get(curModel.id)!, [capMat, face, groove]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.y = -1.6;
      panel.add(mesh);
      return { mesh, face, groove, baseX: boardX(curModel, i) };
    });

    // bir panele renk uygula: yüz dokusu + kanal (ayrı renkse düz, değilse aynı doku)
    const paint = (b: (typeof boards)[number], f: MdfFinish, c: HTMLCanvasElement, i: number) => {
      b.face.map?.dispose();
      b.face.map = textureFor(c, f, i);
      b.face.bumpMap = f.kind === "grain" ? b.face.map : null;
      b.face.bumpScale = 1.4;
      b.face.color.set("#ffffff");
      b.face.roughness = roughnessFor(f);
      b.face.needsUpdate = true;
      b.groove.map?.dispose();
      if (f.groove) {
        b.groove.map = null;
        b.groove.color.set(f.groove);
        b.groove.roughness = 0.9;
      } else {
        b.groove.map = textureFor(c, f, i + 3);
        b.groove.color.set("#ffffff");
        b.groove.roughness = roughnessFor(f);
      }
      b.groove.needsUpdate = true;
    };

    const first = mdfDefault().finish;
    baseFor(first).then((c) => {
      if (disposed) return;
      boards.forEach((b, i) => paint(b, first, c, i));
      introStart = performance.now();
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

    /* --- Model / renk değişimi: doku hazır olunca paneller dalga halinde döner --- */
    let swap: { model: MdfModel; finish: MdfFinish; canvas: HTMLCanvasElement; start: number; done: boolean[] } | null = null;
    let wanted = "";
    applyRef.current = (m, f) => {
      wanted = m.id + f.id;
      baseFor(f).then((c) => {
        if (disposed || wanted !== m.id + f.id) return;
        swap = { model: m, finish: f, canvas: c, start: performance.now(), done: boards.map(() => false) };
      });
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
    let installStart: number | null = null;
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
      shadowMat.opacity = (1 - smooth(0.15, 0.45, Math.abs(cur.rx))) * (1 - cur.ex) * rise(BOARDS - 1);

      // montaj: son üç panel sırayla önce duvara yaklaşır, sonra yandan kayıp bindirmeyle yerine oturur
      const now = performance.now();
      if (cur.ex > 0.6 && installStart === null) installStart = now;
      if (cur.ex < 0.3) installStart = null;
      const cyc = installStart === null ? -1 : ((now - installStart) / 1000) % INSTALL_CYCLE;
      const away = smooth(0.1, 0.6, cur.ex); // sahneye girerken paneller dışarı çıkar
      boards.forEach((b, i) => {
        const j = i - (BOARDS - INSTALL_N);
        let ox = 0, oz = 0;
        if (j >= 0) {
          // 0: duvardan uzakta, 1: yerinde
          let t = 0;
          if (cyc >= 0) {
            const tIn = clamp((cyc - j * 0.85) / 1.1);
            const tOut = clamp((cyc - (INSTALL_CYCLE - 0.9)) / 0.7);
            t = tIn * (1 - tOut);
          }
          const zIn = easeInOut(clamp(t / 0.55));
          const xIn = easeInOut(clamp((t - 0.35) / 0.65));
          ox = (1 - xIn) * 0.16 * away;
          oz = (1 - zIn) * 0.07 * away;
        }
        b.mesh.position.x = b.baseX + ox;
        b.mesh.position.y = (1 - rise(i)) * -1.6;
        b.mesh.position.z = oz;

        if (swap) {
          const t = clamp((now - swap.start - i * 70) / 650);
          b.mesh.rotation.y = easeInOut(t) * Math.PI * 2;
          if (t >= 0.5 && !swap.done[i]) {
            b.mesh.geometry = geos.get(swap.model.id)!;
            b.baseX = boardX(swap.model, i);
            paint(b, swap.finish, swap.canvas, i);
            swap.done[i] = true;
          }
          if (t >= 1 && i === BOARDS - 1) {
            boards.forEach((x) => (x.mesh.rotation.y = 0));
            curModel = swap.model;
            swap = null;
          }
        }
      });
      wall.visible = cur.ex > 0.01;
      wallMat.opacity = smooth(0.2, 0.9, cur.ex);
      wallMat.transparent = wallMat.opacity < 0.99; // tam görünürken gölgeleri net alır

      // 3D noktalara bağlı etiketler
      const seg = progress * (POSES.length - 1);
      const W = curModel.width / 1000;
      place(labelCoreRef.current, boards[2].mesh, new THREE.Vector3(0, SHOW_L / 2, 0), 1 - smooth(0.12, 0.4, Math.abs(seg - 1)));
      place(labelJointRef.current, boards[BOARDS - INSTALL_N].mesh, new THREE.Vector3(-W / 2 + 0.004, 0.25, 0), smooth(0.55, 0.95, cur.ex));

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
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      boards.forEach((b) => { b.face.map?.dispose(); b.face.dispose(); b.groove.map?.dispose(); b.groove.dispose(); });
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

  // sayfadaki seçim değişince sahne de değişir (galeriden "3D'de dene" dahil)
  const shown = useRef(`${mdfDefault().model.id}/${mdfDefault().finish.id}`);
  useEffect(() => {
    const key = `${model.id}/${finish.id}`;
    if (key === shown.current) return;
    shown.current = key;
    applyRef.current(model, finish);
  }, [model, finish]);

  const nav = [L("Uvod", "Giriş", "Intro"), L("Model", "Model", "Model"), L("Montaža", "Montaj", "Fitting")];
  const goTo = (i: number) => {
    const top = scrollRef.current!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <div ref={scrollRef} className={styles.scroll} style={{ height: `${POSES.length * 100}vh` }}>
        <div className={styles.sticky}>
          <div className={styles.glow} />
          <nav ref={navRef} className={`${styles.sideNav} ${mdf.sideNav}`} aria-label={L("Poglavlja", "Bölümler", "Chapters")}>
            <div className={styles.progressTrack}><div ref={progressRef} className={styles.progressBar} /></div>
            {nav.map((n, i) => (
              <button key={i} onClick={() => goTo(i)}>
                <span className={styles.navLabel}>{n}</span>
                <span className={styles.navNum}>0{i + 1}</span>
              </button>
            ))}
          </nav>
          <div ref={bgWordsRef} className={styles.bgWords} aria-hidden>
            <span>MDF</span><span>{model.id}</span><span>{L("Montaža", "Montaj", "Fitting")}</span>
          </div>
          <div ref={canvasHostRef} className={styles.canvas} />
          <div ref={labelCoreRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>{L("MDF jezgro", "MDF gövde", "MDF core")}</b> · {T} mm</span>
          </div>
          <div ref={labelJointRef} className={styles.label}>
            <span className={styles.labelDot} />
            <span><b>{L("Preklopna ivica", "Bindirmeli kenar", "Overlapping edge")}</b> · {L("nevidljiv spoj", "görünmez birleşim", "invisible joint")}</span>
          </div>
        </div>

        <div className={styles.sections}>
          <section className={`${styles.section} ${styles.left}`}>
            <p className={`${styles.kicker} ${styles.introFade}`}>{L("MDF zidni paneli", "MDF duvar panelleri", "MDF wall panels")}</p>
            <h1 className={`${styles.title} ${styles.introTitle}`}>
              {lang === "me" ? <><span><span>Dodajte zidu</span></span><span><span><em>dubinu</em></span></span></>
                : lang === "tr" ? <><span><span>Duvarlara</span></span><span><span><em>derinlik</em> katın</span></span></>
                : <><span><span>Give your walls</span></span><span><span><em>depth</em></span></span></>}
            </h1>
            <p className={`${styles.text} ${styles.introFade}`}>{L("Medijapan zidni paneli sa toplinom drveta. Skrolujte i upoznajte ih izbliza.", "Ahşabın sıcaklığını taşıyan medijapan duvar panelleri. Aşağı kaydırın, yakından tanıyın.", "MDF wall panels with the warmth of wood. Scroll down to see them up close.")}</p>
            <div className={`${styles.scrollHint} ${styles.introFade}`}><span />{L("Skrolujte", "Kaydırın", "Scroll")}</div>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>01 — {L("Model i profil", "Model ve profil", "Model and profile")}</p>
            <h2 className={styles.title}>{L("Čvrsto", "Sağlam", "A solid")} <em>MDF</em> {L("jezgro", "gövde", "core")}</h2>
            <div className={mdf.models}>
              {MDF_MODELS.map((m) => (
                <button key={m.id} className={`${mdf.modelBtn} ${m.id === model.id ? mdf.modelActive : ""}`} onClick={() => onChoose(m, m.finishes[0])}>
                  <b>{m.id}</b><small>{m.name[lang]} · {m.width} mm</small>
                </button>
              ))}
            </div>
            <dl className={styles.specs}>
              <div><dt>{L("Debljina", "Kalınlık", "Thickness")}</dt><dd>{T}<small>mm</small></dd></div>
              <div><dt>{L("Širina", "Genişlik", "Width")}</dt><dd>{model.width}<small>mm</small></dd></div>
              <div><dt>{L("Dužina", "Uzunluk", "Length")}</dt><dd>{MDF_SIZE.length}<small>mm</small></dd></div>
            </dl>
            <p className={styles.pack}>{L("Paket", "Paket", "Pack")}: {MDF_SIZE.perPack} {L("kom", "adet", "pcs")} · {model.packKg} kg</p>
          </section>

          <section className={`${styles.section} ${styles.right} ${mdf.roomy}`}>
            <p className={styles.kicker}>02 — {L("Montaža", "Montaj", "Fitting")}</p>
            <h2 className={styles.title}>{L("Laka", "Kolay", "Easy")} <em>{L("montaža", "montaj", "fitting")}</em></h2>
            <p className={styles.text}>{L("Svaki panel se postavlja na zid i preklopnom ivicom naliježe na prethodni. Spojevi se ne vide, a montaža je brza i čista.", "Her panel duvara yerleştirilir ve bindirmeli kenarıyla bir öncekinin üzerine oturur. Birleşim yerleri görünmez, montaj hızlı ve temiz olur.", "Each panel goes onto the wall and its overlapping edge sits over the previous one. The joints disappear and fitting is quick and clean.")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
