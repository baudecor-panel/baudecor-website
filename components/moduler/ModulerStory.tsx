"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { Lang } from "@/lib/i18n";
import { pick } from "@/lib/site";
import { MOD_COLORS, MOD_MODELS, tilesPerM2, type ColorId, type ModModel } from "@/lib/moduler";
import { loadModulerGeometry } from "@/lib/modulerModel";
import styles from "../PanelShowcase.module.css";
import st from "./ModulerStory.module.css";

/* ===== Duvar alanı (m) ===== */
const WALL_W = 1.9;
const WALL_H = 1.25;

/* ===== Kaydırma senaryosu ===== */
type Pose = { cx: number; cy: number; cz: number; tx: number; ty: number; light: number };
const POSES: Pose[] = [
  { cx: 0.45, cy: 0.18, cz: 2.35, tx: -0.42, ty: 0, light: 0 },   // giriş
  { cx: -0.15, cy: 0.08, cz: 2.3, tx: -0.62, ty: 0, light: 0 },  // model
  { cx: 0.85, cy: 0.2, cz: 2.35, tx: 0.72, ty: 0, light: 1 },     // renk ve ışık
];

/* ===== Yardımcılar ===== */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7);

/* Dosyada yan yana duran karoları x'e göre ayırır ve her birini kendi merkezine taşır */
function splitTiles(g: THREE.BufferGeometry, n: number) {
  const pos = g.attributes.position, nor = g.attributes.normal;
  const bb = g.boundingBox!;
  const w = (bb.max.x - bb.min.x) / n;
  const parts: { p: number[]; q: number[] }[] = Array.from({ length: n }, () => ({ p: [], q: [] }));
  for (let v = 0; v < pos.count; v += 3) {
    const cx = (pos.getX(v) + pos.getX(v + 1) + pos.getX(v + 2)) / 3;
    const k = Math.min(n - 1, Math.max(0, Math.floor((cx - bb.min.x) / w)));
    for (let j = 0; j < 3; j++) {
      parts[k].p.push(pos.getX(v + j), pos.getY(v + j), pos.getZ(v + j));
      parts[k].q.push(nor.getX(v + j), nor.getY(v + j), nor.getZ(v + j));
    }
  }
  return parts.map(({ p, q }) => {
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(q, 3));
    out.computeBoundingBox();
    const b = out.boundingBox!;
    out.translate(-(b.min.x + b.max.x) / 2, -(b.min.y + b.max.y) / 2, 0);
    return out;
  });
}

/* Modelin karo geometrileri (ayrılmış ve seçilmiş) */
const variantCache = new Map<string, Promise<THREE.BufferGeometry[]>>();
function variantsFor(m: ModModel) {
  let p = variantCache.get(m.id);
  if (!p) {
    p = loadModulerGeometry(m.file).then((g) => (m.split ? splitTiles(g, m.split.n).filter((_, i) => m.split!.use.includes(i)) : [g]));
    variantCache.set(m.id, p);
  }
  return p;
}

/* Duvar dizilimi: karo merkezleri, dönüşleri ve karo çeşidi */
type Tile = { x: number; y: number; rot: number; v: number };
function layout(m: ModModel, nVariants: number): Tile[] {
  const rnd = seeded(hash(m.id));
  const tiles: Tile[] = [];
  const l = m.lattice;
  const add = (x: number, y: number, rot: number) => {
    if (Math.abs(x) <= WALL_W / 2 && Math.abs(y) <= WALL_H / 2) tiles.push({ x, y, rot, v: Math.floor(rnd() * nVariants) });
  };
  if (l.kind === "square") {
    const n = Math.ceil(WALL_W / l.s) + 2, k = Math.ceil(WALL_H / l.s) + 2;
    for (let r = -k; r <= k; r++) for (let c = -n; c <= n; c++) {
      const rot = l.rot === "diamond" ? [[0, 1], [3, 2]][r & 1][c & 1] * (Math.PI / 2) : Math.floor(rnd() * 4) * (Math.PI / 2);
      add(c * l.s, r * l.s, rot);
    }
  } else if (l.kind === "weave") {
    const n = Math.ceil(WALL_W / l.sx) + 2, k = Math.ceil(WALL_H / l.sy) + 2;
    for (let c = -n; c <= n; c++) for (let r = -k; r <= k; r++) add(c * l.sx, r * l.sy + (c & 1 ? l.sy / 2 : 0), 0);
  } else if (l.kind === "hex") {
    const dx = l.p + l.q, dy = 2 * l.h;
    const n = Math.ceil(WALL_W / dx) + 2, k = Math.ceil(WALL_H / dy) + 2;
    for (let i = -n; i <= n; i++) for (let j = -k; j <= k; j++) {
      const rot = l.rot === 60 ? Math.floor(rnd() * 6) * (Math.PI / 3) : rnd() < 0.5 ? 0 : Math.PI;
      add(i * dx, j * dy + (i & 1 ? l.h : 0), rot);
    }
  } else {
    // üçgen: yukarı bakan karolar ızgarada, aşağı bakanlar yarım kenar kaymış ve 180° dönük
    const n = Math.ceil(WALL_W / l.s) + 2, k = Math.ceil(WALL_H / l.h) + 2;
    for (let j = -k; j <= k; j++) for (let i = -n; i <= n; i++) {
      const x = i * l.s + (j & 1 ? l.s / 2 : 0);
      add(x, j * l.h, 0);
      add(x + l.s / 2, j * l.h, Math.PI);
    }
  }
  return tiles;
}

