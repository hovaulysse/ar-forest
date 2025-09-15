document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const addTreeButton = document.getElementById('add-tree-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    let treeModel;

 //... (début du code)
    let treeModel;

    // Charger le modèle 3D une seule fois
    const loadTreeModel = () => {
        return new Promise(resolve => {
            const tempContainer = document.createElement('a-entity');
            const model = document.createElement('a-gltf-model');
            model.setAttribute('src', './assets/forest.glb');
            model.setAttribute('scale', '0.5 0.5 0.5');
            
            // Écoutez l'événement 'model-loaded' sur le modèle lui-même
            model.addEventListener('model-loaded', () => {
                treeModel = model.cloneNode(true); // Clone le modèle chargé
                resolve();
            });
            
            // Ajoutez temporairement le modèle à la scène pour le chargement
            tempContainer.appendChild(model);
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
