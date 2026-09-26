"use client";

// AI5K BrainHero — isolated brain geometry rendered as a luminous teal
// particle cloud with thin connecting lines.
//
// Visual contract (DO NOT change without product approval):
//   - Isolated human brain (no skull, no head, no neck).
//   - Dark premium environment (#0a0a0a base).
//   - Restrained teal/green palette (#0d473f / #15846E / #22d3ee / #6ee7b7).
//   - Tiny nodes + thin lines, very thin.
//   - Cursor near the brain subtly distorts nearby nodes (no full rotation).
//   - On scroll, lines fade first, then particles loosen into atmospheric dust.
//
// This component loads brain.glb once and reuses it. It is client-only.

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const DRACO_DECODER = "https://www.gstatic.com/draco/v1/decoders/";

function makeParticleTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0.0, "rgba(255,255,255,1.0)");
    g.addColorStop(0.30, "rgba(16,185,129,0.85)");
    g.addColorStop(0.65, "rgba(13,148,136,0.35)");
    g.addColorStop(1.0, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

interface TriFace {
  a: THREE.Vector3;
  b: THREE.Vector3;
  c: THREE.Vector3;
  area: number;
  normal: THREE.Vector3;
}

export default function BrainHero({
  scrollProgress = 0,
  offsetX,
}: {
  scrollProgress?: number;
  /**
   * World-space X offset for the brain group.
   * - undefined (default): mobile = 0, desktop = 4.4
   * - number: explicit value used on desktop; mobile still clamped to 0
   * The component smoothly tweens position.x toward this target each frame.
   */
  offsetX?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mirror of the Three.js animation state, exposed so prop changes can update
  // the brain group's target X each frame without restarting the scene.
  const sceneStateRef = useRef<{ targetOffsetX: number | null } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Keep the scene's target X in sync with the offsetX prop.
  useEffect(() => {
    if (!sceneStateRef.current) return;
    sceneStateRef.current.targetOffsetX = typeof offsetX === "number" ? offsetX : null;
  }, [offsetX]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a0a");

    const isMobile = window.innerWidth < 768;

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    // Camera stays centered (looks at origin). The brain group is shifted
    // right by 4.4 in world space, so the brain renders in the right half of
    // the canvas while the left half stays empty (where the copy sits).
    camera.position.set(0, 0, 11.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0x0d473f, 3.2));
    const key = new THREE.DirectionalLight(0x10b981, 5.5);
    key.position.set(6, 7, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x38bdf8, 4.0);
    fill.position.set(-6, -4, 5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x6ee7b7, 3.8);
    rim.position.set(0, 8, 3);
    scene.add(rim);

    // Mutable state (declared before any consumer so order-of-init is safe).
    const stateRef = {
      mouseNDC: new THREE.Vector2(-10, -10),
      cursor: new THREE.Vector3(0, 0, 0),
      cursorActive: false,
      cursorIntensity: 0,
      scroll: 0,
      // World-space X offset for the brain group (animated toward by the loop).
      // If the consumer passed offsetX, prefer that; otherwise use the default
      // per-viewport placement.
      targetOffsetX: isMobile ? 0 : (typeof offsetX === "number" ? offsetX : 4.4),
    };
    // Expose the state to the parent so prop changes can mutate targetOffsetX
    // without restarting the scene.
    sceneStateRef.current = stateRef as unknown as { targetOffsetX: number | null };

    const brainGroup = new THREE.Group();
    brainGroup.rotation.set(0, -Math.PI / 2 + 0.3, 0);
    // Anchored to the right on desktop, centered on mobile (small viewports).
    brainGroup.position.set(stateRef.targetOffsetX, -0.15, 0);
    scene.add(brainGroup);

    const raycaster = new THREE.Raycaster();

    const draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_DECODER);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    // Mutable state that is filled once the GLB loads.
    let brainMesh: THREE.Mesh | null = null;
    let pointsObj: THREE.Points | null = null;
    let linesObj: THREE.LineSegments | null = null;
    let posAttr: THREE.BufferAttribute | null = null;
    let colAttr: THREE.BufferAttribute | null = null;
    let pointsMat: THREE.PointsMaterial | null = null;
    let linesMat: THREE.LineBasicMaterial | null = null;

    let restPos: Float32Array = new Float32Array(0);
    let activePos: Float32Array = new Float32Array(0);
    let vel: Float32Array = new Float32Array(0);
    let restCol: Float32Array = new Float32Array(0);
    let activeCol: Float32Array = new Float32Array(0);
    let pulseOff: Float32Array = new Float32Array(0);
    let pulseSpd: Float32Array = new Float32Array(0);
    let dispersed: Float32Array = new Float32Array(0);
    let particleCount = 0;

    loader.load(
      "/brain.glb",
      (gltf) => {
        const modelScene = gltf.scene;
        modelScene.updateMatrixWorld(true);

        const INCLUDE = [
          "gyrus",
          "sulcus",
          "cuneus",
          "lobule",
          "pole",
          "insula",
          "cerebellum",
          "vermis",
          "declive",
          "culmen",
          "flocculus",
          "pons",
          "medulla",
          "midbrain",
          "olive",
          "pyramid",
        ];
        const EXCLUDE = [
          "artery",
          "vein",
          "vessel",
          "nerve",
          "tract",
          "fasciculus",
          "radiation",
          "commissure",
          "ventricle",
          "nucleus",
          "ganglia",
          "matter",
          "peduncle",
          "chiasm",
          "thalamus",
          "hypothalamus",
          "pituitary",
          "pineal",
          "colliculus",
          "lemniscus",
          "tentorium",
          "meningeal",
          "dura",
          "bone",
          "skull",
          "cord",
          "spine",
        ];

        const valid: THREE.Mesh[] = [];
        let rawMinY = Infinity, rawMaxY = -Infinity;

        modelScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const name = (mesh.name || "").toLowerCase();
            const ok = INCLUDE.some((w) => name.includes(w)) && !EXCLUDE.some((w) => name.includes(w));
            if (!ok) {
              mesh.visible = false;
              return;
            }
            valid.push(mesh);
            const geo = mesh.geometry as THREE.BufferGeometry;
            const pos = geo.attributes["position"] as THREE.BufferAttribute;
            if (pos) {
              for (let i = 0; i < pos.count; i++) {
                const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
                v.applyMatrix4(mesh.matrixWorld);
                rawMinY = Math.min(rawMinY, v.y);
                rawMaxY = Math.max(rawMaxY, v.y);
              }
            }
          }
        });

        const totalH = rawMaxY - rawMinY;
        const stemCutY = rawMinY + totalH * 0.2;

        const tris: TriFace[] = [];
        let totalArea = 0;
        let bMinX = Infinity, bMinY = Infinity, bMinZ = Infinity;
        let bMaxX = -Infinity, bMaxY = -Infinity, bMaxZ = -Infinity;

        for (const mesh of valid) {
          const geo = mesh.geometry as THREE.BufferGeometry;
          const pa = geo.attributes["position"] as THREE.BufferAttribute;
          if (!pa) continue;
          const idx = geo.index;
          const tc = idx ? idx.count / 3 : pa.count / 3;

          for (let t = 0; t < tc; t++) {
            const i0 = idx ? idx.getX(t * 3) : t * 3;
            const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
            const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
            const a = new THREE.Vector3(pa.getX(i0), pa.getY(i0), pa.getZ(i0)).applyMatrix4(mesh.matrixWorld);
            const b = new THREE.Vector3(pa.getX(i1), pa.getY(i1), pa.getZ(i1)).applyMatrix4(mesh.matrixWorld);
            const c = new THREE.Vector3(pa.getX(i2), pa.getY(i2), pa.getZ(i2)).applyMatrix4(mesh.matrixWorld);
            if (a.y < stemCutY || b.y < stemCutY || c.y < stemCutY) continue;
            const ab = new THREE.Vector3().subVectors(b, a);
            const ac = new THREE.Vector3().subVectors(c, a);
            const area = ab.cross(ac).length() * 0.5;
            if (area < 1e-8) continue;
            const normal = new THREE.Vector3().crossVectors(ab, ac).normalize();
            tris.push({ a, b, c, area, normal });
            totalArea += area;
            for (const v of [a, b, c]) {
              bMinX = Math.min(bMinX, v.x); bMinY = Math.min(bMinY, v.y); bMinZ = Math.min(bMinZ, v.z);
              bMaxX = Math.max(bMaxX, v.x); bMaxY = Math.max(bMaxY, v.y); bMaxZ = Math.max(bMaxZ, v.z);
            }
          }
        }

        if (tris.length === 0) {
          setLoadError("Could not extract brain surfaces.");
          return;
        }

        const cx = (bMinX + bMaxX) / 2;
        const cy = (bMinY + bMaxY) / 2;
        const cz = (bMinZ + bMaxZ) / 2;
        const maxDim = Math.max(bMaxX - bMinX, bMaxY - bMinY, bMaxZ - bMinZ);
        const uScale = 5.2 / maxDim;

        const cum: number[] = [];
        let cs = 0;
        for (const tr of tris) {
          cs += tr.area;
          cum.push(cs);
        }

        const pickTri = (r: number) => {
          const target = r * totalArea;
          let lo = 0, hi = cum.length - 1;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if ((cum[mid] ?? 0) < target) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        };

        const sampleTri = (tr: TriFace) => {
          let u = Math.random();
          let v = Math.random();
          if (u + v > 1) {
            u = 1 - u;
            v = 1 - v;
          }
          const w = 1 - u - v;
          return new THREE.Vector3(
            tr.a.x * w + tr.b.x * u + tr.c.x * v,
            tr.a.y * w + tr.b.y * u + tr.c.y * v,
            tr.a.z * w + tr.b.z * u + tr.c.z * v,
          );
        };

        const TARGET = 7500;
        const sampled: { p: THREE.Vector3; n: THREE.Vector3 }[] = [];
        const GRID = 0.065;
        const gridMap = new Map<string, boolean>();
        const key = (x: number, y: number, z: number) =>
          `${Math.floor(x / GRID)},${Math.floor(y / GRID)},${Math.floor(z / GRID)}`;

        let attempts = 0;
        const max = TARGET * 8;
        while (sampled.length < TARGET && attempts < max) {
          attempts++;
          const tri = tris[pickTri(Math.random())]!;
          const world = sampleTri(tri);
          const sx = (world.x - cx) * uScale;
          const sy = (world.y - cy) * uScale;
          const sz = (world.z - cz) * uScale;
          const k = key(sx, sy, sz);
          if (gridMap.has(k)) continue;
          gridMap.set(k, true);
          sampled.push({ p: new THREE.Vector3(sx, sy, sz), n: tri.normal });
        }

        // Two short hanging strands (asymmetric, not legs).
        const stemBottomY = (stemCutY - cy) * uScale;
        for (let v = 0; v < 60; v++) {
          const isPrimary = v < 40;
          const t = isPrimary ? v / 40 : (v - 40) / 20;
          const startX = isPrimary ? -0.05 : 0.08;
          const startZ = isPrimary ? 0 : -0.1;
          const basePathX = startX + (isPrimary ? 0.1 : -0.15) * Math.sin(t * Math.PI);
          const basePathY = stemBottomY - (isPrimary ? 0.8 : 0.5) * t;
          const basePathZ = startZ - 0.2 * t + 0.1 * Math.sin(t * Math.PI * 2);
          sampled.push({
            p: new THREE.Vector3(
              basePathX + (Math.random() - 0.5) * 0.08,
              basePathY + (Math.random() - 0.5) * 0.06,
              basePathZ + (Math.random() - 0.5) * 0.08,
            ),
            n: new THREE.Vector3(0, -1, 0),
          });
        }

        particleCount = sampled.length;
        const centered = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
          const sp = sampled[i]!;
          centered[i * 3] = sp.p.x;
          centered[i * 3 + 1] = sp.p.y;
          centered[i * 3 + 2] = sp.p.z;
        }

        // Invisible raycast proxy covering the brain surface.
        const rcGeo = new THREE.BufferGeometry();
        rcGeo.setAttribute("position", new THREE.BufferAttribute(centered, 3));
        rcGeo.computeBoundingSphere();
        const rcMat = new THREE.MeshBasicMaterial({
          visible: false,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        brainMesh = new THREE.Mesh(rcGeo, rcMat);
        brainGroup.add(brainMesh);

        restPos = new Float32Array(centered);
        activePos = new Float32Array(centered);
        vel = new Float32Array(particleCount * 3);
        restCol = new Float32Array(particleCount * 3);
        activeCol = new Float32Array(particleCount * 3);
        pulseOff = new Float32Array(particleCount);
        pulseSpd = new Float32Array(particleCount);

        const colDeep = new THREE.Color("#0d473f");
        const colTeal = new THREE.Color("#15846E");
        const colCyan = new THREE.Color("#22d3ee");
        const colMint = new THREE.Color("#6ee7b7");
        const colEmerald = new THREE.Color("#10b981");
        const lightDir = new THREE.Vector3(-1, 1, 1).normalize();

        for (let p = 0; p < particleCount; p++) {
          const sp = sampled[p]!;
          const px = centered[p * 3] ?? 0;
          const py = centered[p * 3 + 1] ?? 0;
          const pz = centered[p * 3 + 2] ?? 0;

          pulseOff[p] = Math.random() * Math.PI * 2;
          pulseSpd[p] = 0.8 + Math.random() * 1.2;

          let diffuse = Math.max(0, sp.n.dot(lightDir));
          diffuse = 0.15 + diffuse * 0.85;
          const depthZ = Math.max(0, Math.min(1, (pz + 1.5) / 3));
          const depthFactor = 0.25 + depthZ * 0.75;
          const absX = Math.abs(px);
          const fissure = absX < 0.18 ? (absX / 0.18) * 0.6 + 0.4 : 1;
          const worldNormal = sp.n.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2 + 0.3);
          const rimIntensity = 1 - Math.abs(worldNormal.dot(new THREE.Vector3(0, 0, 1)));
          let isRim = false;
          let rimGlow = 0;
          if (rimIntensity > 0.85) {
            isRim = true;
            const edge = (rimIntensity - 0.85) / 0.15;
            rimGlow = edge * (0.6 + Math.random() * 0.8);
          }
          const baseBrightness = diffuse * depthFactor * fissure;
          const r = Math.random();
          let pCol: THREE.Color;
          let mult: number;
          if (isRim) {
            pCol = r > 0.6 ? colCyan : colTeal;
            mult = 1.5 + rimGlow * 2;
          } else if (r > 0.92) {
            pCol = colMint;
            mult = 1.6;
          } else if (r > 0.8) {
            pCol = colCyan;
            mult = 1.4;
          } else if (r > 0.6) {
            pCol = colEmerald;
            mult = 1.25;
          } else if (r > 0.3) {
            pCol = colTeal;
            mult = 1.1;
          } else {
            pCol = colDeep;
            mult = 0.85;
          }
          const fb = Math.max(baseBrightness, isRim ? rimGlow : 0) * mult;
          restCol[p * 3] = pCol.r * fb;
          restCol[p * 3 + 1] = pCol.g * fb;
          restCol[p * 3 + 2] = pCol.b * fb;
          activeCol[p * 3] = restCol[p * 3]!;
          activeCol[p * 3 + 1] = restCol[p * 3 + 1]!;
          activeCol[p * 3 + 2] = restCol[p * 3 + 2]!;
        }

        dispersed = new Float32Array(particleCount * 3);
        for (let p = 0; p < particleCount; p++) {
          const rTh = Math.random() * Math.PI * 2;
          const rPh = Math.acos(1 - 2 * Math.random());
          const r = 4 + Math.random() * 8;
          dispersed[p * 3] = r * Math.sin(rPh) * Math.cos(rTh);
          dispersed[p * 3 + 1] = r * Math.cos(rPh);
          dispersed[p * 3 + 2] = r * Math.sin(rPh) * Math.sin(rTh) - 3;
        }

        // Build connections in a spatial grid (thin neural network).
        const cellS = 0.3;
        const grid = new Map<string, number[]>();
        const kk = (x: number, y: number, z: number) =>
          `${Math.floor(x / cellS)},${Math.floor(y / cellS)},${Math.floor(z / cellS)}`;
        for (let i = 0; i < particleCount; i++) {
          const k = kk(centered[i * 3] ?? 0, centered[i * 3 + 1] ?? 0, centered[i * 3 + 2] ?? 0);
          if (!grid.has(k)) grid.set(k, []);
          grid.get(k)!.push(i);
        }
        const lineIdx: number[] = [];
        const maxDSq = 0.28 * 0.28;
        for (let i = 0; i < particleCount; i++) {
          const px = centered[i * 3] ?? 0;
          const py = centered[i * 3 + 1] ?? 0;
          const pz = centered[i * 3 + 2] ?? 0;
          const kx = Math.floor(px / cellS);
          const ky = Math.floor(py / cellS);
          const kz = Math.floor(pz / cellS);
          let conn = 0;
          for (let x = -1; x <= 1; x++)
            for (let y = -1; y <= 1; y++)
              for (let z = -1; z <= 1; z++) {
                const nb = grid.get(`${kx + x},${ky + y},${kz + z}`);
                if (!nb) continue;
                for (const j of nb) {
                  if (j > i && conn < 4) {
                    const dx = px - (centered[j * 3] ?? 0);
                    const dy = py - (centered[j * 3 + 1] ?? 0);
                    const dz = pz - (centered[j * 3 + 2] ?? 0);
                    if (dx * dx + dy * dy + dz * dz < maxDSq) {
                      lineIdx.push(i, j);
                      conn++;
                    }
                  }
                }
              }
        }

        const pGeo = new THREE.BufferGeometry();
        posAttr = new THREE.BufferAttribute(activePos, 3);
        colAttr = new THREE.BufferAttribute(activeCol, 3);
        pGeo.setAttribute("position", posAttr);
        pGeo.setAttribute("color", colAttr);

        pointsMat = new THREE.PointsMaterial({
          size: 0.025,
          sizeAttenuation: true,
          map: makeParticleTexture(),
          transparent: true,
          opacity: 0.95,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        pointsObj = new THREE.Points(pGeo, pointsMat);
        brainGroup.add(pointsObj);

        const lGeo = new THREE.BufferGeometry();
        lGeo.setAttribute("position", posAttr);
        lGeo.setAttribute("color", colAttr);
        lGeo.setIndex(lineIdx);
        linesMat = new THREE.LineBasicMaterial({
          transparent: true,
          opacity: 0.22,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        linesObj = new THREE.LineSegments(lGeo, linesMat);
        brainGroup.add(linesObj);
      },
      undefined,
      (err) => {
        console.error("brain.glb failed to load", err);
        setLoadError("Failed to load the 3D brain.");
      },
    );

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.mouseNDC.set(x, y);
      if (brainMesh) {
        raycaster.setFromCamera(stateRef.mouseNDC, camera);
        const hits = raycaster.intersectObject(brainMesh);
        if (hits.length > 0 && hits[0]) {
          const w = brainGroup.worldToLocal(hits[0].point.clone());
          stateRef.cursor.copy(w);
          stateRef.cursorActive = true;
        } else {
          stateRef.cursorActive = false;
        }
      }
    };
    const onLeave = () => {
      stateRef.cursorActive = false;
      stateRef.mouseNDC.set(-10, -10);
    };
    window.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let rafId = 0;
    const clock = new THREE.Clock();
    const colBrightMint = new THREE.Color("#6ee7b7");
    const colBrightCyan = new THREE.Color("#22d3ee");

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      const st = stateRef;

      const tgtI = st.cursorActive ? 1 : 0;
      st.cursorIntensity += (tgtI - st.cursorIntensity) * 0.08;

      // Tween brain group X toward the requested target — provides the
      // "shift to the right" intro motion without a hard cut. The prop
      // effect above can override `targetOffsetX` between frames; when null,
      // fall back to the default per-viewport placement.
      const defaultX = 4.4;
      const targetFromProp = (st as { targetOffsetX: number | null }).targetOffsetX;
      const effectiveTarget = isMobile
        ? 0
        : targetFromProp == null
          ? defaultX
          : targetFromProp;
      brainGroup.position.x += (effectiveTarget - brainGroup.position.x) * 0.045;

      // Subtle breathing — never rotate the whole brain.
      const breathe = 1 + Math.sin(t * 1.2) * 0.015;
      brainGroup.scale.set(breathe, breathe, breathe);

      const scroll = st.scroll;
      if (pointsMat && linesMat) {
        if (scroll <= 0.05) {
          pointsMat.opacity = 0.95;
          linesMat.opacity = 0.22;
        } else if (scroll <= 0.25) {
          const tt = (scroll - 0.05) / 0.2;
          pointsMat.opacity = 0.95 + (0.6 - 0.95) * tt;
          linesMat.opacity = 0.22 * (1 - tt);
        } else if (scroll <= 0.5) {
          const tt = (scroll - 0.25) / 0.25;
          pointsMat.opacity = 0.6 + (0.25 - 0.6) * tt;
          linesMat.opacity = 0;
        } else if (scroll <= 0.7) {
          const tt = (scroll - 0.5) / 0.2;
          pointsMat.opacity = 0.25 + (0.08 - 0.25) * tt;
          linesMat.opacity = 0;
        } else {
          pointsMat.opacity = 0.05;
          linesMat.opacity = 0;
        }
      }

      if (posAttr && colAttr && particleCount > 0) {
        const cursor = st.cursor;
        const rSq = 2.2 * 2.2;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const rx = restPos[idx] ?? 0;
          const ry = restPos[idx + 1] ?? 0;
          const rz = restPos[idx + 2] ?? 0;
          let px = activePos[idx] ?? rx;
          let py = activePos[idx + 1] ?? ry;
          let pz = activePos[idx + 2] ?? rz;
          let vx = vel[idx] ?? 0;
          let vy = vel[idx + 1] ?? 0;
          let vz = vel[idx + 2] ?? 0;

          const dx = px - cursor.x;
          const dy = py - cursor.y;
          const dz = pz - cursor.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          let tgtX = rx, tgtY = ry, tgtZ = rz;
          if (scroll > 0.02) {
            const disX = dispersed[idx] ?? rx;
            const disY = dispersed[idx + 1] ?? ry;
            const disZ = dispersed[idx + 2] ?? rz;
            if (scroll <= 0.1) {
              // hold
            } else if (scroll <= 0.25) {
              const tt = ((scroll - 0.1) / 0.15) ** 2;
              tgtX = rx + (disX - rx) * 0.05 * tt;
              tgtY = ry + (disY - ry) * 0.05 * tt;
              tgtZ = rz + (disZ - rz) * 0.05 * tt;
            } else if (scroll <= 0.5) {
              const tt = (scroll - 0.25) / 0.25;
              const fromX = rx + (disX - rx) * 0.05;
              const fromY = ry + (disY - ry) * 0.05;
              const fromZ = rz + (disZ - rz) * 0.05;
              const toX = rx + (disX - rx) * 0.4;
              const toY = ry + (disY - ry) * 0.4;
              const toZ = rz + (disZ - rz) * 0.4;
              tgtX = fromX + (toX - fromX) * tt;
              tgtY = fromY + (toY - fromY) * tt;
              tgtZ = fromZ + (toZ - fromZ) * tt;
            } else if (scroll <= 0.7) {
              const tt = (scroll - 0.5) / 0.2;
              tgtX = rx + (disX - rx) * (0.4 + 0.6 * tt);
              tgtY = ry + (disY - ry) * (0.4 + 0.6 * tt);
              tgtZ = rz + (disZ - rz) * (0.4 + 0.6 * tt);
            } else {
              tgtX = disX + Math.sin(t * 0.15 + i * 0.02) * 2;
              tgtY = disY + Math.cos(t * 0.12 + i * 0.01) * 2;
              tgtZ = disZ + Math.sin(t * 0.1 + i * 0.015) * 1.5;
            }
          }

          let highlight = 0;
          if (st.cursorIntensity > 0.01 && distSq < rSq && scroll <= 0.05) {
            const dist = Math.sqrt(distSq);
            const norm = dist / 1.7;
            const influence = (1 - norm * norm) * st.cursorIntensity;
            const repel = influence * 0.1;
            const dirX = dist > 0.001 ? dx / dist : 0;
            const dirY = dist > 0.001 ? dy / dist : 0;
            const dirZ = dist > 0.001 ? dz / dist : 1;
            tgtX += dirX * repel;
            tgtY += dirY * repel;
            tgtZ += dirZ * repel;
            highlight = influence;
          }

          const sx = (tgtX - px) * 0.05;
          const sy = (tgtY - py) * 0.05;
          const sz = (tgtZ - pz) * 0.05;
          vx = (vx + sx) * 0.88;
          vy = (vy + sy) * 0.88;
          vz = (vz + sz) * 0.88;
          px += vx;
          py += vy;
          pz += vz;

          activePos[idx] = px;
          activePos[idx + 1] = py;
          activePos[idx + 2] = pz;
          vel[idx] = vx;
          vel[idx + 1] = vy;
          vel[idx + 2] = vz;

          const baseR = restCol[idx] ?? 0.2;
          const baseG = restCol[idx + 1] ?? 0.2;
          const baseB = restCol[idx + 2] ?? 0.2;
          const lightPulse = Math.sin(t * 0.6 + (pulseOff[i] ?? 0)) * 0.04 + 0.04;
          const tR = ((baseR + lightPulse * 0.05) + (colBrightMint.r - (baseR + lightPulse * 0.05)) * highlight * 0.5);
          const tG = ((baseG + lightPulse * 0.1) + (colBrightMint.g - (baseG + lightPulse * 0.1)) * highlight * 0.5);
          const tB = ((baseB + lightPulse * 0.1) + (colBrightCyan.b - (baseB + lightPulse * 0.1)) * highlight * 0.5);
          activeCol[idx] = (activeCol[idx] ?? 0) + (tR - (activeCol[idx] ?? 0)) * 0.08;
          activeCol[idx + 1] = (activeCol[idx + 1] ?? 0) + (tG - (activeCol[idx + 1] ?? 0)) * 0.08;
          activeCol[idx + 2] = (activeCol[idx + 2] ?? 0) + (tB - (activeCol[idx + 2] ?? 0)) * 0.08;
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mouseleave", onLeave);
      renderer.dispose();
    };
  }, []);

  // Update scroll-driven dispersal from the parent.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      // Reflect onto the running renderer via a custom event handled inside the
      // effect above. For simplicity we keep it state-driven through a CSS var.
      document.documentElement.style.setProperty("--hero-scroll", String(p));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block size-full"
      />
      {loadError && (
        <p className="absolute bottom-4 left-4 z-10 font-mono text-xs text-rose-400">
          {loadError}
        </p>
      )}
    </div>
  );
}
