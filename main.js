document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const addTreeButton = document.getElementById('add-tree-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    let treeModel;

    // Étape 1: Gérer le bouton de démarrage
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        addTreeButton.style.display = 'block'; // Affiche le bouton "Ajouter"
        scene.play();
    });

    // Étape 2: Charger le modèle 3D une seule fois
    const loadTreeModel = () => {
        return new Promise(resolve => {
            const tempContainer = document.createElement('a-entity');
            const model = document.createElement('a-gltf-model');
            model.setAttribute('src', './assets/forest.glb');
            model.setAttribute('scale', '0.5 0.5 0.5');
            model.setAttribute('rotation', '0 0 0');
            
            tempContainer.appendChild(model);
            
            model.addEventListener('model-loaded', () => {
                treeModel = tempContainer;
                resolve();
            });
            scene.appendChild(tempContainer);
        });
    };

    loadTreeModel().then(() => {
        // Le modèle est chargé, on peut l'utiliser
        addTreeButton.addEventListener('click', () => {
            // Créer une nouvelle instance de l'arbre
            const newTree = treeModel.cloneNode(true);
            
            // Récupérer la position du curseur
            const cursorPosition = cursor.object3D.position;
            const cameraPosition = camera.object3D.position;

            // Définir la position du nouvel arbre par rapport à la caméra
            newTree.object3D.position.set(
                cameraPosition.x + cursorPosition.x,
                cameraPosition.y + cursorPosition.y,
                cameraPosition.z + cursorPosition.z
            );
            
            scene.appendChild(newTree);
        });
    });
});
