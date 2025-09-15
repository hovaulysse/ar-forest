document.addEventListener('DOMContentLoaded', () => {
    // Étape 1 : Obtenez les références de vos éléments HTML
    const placeButton = document.getElementById('place-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    let treeModel = null;

    // Étape 2 : Définissez la fonction loadModel ici
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

    // Étape 3 : Appelez la fonction loadModel une fois qu'elle est définie
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