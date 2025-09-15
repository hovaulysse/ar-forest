document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const treeContainer = document.getElementById('tree-container');
    const scene = document.querySelector('a-scene');

    // Étape 1 : Gérer le bouton de démarrage
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        scene.play();
    });

    // Étape 2 : Créer l'objet raycaster pour la détection de surface
    const raycaster = new THREE.Raycaster();
    const cursor = document.querySelector('[cursor]');

    scene.addEventListener('click', (event) => {
        if (!treeContainer.getAttribute('visible')) {
            // Uniquement si l'objet n'a pas encore été placé
            const newPosition = cursor.components.position.data;

            // Placer l'arbre à l'endroit pointé par le curseur
            treeContainer.setAttribute('position', `${newPosition.x} ${newPosition.y} ${newPosition.z}`);
            treeContainer.setAttribute('visible', 'true');
        }
    });

    // Étape 3 : Charger le modèle 3D
    const treeModel = document.createElement('a-gltf-model');
    treeModel.setAttribute('src', './assets/votre_modele_arbre.gltf'); // N'oubliez pas de remplacer
    treeModel.setAttribute('scale', '0.5 0.5 0.5');
    treeModel.setAttribute('rotation', '0 0 0');
    treeContainer.appendChild(treeModel);
});
