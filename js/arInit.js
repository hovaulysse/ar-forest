// arInit.js – point d’entrée
import * as THREE from 'three';
import { Environment } from './Environment.js';
import { TreeInstancer } from './TreeInstancer.js';
import { Controls } from './Controls.js';

// ---------- 1️⃣ Scène, lumière ----------
const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dir = new THREE.DirectionalLight(0xffffff, 0.6);
dir.position.set(5, 10, 5);
scene.add(dir);

// ---------- 2️⃣ AR.js ----------
const arSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
arSource.init(() => onResize());

function onResize(){
  arSource.onResizeElement();
  arSource.copySizeTo(renderer.domElement);
}
const arContext = new THREEx.ArToolkitContext({
  detectionMode: 'mono_and_matrix',
  matrixCodeType: '3x3',
});
arContext.init(() => {
  camera.projectionMatrix.copy(arContext.getProjectionMatrix());
});

const markerRoot = new THREE.Group();
scene.add(markerRoot);
new THREEx.ArMarkerControls(arContext, markerRoot, {
  type: 'pattern',
  patternUrl: 'assets/marker.patt',
});

// ---------- 3️⃣ Renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
const camera = new THREE.Camera();
scene.add(camera);

// ---------- 4️⃣ Chargement du modèle (export de Womp) ----------
const forest = new TreeInstancer(markerRoot, 2500); // on crée l'instancing avant le chargement
forest.loadModel('assets/forest.glb'); // <‑‑ fichier exporté depuis Womp

// ---------- 5️⃣ Environnement + UI ----------
const env = new Environment();                 // variables climatiques
new Controls(env, forest);                     // lie les sliders aux variables

// ---------- 6️⃣ Boucle d’animation ----------
let last = performance.now();
function animate(now){
  requestAnimationFrame(animate);
  const dt = (now - last) / 1000;
  last = now;

  if (arSource.ready !== false) arContext.update(arSource.domElement);

  if (markerRoot.visible) forest.update(env, dt); // simulation seulement quand le marqueur est vu

  renderer.render(scene, camera);
}
animate();
