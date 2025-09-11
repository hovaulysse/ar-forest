// js/arInit.js
// <-- Remplacez les imports « bare » par des URLs CDN
import * as THREE                   from './three.module.js';
import { GLTFLoader }               from './GLTFLoader.js';
import { ARjs }                     from './ar-threex.mjs';
// Vos propres modules (Ils restent en import relatif)
import { Environment }   from './Environment.js';
import { TreeInstancer } from './TreeInstancer.js';
import { Controls }      from './Controls.js';

// … le reste du fichier reste identique …

let scene, camera, renderer, arSource, arContext, markerRoot;
let forest, env;

// ------------------------------------------------------------------
// 1️⃣ Initialise la scène Three.js
// ------------------------------------------------------------------
function initScene() {
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(5, 10, 5);
  scene.add(dir);

  camera = new THREE.Camera();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

// ------------------------------------------------------------------
// 2️⃣ Initialise AR.js (marqueur)
// ------------------------------------------------------------------
function initAR() {
  arSource = new THREEx.ArToolkitSource({ sourceType:'webcam' });

  // → on ne lance pas encore la caméra (attente du bouton)
  // c’est le `startAr` qui appellera `arSource.init(...)`

  arContext = new THREEx.ArToolkitContext({
    detectionMode:'mono_and_matrix',
    matrixCodeType:'3x3'
  });

  markerRoot = new THREE.Group();
  scene.add(markerRoot);
  new THREEx.ArMarkerControls(arContext, markerRoot, {
    type:'pattern',
    patternUrl:'assets/marker.patt'   // ← fichier généré depuis marker.png
  });
}

// ------------------------------------------------------------------
// 3️⃣ Crée la forêt (instancing) et l’environnement
// ------------------------------------------------------------------
function initForest() {
  forest = new TreeInstancer(markerRoot, 2500);
  forest.loadModel('assets/forest.glb');   // ← modèle exporté depuis Womp

  env = new Environment();
  new Controls(env, forest);               // UI ↔ environnement
}

// ------------------------------------------------------------------
// 4️⃣ Gestion du redimensionnement (important sur mobile)
// ------------------------------------------------------------------
function onResize(){
  arSource.onResizeElement();
  arSource.copySizeTo(renderer.domElement);
}

// ------------------------------------------------------------------
// 5️⃣ Boucle d’animation
// ------------------------------------------------------------------
let last = performance.now();
function animate(now){
  requestAnimationFrame(animate);
  const dt = (now - last) / 1000;   // secondes
  last = now;

  // Si la webcam a été activée (see start button) : mise à jour ARCore/ARKit
  if (arSource.ready) arContext.update(arSource.domElement);

  // La forêt ne se calcule que lorsque le marqueur est visible
  if (markerRoot.visible) forest.update(env, dt);

  renderer.render(scene, camera);
}

// ------------------------------------------------------------------
// 6️⃣ Bouton « Démarrer AR » (gesture requis sur iOS)
// ------------------------------------------------------------------
function bindStartButton(){
  const btn = document.getElementById('startAr');
  btn.addEventListener('click', () => {
    // Démarrage réel de la webcam (c’est un geste utilisateur → OK iOS)
    arSource.init(() => onResize());

    // UI : masquer le bouton, afficher le panel de contrôle
    btn.style.display = 'none';
    document.getElementById('ui').classList.remove('hidden');
  });
}

// ------------------------------------------------------------------
// 7️⃣ Entrée principale
// ------------------------------------------------------------------
function main(){
  initScene();
  initAR();
  initForest();
  bindStartButton();
  animate();               // démarre la boucle
}
main();
