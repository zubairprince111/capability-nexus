import fs from "fs";
import path from "path";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

async function processBrainModel() {
  const glbPath = path.resolve("public/brain.glb");
  const outputPath = path.resolve("public/brain_mesh.json");

  console.log("Processing 3D Brain Model:", glbPath);

  const buffer = fs.readFileSync(glbPath);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.parse(
    arrayBuffer,
    "",
    (gltf) => {
      console.log("GLTF parsed successfully!");
      const scene = gltf.scene;
      scene.updateMatrixWorld(true);

      const allVertices = [];
      let minX = Infinity, minY = Infinity, minZ = Infinity;
      let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

      scene.traverse((child) => {
        if (child.isMesh) {
          const pos = child.geometry.attributes.position;
          if (pos) {
            for (let i = 0; i < pos.count; i++) {
              const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
              v.applyMatrix4(child.matrixWorld);

              minX = Math.min(minX, v.x);
              minY = Math.min(minY, v.y);
              minZ = Math.min(minZ, v.z);

              maxX = Math.max(maxX, v.x);
              maxY = Math.max(maxY, v.y);
              maxZ = Math.max(maxZ, v.z);

              allVertices.push(v.x, v.y, v.z);
            }
          }
        }
      });

      console.log(`Extracted ${allVertices.length / 3} total vertices.`);
      console.log(`Bounds: X[${minX.toFixed(2)}, ${maxX.toFixed(2)}], Y[${minY.toFixed(2)}, ${maxY.toFixed(2)}], Z[${minZ.toFixed(2)}, ${maxZ.toFixed(2)}]`);

      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const cz = (minZ + maxZ) / 2;

      const sizeX = maxX - minX;
      const sizeY = maxY - minY;
      const sizeZ = maxZ - minZ;
      const maxDim = Math.max(sizeX, sizeY, sizeZ);

      // Normalize scale so brain max dimension is 7.5 units
      const targetScale = 7.5 / maxDim;

      const centeredVertices = [];
      for (let i = 0; i < allVertices.length; i += 3) {
        centeredVertices.push(
          Number(((allVertices[i] - cx) * targetScale).toFixed(4)),
          Number(((allVertices[i + 1] - cy) * targetScale).toFixed(4)),
          Number(((allVertices[i + 2] - cz) * targetScale).toFixed(4))
        );
      }

      const outputData = {
        vertexCount: centeredVertices.length / 3,
        scale: targetScale,
        vertices: centeredVertices,
      };

      fs.writeFileSync(outputPath, JSON.stringify(outputData));
      console.log(`Wrote centered 3D brain mesh to ${outputPath} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);
      process.exit(0);
    },
    (err) => {
      console.error("Error parsing GLTF:", err);
      process.exit(1);
    }
  );
}

processBrainModel();
