// js/TreeInstancer.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class TreeInstancer {
  constructor(parent, count = 2500) {
    this.parent = parent;
    this.count  = count;
    this.loader = new GLTFLoader();
    this.health = new Float32Array(count); // 0 = mort, 1 = plein santé
    this.mesh   = null;
  }

  async loadModel(url) {
    const gltf = await this.loader.loadAsync(url);
    const geometry = gltf.scene.children[0].geometry; // on suppose 1 mesh low‑poly
    const material = new THREE.MeshStandardMaterial({color:0x4caf50});
    const dummy    = new THREE.Object3D();
    const spread   = 0.6; // 60 cm² de surface totale

    this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.count*3),3);

    for (let i = 0; i < this.count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * spread,
        0,
        (Math.random() - 0.5) * spread
      );
      dummy.scale.setScalar(0.1); // taille de base 10 cm
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
      this.health[i] = Math.random()*0.5 + 0.5; // départ moyen‑sain
      this._applyColor(i);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.parent.add(this.mesh);
  }

  // couleur = vert (sain) → brun (mort)
  _applyColor(idx) {
    const h = this.health[idx];
    const col = new THREE.Color().setHSL(0.33*h, 0.7, 0.4);
    this.mesh.instanceColor.setXYZ(idx, col.r, col.g, col.b);
  }

  // ------------------------------
  //  logique de croissance (simplifiée)
  // ------------------------------
  update(env, dt) {
    const growthRate = env.temp / 30;            // 0‑1
    const waterFactor = env.precip / 2000;       // 0‑1
    const co2Boost = env.co2_atm / 400;          // 0.75‑2

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.count; i++) {
      let h = this.health[i];
      const stress = Math.max(0, 1 - waterFactor) * 0.5; // pénalité d’eau
      h += dt * (growthRate * co2Boost * (1 - h) - stress);
      h = THREE.MathUtils.clamp(h, 0, 1);
      this.health[i] = h;

      // mise à jour de la hauteur (scale Y) et couleur
      this.mesh.getMatrixAt(i, dummy.matrix);
      dummy.scale.y = 0.1 + h * 0.5; // de 0,1 m à 0,6 m
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i, dummy.matrix);
      this._applyColor(i);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
  }

  // Statistiques affichées dans le panel UI
  getStats() {
    const total = this.count;
    const alive = this.health.filter(v => v > 0.1).length;
    const avg   = this.health.reduce((a,b)=>a+b,0) / total;
    const co2   = (avg * 10).toFixed(1);   // ~10 t CO2 / arbre plein santé (exemple)
    const water = (avg * 30).toFixed(1);   // ~30 mm d’évapotranspiration (exemple)
    return { total, alive, avgHealth: avg, co2Captured: co2, waterRecycled: water };
  }
}
