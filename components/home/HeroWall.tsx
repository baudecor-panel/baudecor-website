"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import {
  woodTexture, feltTexture, grooveFace, mdfBoardGeometry, loadPatternTexture, contactShadowTexture, MDF_LIP,
} from "@/lib/panel3d";
import styles from "./Home.module.css";

/* Açılıştaki malzeme duvarı: dört ürün grubundan birer şerit */
export type WallItem = { name: string; href: string };

const H = 1.98;     // şerit yüksekliği (m) — 11 PENTA karosu
const GAP = 0.03;   // şeritler arası boşluk
const TILE = 0.18;  // PENTA karo ölçüsü
const PENTA_ROT = 2; // tepe noktası üst kenara yakın — ürün fotoğrafıyla aynı yön

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function HeroWall({ items }: { items: WallItem[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  const router = useRouter();
  const [hovered, setHovered] = useState(-1);

  useEffect(() => { itemsRef.current = items; }, [items]);

  useEffect(() => {
    const host = hostRef.current!;
    const section = host.parentElement!;
    const isMobile = () => window.innerWidth < 900;
    let disposed = false;

    /* --- Renderer & sahne --- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.4;

    const camera = new THREE.PerspectiveCamera(32, host.clientWidth / host.clientHeight, 0.05, 50);

    const key = new THREE.DirectionalLight(0xfff1e0, 3.0);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile() ? 1024 : 2048, isMobile() ? 1024 : 2048);
    Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 10 });
    key.shadow.bias = -0.0003;
    key.shadow.normalBias = 0.004;
    scene.add(key, key.target);
    scene.add(new THREE.HemisphereLight(0xfff6ec, 0x8a7a68, 0.45));
    const warm = new THREE.PointLight(0xc8864a, 2.5, 5, 2);
    warm.position.set(1.6, -1, 1.4);
    scene.add(warm);

    /* --- Duvar --- */
    const tilt = new THREE.Group();
    const wall = new THREE.Group();
    tilt.add(wall);
    scene.add(tilt);
    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

    type Strip = { group: THREE.Group; width: number; x: number; hover: number; meshes: THREE.Object3D[] };
    const strips: Strip[] = [];
    const addStrip = (width: number) => {
      const group = new THREE.Group();
      wall.add(group);
      const s: Strip = { group, width, x: 0, hover: 0, meshes: [] };
      strips.push(s);
      return s;
    };
    const shadowed = <T extends THREE.Mesh>(m: T, s: Strip) => {
      m.castShadow = m.receiveShadow = true;
      m.userData.strip = strips.indexOf(s);
      s.group.add(m);
      s.meshes.push(m);
      return m;
    };

    // 1 — PVC mermer levha
    {
      const W = 0.58;
      const s = addStrip(W);
      const edge = track(new THREE.MeshStandardMaterial({ color: "#e8e3db", roughness: 0.5 }));
      const marble = track(new THREE.MeshPhysicalMaterial({ color: "#f1eee9", roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 }));
      shadowed(new THREE.Mesh(track(new THREE.BoxGeometry(W, H, 0.004)), [edge, edge, edge, edge, marble, edge]), s);
      loadPatternTexture("/pvc-Carrara-Gold.jpeg", renderer.capabilities.getMaxAnisotropy()).then((t) => {
        if (disposed) { t.dispose(); return; }
        track(t);
        t.repeat.set(W / 1.22, H / 2.8);
        t.offset.set(0.12, 0.2);
        marble.map = t;
        marble.color.set("#ffffff");
        marble.needsUpdate = true;
      });
    }

    // 2 — MDF 18121 kanallı panel (5 adet, birbirine bindirilmiş)
    {
      const count = 5, wMm = 121, P = (wMm - MDF_LIP) / 1000;
      const W = count * P + MDF_LIP / 1000;
      const s = addStrip(W);
      const geo = track(mdfBoardGeometry(wMm, grooveFace(wMm - MDF_LIP), H));
      const cap = track(new THREE.MeshStandardMaterial({ color: "#a47b52", roughness: 0.95 }));
      const tex = track(woodTexture("#9a6a40", "#6b4423", "#b8875a"));
      tex.repeat.set(5, 1 / 1.4);
      for (let i = 0; i < count; i++) {
        const mat = track(new THREE.MeshStandardMaterial({ map: track(tex.clone()), roughness: 0.6 }));
        (mat.map as THREE.Texture).offset.set((i * 0.37) % 1, (i * 0.53) % 1);
        (mat.map as THREE.Texture).needsUpdate = true;
        const m = shadowed(new THREE.Mesh(geo, [cap, mat]), s);
        m.position.set(-W / 2 + i * P + wMm / 2000, 0, 0.009);
      }
    }

    // 3 — PENTA modüler panel (gerçek 3D model, karolar 90° döndürülerek dizilir)
    {
      const cols = 4, rows = 11;
      const s = addStrip(cols * TILE);
      const mat = track(new THREE.MeshStandardMaterial({ color: "#d2d0cb", roughness: 0.3, metalness: 0.5, flatShading: true }));
      const back = track(new THREE.MeshStandardMaterial({ color: "#2a2826", roughness: 0.9 }));
      shadowed(new THREE.Mesh(track(new THREE.BoxGeometry(cols * TILE, rows * TILE, 0.002)), back), s);
      new OBJLoader().load("/models/penta.obj", (obj) => {
        if (disposed) return;
        let src: THREE.BufferGeometry | null = null;
        obj.traverse((o) => { if (!src && o instanceof THREE.Mesh) src = o.geometry as THREE.BufferGeometry; });
        if (!src) return;
        // dosyada yan yana iki karo var (kabarık + çukur); yalnızca kabarık olanı al (x ≥ 55 cm)
        const full = (src as THREE.BufferGeometry).index ? (src as THREE.BufferGeometry).toNonIndexed() : (src as THREE.BufferGeometry);
        const pos = full.getAttribute("position");
        const keep: number[] = [];
        for (let i = 0; i < pos.count; i += 3) {
          if ((pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3 < 55) continue;
          for (let j = 0; j < 3; j++) keep.push(pos.getX(i + j), pos.getY(i + j), pos.getZ(i + j));
        }
        const geo = track(new THREE.BufferGeometry());
        geo.setAttribute("position", new THREE.Float32BufferAttribute(keep, 3));
        geo.computeVertexNormals();
        geo.scale(0.01, 0.01, 0.01);           // cm → m
        geo.rotateX(Math.PI / 2);              // kabartma kameraya baksın
        geo.computeBoundingBox();
        const bb = geo.boundingBox!;
        geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -bb.min.z);
        const inst = new THREE.InstancedMesh(geo, mat, cols * rows);
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), z = new THREE.Vector3(0, 0, 1), gapScale = new THREE.Vector3(0.985, 0.985, 1); // karolar arası derz
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          // ürün fotoğrafındaki gibi tüm karolar aynı yönde
          const quad = PENTA_ROT;
          q.setFromAxisAngle(z, quad * Math.PI / 2);
          m4.compose(new THREE.Vector3((c - (cols - 1) / 2) * TILE, (r - (rows - 1) / 2) * TILE, 0.001), q, gapScale);
          inst.setMatrixAt(r * cols + c, m4);
        }
        shadowed(inst as unknown as THREE.Mesh, s);
        disposables.push(inst);
      });
    }

    // 4 — Akustik panel: ses emici keçe üzerinde ahşap lameller
    {
      const W = 0.58, slatW = 0.027, slatGap = 0.013, count = Math.floor(W / (slatW + slatGap));
      const s = addStrip(W);
      const felt = track(new THREE.MeshStandardMaterial({ map: track(feltTexture()), roughness: 1 }));
      shadowed(new THREE.Mesh(track(new THREE.BoxGeometry(W, H, 0.009)), felt), s).position.z = 0.0045;
      const slatGeo = track(new THREE.BoxGeometry(slatW, H, 0.012));
      const tex = track(woodTexture("#5b3b25", "#3a2414", "#7a5236", 99));
      tex.repeat.set(0.35, 1);
      const total = count * slatW + (count - 1) * slatGap;
      for (let i = 0; i < count; i++) {
        const t = tex.clone();
        t.offset.set((i * 0.137) % 1, (i * 0.291) % 1);
        t.needsUpdate = true;
        const mat = track(new THREE.MeshStandardMaterial({ map: track(t), roughness: 0.6 }));
        const m = shadowed(new THREE.Mesh(slatGeo, mat), s);
        m.position.set(-total / 2 + slatW / 2 + i * (slatW + slatGap), 0, 0.009 + 0.006);
      }
    }

    // 5 — AdaWall duvar kağıdı (SEVEN 7811-3), alçı pano üzerine kaplı
    {
      const W = 0.58;
      const s = addStrip(W);
      const edge = track(new THREE.MeshStandardMaterial({ color: "#e9e4dc", roughness: 0.8 }));
      const paper = track(new THREE.MeshStandardMaterial({ color: "#d9d4cc", roughness: 0.75 }));
      shadowed(new THREE.Mesh(track(new THREE.BoxGeometry(W, H, 0.012)), [edge, edge, edge, edge, paper, edge]), s).position.z = 0.006;
      new THREE.TextureLoader().load("/duvar-kagidi/desen/7811-3.webp", (t) => {
        if (disposed) { t.dispose(); return; }
        track(t);
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const img = t.image as HTMLImageElement;
        t.repeat.set(W / 0.53, H / (0.53 * img.height / img.width));
        paper.map = t;
        paper.color.set("#ffffff");
        paper.needsUpdate = true;
      });
    }

    // şeritleri yan yana diz
    const totalW = strips.reduce((a, s) => a + s.width, 0) + GAP * (strips.length - 1);
    let cursor = -totalW / 2;
    strips.forEach((s) => { s.x = cursor + s.width / 2; cursor += s.width + GAP; });

    // temas gölgesi
    const shadowTex = track(contactShadowTexture());
    const shadowMat = track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false }));
    const shadowGeo = track(new THREE.PlaneGeometry(totalW * 1.5, 0.6));
    shadowGeo.rotateX(-Math.PI / 2);
    const contact = new THREE.Mesh(shadowGeo, shadowMat);
    scene.add(contact);

    /* --- Girdi --- */
    let mx = 0, my = 0, px = -9, py = -9;
    const onPointer = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      const r = host.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const onLeave = () => { px = py = -9; };
    const onResize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
    };
    let hoverIdx = -1;
    const onClick = () => { if (hoverIdx >= 0) router.push(itemsRef.current[hoverIdx].href); };
    window.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    // ekranda değilken çizimi durdur
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(host);

    /* --- Animasyon --- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const v = new THREE.Vector3();
    const clock = new THREE.Clock();
    const start = performance.now();
    let tmx = 0, tmy = 0, raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      const time = clock.elapsedTime;
      const k = 1 - Math.exp(-dt * 5);
      tmx += (mx - tmx) * k;
      tmy += (my - tmy) * k;

      const mobile = isMobile();
      const r = section.getBoundingClientRect();
      const scrollP = clamp(-r.top / r.height);

      camera.position.set(0, mobile ? 0.7 : 0.05, mobile ? 10.2 : 6.3);
      camera.lookAt(0, mobile ? 0.7 : 0, 0);

      tilt.position.set(mobile ? 0 : 1.1, (mobile ? 1.5 : 0) + Math.sin(time * 0.7) * 0.012 + scrollP * 0.5, 0);
      tilt.rotation.set(0.04 + tmy * 0.05, -0.42 + tmx * 0.12 + scrollP * 0.35, 0);

      key.position.set(-2.4 + tmx * 1.8, 1.6 - tmy * 1.0, 1.6);
      key.target.position.copy(tilt.position);

      // fareyle üzerine gelinen şerit
      let hit = -1;
      if (!mobile && px > -2) {
        ndc.set(px, py);
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects(strips.flatMap((s) => s.meshes), false);
        if (hits.length) hit = hits[0].object.userData.strip as number;
      }
      if (hit !== hoverIdx) {
        hoverIdx = hit;
        setHovered(hit);
        host.style.cursor = hit >= 0 ? "pointer" : "";
      }

      // açılış: şeritler sırayla yükselir
      const introT = (performance.now() - start) / 1000;
      strips.forEach((s, i) => {
        const rise = easeOut(clamp((introT - 0.3 - i * 0.14) / 1.2));
        s.hover += ((i === hoverIdx ? 1 : 0) - s.hover) * k * 1.6;
        s.group.position.set(s.x, (1 - rise) * -2.6, s.hover * 0.07);
      });

      contact.position.set(tilt.position.x, tilt.position.y - H / 2 - 0.03, 0.1);
      contact.rotation.y = tilt.rotation.y;
      shadowMat.opacity = easeOut(clamp((introT - 0.8) / 1.2));

      // etiket: seçili şeridin üstünde
      if (labelRef.current && hoverIdx >= 0) {
        const s = strips[hoverIdx];
        v.set(0, -H / 2 - 0.04, 0.05);
        s.group.localToWorld(v);
        v.project(camera);
        labelRef.current.style.transform = `translate(${(v.x * 0.5 + 0.5) * host.clientWidth}px, ${(-v.y * 0.5 + 0.5) * host.clientHeight}px) translate(-50%, 0)`;
      }

      renderer.render(scene, camera);
    };
    onResize();
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      disposables.forEach((d) => d.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [router]);

  return (
    <div ref={hostRef} className={styles.heroCanvas}>
      <div ref={labelRef} className={`${styles.wallLabel} ${hovered >= 0 ? styles.wallLabelOn : ""}`}>
        {hovered >= 0 && <>{items[hovered].name} <span>→</span></>}
      </div>
    </div>
  );
}
