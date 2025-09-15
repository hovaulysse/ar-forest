document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const treeContainer = document.getElementById('tree-container');
    const scene = document.querySelector('a-scene');

    // Étape 1 : Gérer le bouton de démarrage
    startButton.addEventListener('click', () => {
        // Cache le bouton
        startButton.style.display = 'none';
        // Active la scène AR
        scene.play();
    });

    // Étape 2 : Gérer l'événement de tap sur l'écran pour placer l'arbre
    scene.addEventListener('arjs-loaded', () => {
        scene.addEventListener('click', (event) => {
            // Obtenez la position du clic
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, scene.camera);

            const intersects = raycaster.intersectObjects(scene.children, true);

            // Si la détection de plan a fonctionné, placez l'arbre
            if (intersects.length > 0) {
                const intersect = intersects[0];
                const newPosition = intersect.point;
                treeContainer.setAttribute('position', `${newPosition.x} ${newPosition.y} ${newPosition.z}`);
                treeContainer.setAttribute('visible', 'true');
            }
        });
    });

    // Étape 3 : Charger le modèle 3D
    const treeModel = document.createElement('a-gltf-model');
    treeModel.setAttribute('src', './assets/votre_modele_arbre.gltf'); // Remplacez par le nom de votre fichier
    treeModel.setAttribute('scale', '0.5 0.5 0.5'); // Ajustez la taille
    treeModel.setAttribute('rotation', '0 0 0'); // Rotation par défaut
    treeContainer.appendChild(treeModel);
});