export default function ModulerStory({ lang, model, onModel, color, onColor }: {
  lang: Lang; model: ModModel; onModel: (m: ModModel) => void; color: ColorId; onColor: (c: ColorId) => void;
}) {
  const L = pick(lang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bgWordsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const modelRef = useRef<(m: ModModel) => void>(() => {});
  const colorRef = useRef<(c: ColorId) => void>(() => {});

  useEffect(() => {
    const host = canvasHostRef.current!;
    const scrollEl = scrollRef.current!;
    const sections = Array.from(scrollEl.querySelectorAll<HTMLElement>("section"));
    const bgWords = Array.from(bgWordsRef.current!.children) as HTMLElement[];
    const navItems = Array.from(navRef.current!.querySelectorAll<HTMLElement>("button"));
    const isMobile = () => window.innerWidth < 768;
    let disposed = false;

    /* --- Renderer & sahne --- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.5;

    const camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.02, 30);

    /* --- Işık: duvarı yandan yalayan ana ışık kabartmayı gölgelerle ortaya çıkarır --- */
    const key = new THREE.DirectionalLight(0xfffaf2, 2.6);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048);
    Object.assign(key.shadow.camera, { left: -1.3, right: 1.3, top: 1.3, bottom: -1.3, near: 0.5, far: 8 });
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.01;
    scene.add(key, key.target);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb6aa9a, 0.45));

    /* --- Duvar --- */
    const wallMat = new THREE.MeshStandardMaterial({ color: "#e4ddd2", roughness: 0.95 });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(WALL_W + 5, WALL_H + 4), wallMat);
    wall.receiveShadow = true;
    scene.add(wall);

    /* --- Karo malzemesi: renk seçimi yumuşak geçişle uygulanır --- */
    const c0 = MOD_COLORS[color];
    const tileMat = new THREE.MeshStandardMaterial({ color: c0.swatch, roughness: c0.rough, metalness: c0.metal, side: THREE.DoubleSide });
    const target = { color: new THREE.Color(c0.swatch), rough: c0.rough, metal: c0.metal };
    colorRef.current = (c) => {
      const d = MOD_COLORS[c];
      target.color.set(d.swatch);
      target.rough = d.rough;
      target.metal = d.metal;
    };

    /* --- Karo setleri: model değişince eskisi dönerek çıkar, yenisi dalga halinde gelir --- */
    type TileRef = { mesh: THREE.InstancedMesh; i: number; t: Tile; delay: number };
    type TileSet = { id: string; meshes: THREE.InstancedMesh[]; tiles: TileRef[]; start: number };
    let current: TileSet | null = null;
    let leaving: TileSet | null = null;
    let wanted = "";
    const build = (m: ModModel, geos: THREE.BufferGeometry[]): TileSet => {
      const tiles = layout(m, geos.length);
      const rnd = seeded(hash(m.id) + 99);
      const meshes = geos.map((g, v) => {
        const count = tiles.filter((t) => t.v === v).length;
        const mesh = new THREE.InstancedMesh(g, tileMat, Math.max(1, count));
        mesh.count = count;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        scene.add(mesh);
        return mesh;
      });
      const used = meshes.map(() => 0);
      const refs = tiles.map((t) => ({ mesh: meshes[t.v], i: used[t.v]++, t, delay: ((t.x + WALL_W / 2) / WALL_W) * 700 + rnd() * 160 }));
      return { id: m.id, meshes, tiles: refs, start: performance.now() };
    };
    const show = (m: ModModel) => {
      wanted = m.id;
      variantsFor(m).then((geos) => {
        if (disposed || wanted !== m.id || current?.id === m.id) return;
        if (leaving) leaving.meshes.forEach((x) => scene.remove(x));
        leaving = current;
        if (leaving) leaving.start = performance.now();
        current = build(m, geos);
        current.start = performance.now() + (leaving ? 380 : 150);
      });
    };
    modelRef.current = show;
    show(model);

    const mtx = new THREE.Matrix4(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
    const vp = new THREE.Vector3(), vs = new THREE.Vector3();
    const Z = new THREE.Vector3(0, 0, 1), Y = new THREE.Vector3(0, 1, 0);
    // bir karonun matrisini yaz: s ölçek, flip y ekseninde dönüş, lift öne çıkış
    const place = (r: TileRef, s: number, flip: number, lift: number) => {
      qa.setFromAxisAngle(Z, r.t.rot);
      qb.setFromAxisAngle(Y, flip);
      qa.premultiply(qb);
      vp.set(r.t.x, r.t.y, 0.0006 + lift);
      vs.setScalar(Math.max(0.0001, s));
      r.mesh.setMatrixAt(r.i, mtx.compose(vp, qa, vs));
    };
    const animateSets = (now: number) => {
      if (current) {
        let done = true;
        for (const r of current.tiles) {
          const t = clamp((now - current.start - r.delay) / 650);
          if (t < 1) done = false;
          const e = easeOut(t);
          place(r, e, (1 - e) * -Math.PI / 2, (1 - e) * 0.05);
        }
        current.meshes.forEach((x) => (x.instanceMatrix.needsUpdate = true));
        if (done) current.start = -1e9; // yerleşti — her karede yeniden hesaplanır ama değişmez
      }
      if (leaving) {
        let done = true;
        for (const r of leaving.tiles) {
          const t = clamp((now - leaving.start - r.delay * 0.6) / 450);
          if (t < 1) done = false;
          const e = easeIn(t);
          place(r, 1 - e, e * Math.PI / 2, e * 0.05);
        }
        leaving.meshes.forEach((x) => (x.instanceMatrix.needsUpdate = true));
        if (done) { leaving.meshes.forEach((x) => { scene.remove(x); x.dispose(); }); leaving = null; }
      }
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
      if (isMobile()) { out.cx -= out.tx; out.tx = 0; out.cz += 1.3; out.ty -= 0.18; out.cy -= 0.1; }
      return out;
    };
    const cur: Pose = targetPose(progress);
    let tmx = 0, tmy = 0;
    const clock = new THREE.Clock();
    let raf = 0;

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
      camera.position.set(cur.cx + tmx * 0.06, cur.cy - tmy * 0.04, cur.cz);
      camera.lookAt(cur.tx, cur.ty, 0);

      // ışık imleci takip eder; renk sahnesinde duvarın üzerinde yavaşça gezinir
      const sweep = Math.sin(time * 0.45) * 1.3 * cur.light;
      key.position.set(-1.7 + tmx * 0.9 + sweep, 1.35 - tmy * 0.6, 1.25);
      key.target.position.set(0, 0, 0);

      // renk geçişi
      tileMat.color.lerp(target.color, k);
      tileMat.roughness += (target.rough - tileMat.roughness) * k;
      tileMat.metalness += (target.metal - tileMat.metalness) * k;

      animateSets(now);

      // bölüm metinleri, arka plan yazıları, menü
      const seg = progress * (POSES.length - 1);
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
      [current, leaving].forEach((s) => s?.meshes.forEach((x) => x.dispose()));
      wall.geometry.dispose();
      wallMat.dispose();
      tileMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
    // model ve renk ilk değerleri sahne kurulurken kullanılır; sonraki değişiklikler aşağıdaki efektlerle gelir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { modelRef.current(model); }, [model]);
  useEffect(() => { colorRef.current(color); }, [color]);

  const nav = [L("Uvod", "Giriş", "Intro"), L("Modeli", "Modeller", "Models"), L("Boja i svjetlo", "Renk ve ışık", "Colour & light")];
  const goTo = (i: number) => {
    const top = scrollRef.current!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight, behavior: "smooth" });
  };
  const has = (c: ColorId) => model.colors.some((x) => x.id === c);

  return (
    <div className={styles.page}>
      <div ref={scrollRef} className={styles.scroll} style={{ height: `${POSES.length * 100}vh` }}>
        <div className={styles.sticky}>
          <div className={styles.glow} />
          <nav ref={navRef} className={`${styles.sideNav} ${st.sideNav}`} aria-label={L("Poglavlja", "Bölümler", "Chapters")}>
            <div className={styles.progressTrack}><div ref={progressRef} className={styles.progressBar} /></div>
            {nav.map((n, i) => (
              <button key={i} onClick={() => goTo(i)}>
                <span className={styles.navLabel}>{n}</span>
                <span className={styles.navNum}>0{i + 1}</span>
              </button>
            ))}
          </nav>
          <div ref={bgWordsRef} className={styles.bgWords} aria-hidden>
            <span>3D</span><span>{model.name}</span><span>{L("Svjetlo", "Işık", "Light")}</span>
          </div>
          <div ref={canvasHostRef} className={styles.canvas} />
        </div>

        <div className={styles.sections}>
          <section className={`${styles.section} ${styles.left}`}>
            <p className={`${styles.kicker} ${styles.introFade}`}>{L("Modularni 3D zidni paneli", "Modüler 3D duvar panelleri", "Modular 3D wall panels")}</p>
            <h1 className={`${styles.title} ${styles.introTitle}`}>
              {lang === "me" ? <><span><span>Zid u</span></span><span><span><em>tri dimenzije</em></span></span></>
                : lang === "tr" ? <><span><span>Duvarda</span></span><span><span><em>üçüncü boyut</em></span></span></>
                : <><span><span>A wall in</span></span><span><span><em>three dimensions</em></span></span></>}
            </h1>
            <p className={`${styles.text} ${styles.introFade}`}>{L("Reljefni paneli od laganog ABS polimera. Svaki komad je pravi 3D model — skrolujte i pogledajte.", "Hafif ABS polimerden rölyefli paneller. Her parça gerçek bir 3D model — aşağı kaydırın, görün.", "Relief panels in lightweight ABS polymer. Every piece is a real 3D model — scroll down and see.")}</p>
            <div className={`${styles.scrollHint} ${styles.introFade}`}><span />{L("Skrolujte", "Kaydırın", "Scroll")}</div>
          </section>

          <section className={`${styles.section} ${styles.left}`}>
            <p className={styles.kicker}>01 — {L("Modeli", "Modeller", "Models")} · {MOD_MODELS.length}</p>
            <h2 className={styles.title}><em>{model.name}</em></h2>
            <div className={st.models}>
              {MOD_MODELS.map((m) => (
                <button key={m.id} className={`${st.modelBtn} ${m.id === model.id ? st.modelActive : ""}`} onClick={() => onModel(m)}>
                  <b>{m.name}</b><small>{m.shape[lang]}</small>
                </button>
              ))}
            </div>
            <dl className={styles.specs}>
              <div><dt>{L("Komad", "Karo", "Tile")}</dt><dd className={st.dd}>{model.size}</dd></div>
              <div><dt>{L("Dubina", "Derinlik", "Depth")}</dt><dd className={st.dd}>{model.depth}</dd></div>
              <div><dt>{L("Po m²", "m² başına", "Per m²")}</dt><dd className={st.dd}>≈ {Math.round(tilesPerM2(model.lattice))}</dd></div>
            </dl>
          </section>

          <section className={`${styles.section} ${styles.right} ${st.roomy}`}>
            <p className={styles.kicker}>02 — {L("Boja i svjetlo", "Renk ve ışık", "Colour and light")}</p>
            <h2 className={styles.title}>{lang === "me" ? <>Igra <em>svjetla i sjenke</em></> : lang === "tr" ? <>Işık ve <em>gölge oyunu</em></> : <>A play of <em>light and shadow</em></>}</h2>
            <p className={styles.text}>{L("Kako se svjetlo mijenja tokom dana, reljef stvara uvijek novu sliku na zidu.", "Gün boyunca ışık değiştikçe rölyef duvarda her an yeni bir görüntü oluşturur.", "As the light shifts through the day, the relief paints a new picture on the wall.")}</p>
            <div className={st.colors}>
              {(Object.keys(MOD_COLORS) as ColorId[]).map((c) => (
                <button key={c} disabled={!has(c)} className={`${st.colorBtn} ${c === color ? st.colorActive : ""}`} onClick={() => onColor(c)}
                  title={has(c) ? MOD_COLORS[c].name[lang] : L("Nije dostupno za ovaj model", "Bu modelde yok", "Not available for this model")}>
                  <span style={{ background: MOD_COLORS[c].swatch }} />{MOD_COLORS[c].name[lang]}
                </button>
              ))}
            </div>
            <p className={st.ral}>{L("Po narudžbi i u svim RAL bojama", "Sipariş üzerine tüm RAL renklerinde", "All RAL colours available to order")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
