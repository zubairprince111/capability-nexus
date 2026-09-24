import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export interface AI5KBrainProps {
  className?: string;
  scrollProgress?: number;
  interactive?: boolean;
  rotationYOffset?: number;
  positionXOffset?: number;
  onLoad?: () => void;
}

// HELPER: Create bioluminescent soft radial particle dot texture
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.3, "rgba(110, 231, 183, 0.75)");
    gradient.addColorStop(0.65, "rgba(20, 184, 166, 0.25)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function AI5KBrain({
  className = "",
  scrollProgress = 0,
  interactive = true,
  rotationYOffset = -Math.PI / 2, // Rotated for front/3-4 view
  positionXOffset = 3.2,
  onLoad,
}: AI5KBrainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentPosXRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const stateRef = useRef({
    mouseNDC: new THREE.Vector2(-10, -10),
    cursorWorld: new THREE.Vector3(0, 0, 0),
    cursorOverBrain: false,
    cursorOverIntensity: 0,
    scrollProgress: 0,
    reducedMotion: false,
    positionXOffset: positionXOffset,
    rotationYOffset: rotationYOffset,
  });

  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.positionXOffset = positionXOffset;
    // We adjust the rotation slightly to get a beautiful 3/4 frontal view 
    // that clearly shows the two hemispheres and fissure.
    stateRef.current.rotationYOffset = rotationYOffset + 0.3; 
  }, [scrollProgress, positionXOffset, rotationYOffset]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    stateRef.current.reducedMotion = mediaQuery.matches;
    const listener = (e: MediaQueryListEvent) => {
      stateRef.current.reducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
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

    // --- 2. LUMINOUS NEURAL LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x0d473f, 3.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x10b981, 5.5);
    keyLight.position.set(6, 7, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 4.0);
    fillLight.position.set(-6, -4, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x6ee7b7, 3.8);
    rimLight.position.set(0, 8, 3);
    scene.add(rimLight);

    // --- 3. BRAIN GROUP POSITION ---
    const isMobile = window.innerWidth < 768;
    const brainGroup = new THREE.Group();
    brainGroup.position.set(isMobile ? 0 : positionXOffset, isMobile ? 0.2 : -0.15, 0);
    brainGroup.rotation.set(0, stateRef.current.rotationYOffset, 0);
    scene.add(brainGroup);

    const raycaster = new THREE.Raycaster();

    // --- 4. LOAD ANATOMICAL BRAIN GEOMETRY & SAMPLE PARTICLES ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let brainMesh: THREE.Mesh | null = null;
    let surfaceParticlesPoints: THREE.Points | null = null;
    let filamentLines: THREE.LineSegments | null = null;
    let particlePositionsAttr: THREE.BufferAttribute | null = null;
    let particleColorsAttr: THREE.BufferAttribute | null = null;
    let pointsMaterial: THREE.PointsMaterial | null = null;
    let linesMaterial: THREE.LineBasicMaterial | null = null;

    let restPositionsArr: Float32Array = new Float32Array(0);
    let activePositionsArr: Float32Array = new Float32Array(0);
    let velocitiesArr: Float32Array = new Float32Array(0);
    let restColorsArr: Float32Array = new Float32Array(0);
    let activeColorsArr: Float32Array = new Float32Array(0);
    let pulseOffsets: Float32Array = new Float32Array(0);
    let pulseSpeeds: Float32Array = new Float32Array(0);

    let dispersedPosArr: Float32Array = new Float32Array(0);
    let particleCount = 0;

    gltfLoader.load(
      "/brain.glb",
      (gltf) => {
        setIsLoading(false);
        if (onLoad) onLoad();
        
        const modelScene = gltf.scene;
        modelScene.updateMatrixWorld(true);

        // We MUST filter out all cranial nerves, tracts, arteries, and internal structures.
        // Otherwise, the particle cloud looks like a solid human head (because nerves extend to eyes/nose/neck).
        const INCLUDE = [
          "gyrus", "sulcus", "cuneus", "lobule", "pole", "insula", 
          "cerebellum", "vermis", "declive", "culmen", "flocculus",
          "pons", "medulla", "midbrain", "olive", "pyramid"
        ];
        const EXCLUDE = [
          "artery", "vein", "vessel", "nerve", "tract", "fasciculus",
          "radiation", "commissure", "ventricle", "nucleus", "ganglia",
          "matter", "peduncle", "chiasm", "thalamus", "hypothalamus",
          "pituitary", "pineal", "colliculus", "lemniscus", "tentorium",
          "meningeal", "dura", "bone", "skull", "cord", "spine"
        ];

        let rawMinY = Infinity, rawMaxY = -Infinity;
        const validMeshes: THREE.Mesh[] = [];

        modelScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const name = (mesh.name || "").toLowerCase();

            const shouldInclude = INCLUDE.some(w => name.includes(w));
            const shouldExclude = EXCLUDE.some(w => name.includes(w));

            if (shouldInclude && !shouldExclude) {
              validMeshes.push(mesh);
              // Find bounds to cut the brainstem short
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
            } else {
              mesh.visible = false;
            }
          }
        });

        // Cut off the bottom 20% to ensure the brainstem is short and compact
        const totalRawHeight = rawMaxY - rawMinY;
        const stemCutoffY = rawMinY + totalRawHeight * 0.20;

        interface TriFace {
          a: THREE.Vector3;
          b: THREE.Vector3;
          c: THREE.Vector3;
          area: number;
          normal: THREE.Vector3;
        }

        const triangles: TriFace[] = [];
        let totalArea = 0;
        let bMinX = Infinity, bMinY = Infinity, bMinZ = Infinity;
        let bMaxX = -Infinity, bMaxY = -Infinity, bMaxZ = -Infinity;

        // Collect triangle faces for area-weighted surface sampling
        for (const mesh of validMeshes) {
          const geo = mesh.geometry as THREE.BufferGeometry;
          const posAttr = geo.attributes["position"] as THREE.BufferAttribute;
          if (!posAttr) continue;

          const index = geo.index;
          const triCount = index ? index.count / 3 : posAttr.count / 3;

          for (let t = 0; t < triCount; t++) {
            const i0 = index ? index.getX(t * 3) : t * 3;
            const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1;
            const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2;

            const a = new THREE.Vector3(posAttr.getX(i0), posAttr.getY(i0), posAttr.getZ(i0)).applyMatrix4(mesh.matrixWorld);
            const b = new THREE.Vector3(posAttr.getX(i1), posAttr.getY(i1), posAttr.getZ(i1)).applyMatrix4(mesh.matrixWorld);
            const c = new THREE.Vector3(posAttr.getX(i2), posAttr.getY(i2), posAttr.getZ(i2)).applyMatrix4(mesh.matrixWorld);

            // Cut off the long neck/spine
            if (a.y < stemCutoffY || b.y < stemCutoffY || c.y < stemCutoffY) continue;

            const ab = new THREE.Vector3().subVectors(b, a);
            const ac = new THREE.Vector3().subVectors(c, a);
            const triArea = ab.cross(ac).length() * 0.5;

            if (triArea < 1e-8) continue; // skip degenerate

            const normal = new THREE.Vector3().crossVectors(ab, ac).normalize();

            triangles.push({ a, b, c, area: triArea, normal });
            totalArea += triArea;

            for (const v of [a, b, c]) {
              bMinX = Math.min(bMinX, v.x); bMinY = Math.min(bMinY, v.y); bMinZ = Math.min(bMinZ, v.z);
              bMaxX = Math.max(bMaxX, v.x); bMaxY = Math.max(bMaxY, v.y); bMaxZ = Math.max(bMaxZ, v.z);
            }
          }
        }

        if (triangles.length === 0) {
          setLoadError("Could not extract brain surfaces.");
          return;
        }

        // Compute center and scale
        const cx = (bMinX + bMaxX) / 2;
        const cy = (bMinY + bMaxY) / 2;
        const cz = (bMinZ + bMaxZ) / 2;
        const sizeX = bMaxX - bMinX;
        const sizeY = bMaxY - bMinY;
        const sizeZ = bMaxZ - bMinZ;

        // Uniform scale to preserve natural brain proportions (approx 1.4 : 1 width:height)
        const maxDim = Math.max(sizeX, sizeY, sizeZ);
        const uniformScale = 5.2 / maxDim;

        // Area-weighted distribution
        const cumulativeArea: number[] = [];
        let cumSum = 0;
        for (const tri of triangles) {
          cumSum += tri.area;
          cumulativeArea.push(cumSum);
        }

        function pickTriangle(rand: number): number {
          const target = rand * totalArea;
          let lo = 0, hi = cumulativeArea.length - 1;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (cumulativeArea[mid]! < target) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        }

        function sampleTrianglePoint(tri: TriFace): THREE.Vector3 {
          let u = Math.random();
          let v = Math.random();
          if (u + v > 1) { u = 1 - u; v = 1 - v; }
          const w = 1 - u - v;
          return new THREE.Vector3(
            tri.a.x * w + tri.b.x * u + tri.c.x * v,
            tri.a.y * w + tri.b.y * u + tri.c.y * v,
            tri.a.z * w + tri.b.z * u + tri.c.z * v
          );
        }

        // Generate dense surface particles (Microscopic point cloud)
        const TARGET_PARTICLES = 7500;
        const sampledSurfacePos: { p: THREE.Vector3; n: THREE.Vector3 }[] = [];
        const GRID_CELL = 0.065; 
        const gridMap = new Map<string, boolean>();

        function gridKey(x: number, y: number, z: number): string {
          return `${Math.floor(x / GRID_CELL)},${Math.floor(y / GRID_CELL)},${Math.floor(z / GRID_CELL)}`;
        }

        let attempts = 0;
        const maxAttempts = TARGET_PARTICLES * 8;

        while (sampledSurfacePos.length < TARGET_PARTICLES && attempts < maxAttempts) {
          attempts++;
          const triIdx = pickTriangle(Math.random());
          const tri = triangles[triIdx]!;
          const worldPt = sampleTrianglePoint(tri);

          const sx = (worldPt.x - cx) * uniformScale;
          const sy = (worldPt.y - cy) * uniformScale;
          const sz = (worldPt.z - cz) * uniformScale;

          const key = gridKey(sx, sy, sz);
          if (gridMap.has(key)) continue;
          gridMap.set(key, true);

          sampledSurfacePos.push({ p: new THREE.Vector3(sx, sy, sz), n: tri.normal });
        }

        // --- Add two small hanging veins (asymmetrical to avoid looking like legs) ---
        const veinCount = 60;
        const stemBottomY = (stemCutoffY - cy) * uniformScale;
        for (let v = 0; v < veinCount; v++) {
          const isPrimary = v < 40; // One thicker/longer main strand, one smaller secondary strand
          const t = isPrimary ? (v / 40) : ((v - 40) / 20); // 0.0 to 1.0 down the length
          
          // Start very close to center, don't splay left/right
          const startX = isPrimary ? -0.05 : 0.08;
          const startZ = isPrimary ? 0.0 : -0.1;
          
          // Curve gently backwards and slightly twist, rather than spreading outward
          const basePathX = startX + (isPrimary ? 0.1 : -0.15) * Math.sin(t * Math.PI);
          const basePathY = stemBottomY - (isPrimary ? 0.8 : 0.5) * t; 
          const basePathZ = startZ - 0.2 * t + 0.1 * Math.sin(t * Math.PI * 2);
          
          // Add organic noise
          const nx = basePathX + (Math.random() - 0.5) * 0.08;
          const ny = basePathY + (Math.random() - 0.5) * 0.06;
          const nz = basePathZ + (Math.random() - 0.5) * 0.08;
          
          sampledSurfacePos.push({ p: new THREE.Vector3(nx, ny, nz), n: new THREE.Vector3(0, -1, 0) });
        }

        particleCount = sampledSurfacePos.length;
        const centeredPos = new Float32Array(particleCount * 3);
        const particleNormals = new THREE.Vector3(); // reuse for calculations

        for (let i = 0; i < particleCount; i++) {
          const sp = sampledSurfacePos[i]!;
          centeredPos[i * 3] = sp.p.x;
          centeredPos[i * 3 + 1] = sp.p.y;
          centeredPos[i * 3 + 2] = sp.p.z;
        }

        // --- Invisible raycasting mesh ---
        const cleanedBrainGeo = new THREE.BufferGeometry();
        cleanedBrainGeo.setAttribute("position", new THREE.BufferAttribute(centeredPos, 3));
        cleanedBrainGeo.computeBoundingSphere();

        const raycastMat = new THREE.MeshBasicMaterial({
          visible: false, // Must be invisible to prevent crystal/shard artifacts
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

        brainMesh = new THREE.Mesh(cleanedBrainGeo, raycastMat);
        brainGroup.add(brainMesh);

        // --- Particle physics arrays ---
        restPositionsArr = new Float32Array(particleCount * 3);
        activePositionsArr = new Float32Array(particleCount * 3);
        velocitiesArr = new Float32Array(particleCount * 3);
        restColorsArr = new Float32Array(particleCount * 3);
        activeColorsArr = new Float32Array(particleCount * 3);
        pulseOffsets = new Float32Array(particleCount);
        pulseSpeeds = new Float32Array(particleCount);

        // Teal palette — visible but premium dark aesthetic
        const colDeepTeal = new THREE.Color("#0d473f"); // Darker base for deeper shadows
        const colTeal = new THREE.Color("#15846E");
        const colCyan = new THREE.Color("#22d3ee");
        const colMint = new THREE.Color("#6ee7b7");
        const colEmerald = new THREE.Color("#10b981");

        const lightDir = new THREE.Vector3(-1, 1, 1).normalize(); // Upper left front light

        for (let p = 0; p < particleCount; p++) {
          const sp = sampledSurfacePos[p]!;
          const px = centeredPos[p * 3] ?? 0;
          const py = centeredPos[p * 3 + 1] ?? 0;
          const pz = centeredPos[p * 3 + 2] ?? 0;

          restPositionsArr[p * 3] = px;
          restPositionsArr[p * 3 + 1] = py;
          restPositionsArr[p * 3 + 2] = pz;

          activePositionsArr[p * 3] = px;
          activePositionsArr[p * 3 + 1] = py;
          activePositionsArr[p * 3 + 2] = pz;

          pulseOffsets[p] = Math.random() * Math.PI * 2;
          pulseSpeeds[p] = 0.8 + Math.random() * 1.2;

          // --- 1. 3D Lighting (Diffuse) ---
          const normal = sp.n;
          let diffuse = Math.max(0, normal.dot(lightDir));
          // Soften shadows so they aren't pitch black, just very dark teal
          diffuse = 0.15 + diffuse * 0.85;

          // --- 2. Depth Fading (Z-sorting) ---
          // Brain Z depth is roughly -1.5 to 1.5
          const depthZ = Math.max(0, Math.min(1, (pz + 1.5) / 3.0)); 
          const depthFactor = 0.25 + depthZ * 0.75; // 25% brightness in back, 100% in front

          // --- 3. Hemisphere Separation ---
          // Darken the longitudinal fissure to make left/right distinct
          const absX = Math.abs(px);
          const fissureFactor = absX < 0.18 ? (absX / 0.18) * 0.6 + 0.4 : 1.0; 

          // --- 4. Delicate Rim Outline ---
          // Calculate world normal to find the anatomical silhouette edge
          const rotY = -Math.PI / 2 + 0.3; // matches initial brainGroup rotation
          const worldNormal = normal.clone().applyAxisAngle(new THREE.Vector3(0,1,0), rotY);
          const viewDir = new THREE.Vector3(0, 0, 1);
          const rimDot = Math.abs(worldNormal.dot(viewDir));
          const rimIntensity = 1.0 - rimDot;
          
          let isRim = false;
          let rimGlow = 0;
          // Only particles extremely perpendicular to camera are the outline
          if (rimIntensity > 0.85) { // Broadened slightly to make it more visible
            isRim = true;
            const edgeThickness = (rimIntensity - 0.85) / 0.15;
            // Uneven natural intensity (fractal-like noise using random for now)
            rimGlow = edgeThickness * (0.6 + Math.random() * 0.8); // Much brighter glow
          }

          let baseBrightness = diffuse * depthFactor * fissureFactor;

          const randVal = Math.random();
          let pCol: THREE.Color;
          let brightnessMultiplier: number;

          if (isRim) {
            // Outline contour: deep teal base with subtle cyan highlights
            pCol = randVal > 0.6 ? colCyan : colTeal; // More cyan
            brightnessMultiplier = 1.5 + rimGlow * 2.0; // Higher base brightness and glow
            // Prevent outline from fading completely in the back
            baseBrightness = Math.max(baseBrightness, rimGlow * 1.0);
          } else {
            // Internal surface
            if (randVal > 0.92) {
              pCol = colMint; brightnessMultiplier = 1.6;
            } else if (randVal > 0.80) {
              pCol = colCyan; brightnessMultiplier = 1.4;
            } else if (randVal > 0.60) {
              pCol = colEmerald; brightnessMultiplier = 1.25;
            } else if (randVal > 0.30) {
              pCol = colTeal; brightnessMultiplier = 1.1;
            } else {
              pCol = colDeepTeal; brightnessMultiplier = 0.85; // Raised floor brightness
            }
          }

          const finalBrightness = baseBrightness * brightnessMultiplier;

          restColorsArr[p * 3] = pCol.r * finalBrightness;
          restColorsArr[p * 3 + 1] = pCol.g * finalBrightness;
          restColorsArr[p * 3 + 2] = pCol.b * finalBrightness;

          activeColorsArr[p * 3] = restColorsArr[p * 3]!;
          activeColorsArr[p * 3 + 1] = restColorsArr[p * 3 + 1]!;
          activeColorsArr[p * 3 + 2] = restColorsArr[p * 3 + 2]!;
        }

        // --- Scroll morph targets ---
        dispersedPosArr = new Float32Array(particleCount * 3);

        for (let p = 0; p < particleCount; p++) {
          // Dispersed Cloud (Subtle Atmospheric Field)
          const rTheta = Math.random() * Math.PI * 2;
          const rPhi = Math.acos(1 - 2 * Math.random());
          const rRad = 4.0 + Math.random() * 8.0; // Wide atmospheric radius
          dispersedPosArr[p * 3] = rRad * Math.sin(rPhi) * Math.cos(rTheta);
          dispersedPosArr[p * 3 + 1] = rRad * Math.cos(rPhi);
          dispersedPosArr[p * 3 + 2] = rRad * Math.sin(rPhi) * Math.sin(rTheta) - 3.0; // Pushed into background
        }

        // --- Generate Neural Connections (Lines) ---
        const lineIndices: number[] = [];
        const maxDistSq = 0.28 * 0.28; // Max connection distance
        const spatialGridL = new Map<string, number[]>();
        const cellS = 0.3; // spatial bucket size
        
        for (let i = 0; i < particleCount; i++) {
          const px = centeredPos[i * 3]!;
          const py = centeredPos[i * 3 + 1]!;
          const pz = centeredPos[i * 3 + 2]!;
          const kx = Math.floor(px / cellS);
          const ky = Math.floor(py / cellS);
          const kz = Math.floor(pz / cellS);
          const key = `${kx},${ky},${kz}`;
          if (!spatialGridL.has(key)) spatialGridL.set(key, []);
          spatialGridL.get(key)!.push(i);
        }

        for (let i = 0; i < particleCount; i++) {
          const px = centeredPos[i * 3]!;
          const py = centeredPos[i * 3 + 1]!;
          const pz = centeredPos[i * 3 + 2]!;
          const kx = Math.floor(px / cellS);
          const ky = Math.floor(py / cellS);
          const kz = Math.floor(pz / cellS);
          
          let connections = 0;
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              for (let z = -1; z <= 1; z++) {
                const key = `${kx + x},${ky + y},${kz + z}`;
                const neighbors = spatialGridL.get(key);
                if (neighbors) {
                  for (const j of neighbors) {
                    if (j > i && connections < 4) { // Only connect forward, max 4 local edges per node
                      const dx = px - centeredPos[j * 3]!;
                      const dy = py - centeredPos[j * 3 + 1]!;
                      const dz = pz - centeredPos[j * 3 + 2]!;
                      if (dx * dx + dy * dy + dz * dz < maxDistSq) {
                        lineIndices.push(i, j);
                        connections++;
                      }
                    }
                  }
                }
              }
            }
          }
        }


        // --- Create particle Points ---
        const pGeo = new THREE.BufferGeometry();
        particlePositionsAttr = new THREE.BufferAttribute(activePositionsArr, 3);
        particleColorsAttr = new THREE.BufferAttribute(activeColorsArr, 3);

        pGeo.setAttribute("position", particlePositionsAttr);
        pGeo.setAttribute("color", particleColorsAttr);

        const dotTexture = createParticleTexture();

        pointsMaterial = new THREE.PointsMaterial({
          size: 0.025, // Tiny nodes
          sizeAttenuation: true, 
          map: dotTexture,
          transparent: true,
          opacity: 0.95,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        surfaceParticlesPoints = new THREE.Points(pGeo, pointsMaterial);
        brainGroup.add(surfaceParticlesPoints);

        // --- Create Line Network ---
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", particlePositionsAttr);
        lineGeo.setAttribute("color", particleColorsAttr);
        lineGeo.setIndex(lineIndices);

        linesMaterial = new THREE.LineBasicMaterial({
          transparent: true,
          opacity: 0.22,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        filamentLines = new THREE.LineSegments(lineGeo, linesMaterial);
        brainGroup.add(filamentLines);
      },
      undefined,
      (err) => {
        console.error("Error loading brain model:", err);
        setLoadError("Failed to load 3D brain model.");
      }
    );

    // --- 5. POINTER RAYCASTING ---
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      stateRef.current.mouseNDC.set(x, y);

      if (brainMesh) {
        raycaster.setFromCamera(stateRef.current.mouseNDC, camera);
        const intersects = raycaster.intersectObject(brainMesh);

        if (intersects.length > 0 && intersects[0]) {
          const hitPointWorld = intersects[0].point;
          const hitPointLocal = brainGroup.worldToLocal(hitPointWorld.clone());

          stateRef.current.cursorWorld.copy(hitPointLocal);
          stateRef.current.cursorOverBrain = true;
        } else {
          stateRef.current.cursorOverBrain = false;
        }
      }
    };

    const handlePointerLeave = () => {
      stateRef.current.cursorOverBrain = false;
      stateRef.current.mouseNDC.set(-10, -10);
    };

    if (interactive) {
      window.addEventListener("mousemove", handlePointerMove);
      container.addEventListener("mouseleave", handlePointerLeave);
    }

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // --- 6. RENDER LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const colBrightCyan = new THREE.Color("#38bdf8");
    const colBrightMint = new THREE.Color("#6ee7b7");

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const time = clock.getElapsedTime();
      const st = stateRef.current;

      const targetIntensity = st.cursorOverBrain ? 1.0 : 0.0;
      st.cursorOverIntensity += (targetIntensity - st.cursorOverIntensity) * 0.08;

      // Smooth position interpolation
      const targetX = isMobile ? 0 : st.positionXOffset;
      if (currentPosXRef.current === null) {
        currentPosXRef.current = targetX;
      } else {
        currentPosXRef.current += (targetX - currentPosXRef.current) * 0.018;
      }

      brainGroup.position.set(currentPosXRef.current, isMobile ? 0.2 : -0.15, 0);
      brainGroup.rotation.set(0, st.rotationYOffset, 0);

      // --- Subtle Breathing Animation ---
      const breatheScale = 1.0 + Math.sin(time * 1.2) * 0.015;
      brainGroup.scale.set(breatheScale, breatheScale, breatheScale);

      // --- Atmospheric Fade Control ---
      const scrollVal = st.scrollProgress;
      let scrollFade = 1.0;

      if (pointsMaterial && linesMaterial) {
        if (scrollVal <= 0.05) {
          pointsMaterial.opacity = 0.95;
          linesMaterial.opacity = 0.22;
          scrollFade = 1.0;
        } else if (scrollVal <= 0.25) {
          const t = (scrollVal - 0.05) / 0.20;
          pointsMaterial.opacity = THREE.MathUtils.lerp(0.95, 0.60, t);
          // Lines completely vanish before nodes spread apart
          linesMaterial.opacity = THREE.MathUtils.lerp(0.22, 0.0, t); 
          scrollFade = 1.0;
        } else if (scrollVal <= 0.50) {
          const t = (scrollVal - 0.25) / 0.25;
          pointsMaterial.opacity = THREE.MathUtils.lerp(0.60, 0.25, t);
          linesMaterial.opacity = 0.0;
          scrollFade = THREE.MathUtils.lerp(1.0, 0.4, t); // Significantly darken colors
        } else if (scrollVal <= 0.70) {
          const t = (scrollVal - 0.50) / 0.20;
          pointsMaterial.opacity = THREE.MathUtils.lerp(0.25, 0.08, t);
          linesMaterial.opacity = 0.0;
          scrollFade = THREE.MathUtils.lerp(0.4, 0.15, t);
        } else {
          pointsMaterial.opacity = 0.05; // Faint background dust
          linesMaterial.opacity = 0.0;
          scrollFade = 0.10; // Extremely low light
        }
      }

      // Particle displacement & scroll morphing
      if (particlePositionsAttr && particleColorsAttr && particleCount > 0) {
        const cursorPt = st.cursorWorld;
        const interactionRadiusSq = 2.2 * 2.2;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;

          const rx = restPositionsArr[idx] ?? 0;
          const ry = restPositionsArr[idx + 1] ?? 0;
          const rz = restPositionsArr[idx + 2] ?? 0;

          let px = activePositionsArr[idx] ?? rx;
          let py = activePositionsArr[idx + 1] ?? ry;
          let pz = activePositionsArr[idx + 2] ?? rz;

          let vx = velocitiesArr[idx] ?? 0;
          let vy = velocitiesArr[idx + 1] ?? 0;
          let vz = velocitiesArr[idx + 2] ?? 0;

          const dx = px - cursorPt.x;
          const dy = py - cursorPt.y;
          const dz = pz - cursorPt.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          let tgtX = rx;
          let tgtY = ry;
          let tgtZ = rz;

          // Scroll state machine (Transition to Atmosphere)
          if (scrollVal > 0.02) {
            const disX = dispersedPosArr[idx] ?? rx;
            const disY = dispersedPosArr[idx + 1] ?? ry;
            const disZ = dispersedPosArr[idx + 2] ?? rz;

            if (scrollVal <= 0.10) {
              tgtX = rx;
              tgtY = ry;
              tgtZ = rz;
            } else if (scrollVal <= 0.25) {
              const t = (scrollVal - 0.10) / 0.15;
              const easeT = t * t; // subtle easing
              // Nodes subtly separate
              tgtX = rx + (disX - rx) * 0.05 * easeT;
              tgtY = ry + (disY - ry) * 0.05 * easeT;
              tgtZ = rz + (disZ - rz) * 0.05 * easeT;
            } else if (scrollVal <= 0.50) {
              const t = (scrollVal - 0.25) / 0.25;
              const pX = rx + (disX - rx) * 0.05;
              const pY = ry + (disY - ry) * 0.05;
              const pZ = rz + (disZ - rz) * 0.05;
              // Brain structure begins breaking apart rapidly
              tgtX = THREE.MathUtils.lerp(pX, rx + (disX - rx) * 0.4, t);
              tgtY = THREE.MathUtils.lerp(pY, ry + (disY - ry) * 0.4, t);
              tgtZ = THREE.MathUtils.lerp(pZ, rz + (disZ - rz) * 0.4, t);
            } else if (scrollVal <= 0.70) {
              const t = (scrollVal - 0.50) / 0.20;
              const pX = rx + (disX - rx) * 0.4;
              const pY = ry + (disY - ry) * 0.4;
              const pZ = rz + (disZ - rz) * 0.4;
              // Brain silhouette fully lost, dispersed widely
              tgtX = THREE.MathUtils.lerp(pX, disX, t);
              tgtY = THREE.MathUtils.lerp(pY, disY, t);
              tgtZ = THREE.MathUtils.lerp(pZ, disZ, t);
            } else {
              // Atmospheric drift
              tgtX = disX + Math.sin(time * 0.15 + i * 0.02) * 2.0;
              tgtY = disY + Math.cos(time * 0.12 + i * 0.01) * 2.0;
              tgtZ = disZ + Math.sin(time * 0.1 + i * 0.015) * 1.5;
            }
          }

          let highlightFactor = 0;

          if (st.cursorOverIntensity > 0.01 && distSq < interactionRadiusSq && scrollVal <= 0.05) {
            const dist = Math.sqrt(distSq);
            const normDist = dist / 1.7;
            const influence = (1.0 - normDist * normDist) * st.cursorOverIntensity;

            const repelForce = influence * 0.10;
            const dirX = dist > 0.001 ? dx / dist : 0;
            const dirY = dist > 0.001 ? dy / dist : 0;
            const dirZ = dist > 0.001 ? dz / dist : 1;

            tgtX += dirX * repelForce;
            tgtY += dirY * repelForce;
            tgtZ += dirZ * repelForce;

            highlightFactor = influence;
          }

          const springX = (tgtX - px) * 0.05;
          const springY = (tgtY - py) * 0.05;
          const springZ = (tgtZ - pz) * 0.05;

          vx = (vx + springX) * 0.88;
          vy = (vy + springY) * 0.88;
          vz = (vz + springZ) * 0.88;

          px += vx;
          py += vy;
          pz += vz;

          activePositionsArr[idx] = px;
          activePositionsArr[idx + 1] = py;
          activePositionsArr[idx + 2] = pz;

          velocitiesArr[idx] = vx;
          velocitiesArr[idx + 1] = vy;
          velocitiesArr[idx + 2] = vz;

          const baseR = restColorsArr[idx] ?? 0.2;
          const baseG = restColorsArr[idx + 1] ?? 0.2;
          const baseB = restColorsArr[idx + 2] ?? 0.2;

          const lightPulse = Math.sin(time * 0.6 + (pulseOffsets[i] ?? 0)) * 0.04 + 0.04;

          const targetR = THREE.MathUtils.lerp(baseR + lightPulse * 0.05, colBrightMint.r, highlightFactor * 0.5) * scrollFade;
          const targetG = THREE.MathUtils.lerp(baseG + lightPulse * 0.1, colBrightMint.g, highlightFactor * 0.5) * scrollFade;
          const targetB = THREE.MathUtils.lerp(baseB + lightPulse * 0.1, colBrightCyan.b, highlightFactor * 0.5) * scrollFade;

          activeColorsArr[idx]! += (targetR - (activeColorsArr[idx] ?? 0)) * 0.08;
          activeColorsArr[idx + 1]! += (targetG - (activeColorsArr[idx + 1] ?? 0)) * 0.08;
          activeColorsArr[idx + 2]! += (targetB - (activeColorsArr[idx + 2] ?? 0)) * 0.08;
        }

        particlePositionsAttr.needsUpdate = true;
        particleColorsAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener("mousemove", handlePointerMove);
        container.removeEventListener("mouseleave", handlePointerLeave);
      }
      window.removeEventListener("resize", handleResize);

      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div ref={containerRef} className={`relative size-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className={`block size-full transition-opacity duration-[3000ms] ease-in ${isLoading ? "opacity-0" : "opacity-100"}`}
      />


      {/* ERROR FALLBACK */}
      {loadError && (
        <div className="absolute bottom-6 left-6 z-30 font-mono text-xs text-rose-400">
          {loadError}
        </div>
      )}
    </div>
  );
}
