document.addEventListener('DOMContentLoaded', () => {
    const mainButton = document.getElementById('main-button');
    const statusMessage = document.getElementById('status-message');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');

    let treeModel = null;
    let placementEnabled = false;

    // Étape 1 : Charger le modèle 3D une seule fois
//... (start of code)
    let treeModel = null; // Declaration is only here

    // Étape 1 : Charger le modèle 3D une seule fois
    const loadTreeModel = () => {
        return new Promise(resolve => {
            const tempModel = document.createElement('a-gltf-model');
            tempModel.setAttribute('src', './assets/forest.glb');
            tempModel.setAttribute('scale', '0.5 0.5 0.5');
            tempModel.setAttribute('visible', 'false');

            tempModel.addEventListener('model-loaded', () => {
                treeModel = tempModel.cloneNode(true); // Assign value, no 'let' or 'const'
                tempModel.remove();
                resolve();
            });

            scene.appendChild(tempModel);
        });
    };
    //... (rest of the code)
    // Étape 2 : Gérer le clic sur le bouton principal
    mainButton.addEventListener('click', () => {
        if (!placementEnabled) {
            // Première phase : Initialiser l'expérience
            mainButton.style.display = 'none'; // Cache le bouton de démarrage
            statusMessage.textContent = 'Déplacez votre téléphone pour détecter une surface.';
            
            // Attendre la détection d'une surface pour changer le message
            scene.addEventListener('ar-tracking-found', () => {
                statusMessage.textContent = 'Dirigez le point blanc vers le sol, puis cliquez pour placer l\'arbre.';
                mainButton.style.display = 'block'; // Affiche le bouton "Placer"
                mainButton.textContent = 'Placer un arbre';
                placementEnabled = true;
            });
            
            loadTreeModel();

        } else {
            // Deuxième phase : Placer un arbre
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
                statusMessage.textContent = 'Arbre placé ! Vous pouvez en ajouter un autre.';
            }
        }
    });

    // Optionnel : Afficher un message d'erreur si l'accès à la caméra échoue
    window.addEventListener('error', (e) => {
        if (e.message.includes('permission denied')) {
            statusMessage.textContent = 'Erreur : l\'accès à la caméra a été refusé.';
        }
    });
});
