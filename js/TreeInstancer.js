import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class TreeInstancer {
  constructor(parent, count){
    this.parent = parent;
    this.count = count;
    this.loader = new GLTFLoader();
    this.health = new Float32Array(count); // 0‑1
    this.mesh = null;
  }

  async loadModel(url){
    const gltf = await this.loader.loadAsync(url);
    const geometry = gltf.scene.children[0].geometry; // on suppose un seul mesh
    const material = new THREE.MeshStandardMaterial({color:0x4caf50});
    const dummy = new THREE.Object3D();
    const spread = 0.6;

    this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.count*3),3);

    for(let i=0;i<this.count;i++){
      dummy.position.set(
        (Math.random()-0.5)*spread,
        0,
        (Math.random()-0.5)*spread
      );
      dummy.scale.setScalar(0.1);   // taille de base 10 cm
      dummy.updateMatrix();
      this.mesh.setMatrixAt(i,dummy.matrix);
      this.health[i] = Math.random()*0.5+0.5;
      this._applyColor(i);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.parent.add(this.mesh);
  }

  _applyColor(idx){
    const h = this.health[idx];
    const col = new THREE.Color().setHSL(0.33*h,0.7,0.4);
    this.mesh.instanceColor.setXYZ(idx,col.r,col.g,col.b);
  }

  // ------- logique de croissance (déjà décrite dans le premier message) -------
  update(env,dt){ /* … même code que précédemment … */ }

  getStats(){ /* … même code que précédemment … */ }
}
