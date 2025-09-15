document.addEventListener('DOMContentLoaded', () => {
    const placeButton = document.getElementById('place-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    let treeModel = null;

    // Fonction pour charger le modèle 3D une seule fois
    const loadModel = () => {
        const modelElement = document.createElement('a-gltf-model');
        modelElement.setAttribute('src', './assets/forest.glb');
        modelElement.setAttribute('scale', '0.5 0.5 0.5');
        modelElement.setAttribute('visible', 'false'); // Rendre invisible pendant le chargement
        
        return new Promise(resolve => {
            modelElement.addEventListener('model-loaded', () => {
                treeModel = modelElement.cloneNode(true); // Stocker le modèle chargé
                modelElement.remove(); // Supprimer l'élément temporaire
                resolve();
            });
            scene.appendChild(modelElement);
        });
    };

    // Attendre que le modèle soit chargé avant de rendre le bouton fonctionnel
    loadModel().then(() => {
        console.log("Modèle 3D chargé, le bouton est prêt.");
        
        // Attacher le "listener" au bouton après le chargement
        placeButton.addEventListener('click', () => {
            if (treeModel) {
                // Créer une nouvelle instance de l'arbre à placer
                const newTree = treeModel.cloneNode(true);
                
                // Récupérer la position du curseur
                const cursorPosition = cursor.object3D.position;
                const cameraPosition = camera.object3D.position;
                
                // Positionner le nouvel arbre sur la scène
                newTree.setAttribute('visible', 'true');
                newTree.object3D.position.set(
                    cameraPosition.x + cursorPosition.x,
                    cameraPosition.y + cursorPosition.y,
                    cameraPosition.z + cursorPosition.z
                );
                
                scene.appendChild(newTree);
                console.log("Un arbre a été placé !");
            }
        });
    });
});
