document.addEventListener('DOMContentLoaded', () => {
    // 1. DÉCLARATIONS DES VARIABLES ET ÉLÉMENTS
    const placeButton = document.getElementById('place-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');
    const previewObject = document.getElementById('preview-object');

    let treeModel = null;
    let arReady = false;

    // 2. DÉFINITION DE LA FONCTION POUR LA PRÉVISUALISATION
    AFRAME.registerComponent('transparent-gltf', {
        schema: {
            src: { type: 'string' },
            opacity: { type: 'number', default: 0.5 },
            color: { type: 'string', default: '#CCCCCC' }
        },
        init: function () {
            this.loader = new THREE.GLTFLoader();
        },
        update: function () {
            const data = this.data;
            if (!data.src) { return; }

            this.loader.load(data.src, (gltf) => {
                const model = gltf.scene;
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.material = new THREE.MeshLambertMaterial({
                            color: new THREE.Color(data.color),
                            transparent: true,
                            opacity: data.opacity,
                            depthWrite: false
                        });
                    }
                });
                this.el.setObject3D('model', model);
            });
        }
    });

    // 3. DÉFINITION DE LA FONCTION POUR CHARGER LE MODÈLE
    // Fonction définie AVANT son utilisation
    const loadModel = () => {
        const tempModelForLoading = document.createElement('a-gltf-model');
        tempModelForLoading.setAttribute('src', './assets/tree/tree.gltf');
        tempModelForLoading.setAttribute('visible', 'false');

        return new Promise(resolve => {
            tempModelForLoading.addEventListener('model-loaded', () => {
                treeModel = tempModelForLoading.cloneNode(true);
                tempModelForLoading.remove();
                resolve();
            });
            scene.appendChild(tempModelForLoading);
        });
    };

    // 4. LOGIQUE PRINCIPALE ET ÉVÉNEMENTS
    // Maintenant nous pouvons utiliser loadModel()
    loadModel().then(() => {
        console.log("Modèle 3D maître chargé.");

        scene.addEventListener('ar-tracking-found', () => {
            arReady = true;
            console.log("AR.js prêt, la prévisualisation est activée.");
            
            previewObject.setAttribute('transparent-gltf', {
                src: './assets/tree/tree.gltf',
                opacity: 0.6,
                color: '#888888'
            });
            previewObject.setAttribute('scale', '0.5 0.5 0.5');
            previewObject.setAttribute('visible', 'true');
        });

        scene.addEventListener('tick', () => {
            if (arReady && previewObject.getAttribute('visible')) {
                const cursorPosition = cursor.object3D.position;
                const cameraPosition = camera.object3D.position;
                
                previewObject.object3D.position.set(
                    cameraPosition.x + cursorPosition.x,
                    cameraPosition.y + cursorPosition.y,
                    cameraPosition.z + cursorPosition.z
                );
            }
        });

        placeButton.addEventListener('click', () => {
            if (treeModel && arReady) {
                const newTree = treeModel.cloneNode(true);
                const currentPreviewPos = previewObject.object3D.position;
                
                newTree.setAttribute('visible', 'true');
                newTree.object3D.position.copy(currentPreviewPos);
                
                scene.appendChild(newTree);
                console.log("Un arbre a été placé !");
            } else {
                console.warn("Impossible de placer l'objet.");
            }
        });
    });
});