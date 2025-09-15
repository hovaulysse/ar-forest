document.addEventListener('DOMContentLoaded', () => {
    // 1. Déclarations des variables et des éléments
    const placeButton = document.getElementById('place-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    let treeModel = null;

    // 2. DÉFINITION DE LA FONCTION :
    // La fonction loadModel est déclarée ici, avant son utilisation.
    const loadModel = () => {
        const modelElement = document.createElement('a-gltf-model');
        modelElement.setAttribute('src', './assets/tree/tree.gltf');
        modelElement.setAttribute('scale', '0.5 0.5 0.5');
        modelElement.setAttribute('visible', 'false');

        return new Promise(resolve => {
            modelElement.addEventListener('model-loaded', () => {
                treeModel = modelElement.cloneNode(true);
                modelElement.remove();
                resolve();
            });
            scene.appendChild(modelElement);
        });
    };

    // 3. UTILISATION DE LA FONCTION :
    // La fonction est appelée ici.
    loadModel().then(() => {
        console.log("Modèle 3D chargé, le bouton est prêt.");

        placeButton.addEventListener('click', () => {
            if (treeModel) {
                const newTree = treeModel.cloneNode(true);
                const cursorPosition = cursor.object3D.position;
                const cameraPosition = camera.object3D.position;

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