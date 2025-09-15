document.addEventListener('DOMContentLoaded', () => {
    // Get references to your HTML elements
    const placeButton = document.getElementById('place-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    let treeModel = null;

    // DEFINE THE FUNCTION HERE, BEFORE IT'S CALLED
    const loadModel = () => {
        const modelElement = document.createElement('a-gltf-model');
        // Make sure this path is correct for your file
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

    // CALL THE FUNCTION HERE, AFTER IT HAS BEEN DEFINED
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