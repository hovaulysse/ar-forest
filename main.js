document.addEventListener('DOMContentLoaded', () => {
    const placeButton = document.getElementById('place-button');
    const scene = document.querySelector('a-scene');
    const camera = document.querySelector('a-camera');
    const cursor = document.querySelector('[cursor]');
    const previewObject = document.getElementById('preview-object'); // Référence à l'entité de prévisualisation

    let treeModel = null; // Le modèle 3D réel, une fois chargé
    let arReady = false; // Pour savoir si AR.js a détecté une surface

    // --- Composant A-Frame personnalisé pour la transparence ---
    // Cela nous permet de rendre le modèle de prévisualisation semi-transparent.
    AFRAME.registerComponent('transparent-gltf', {
        schema: {
            src: { type: 'string' },
            opacity: { type: 'number', default: 0.5 },
            color: { type: 'string', default: '#CCCCCC' } // Couleur grise par défaut
        },
        init: function () {
            this.model = null;
            this.loader = new THREE.GLTFLoader();
        },
        update: function () {
            const data = this.data;
            if (!data.src) { return; }

            this.loader.load(data.src, (gltf) => {
                this.model = gltf.scene;
                this.model.traverse((node) => {
                    if (node.isMesh) {
                        node.material = new THREE.MeshLambertMaterial({ // Utiliser Lambert pour la couleur
                            color: new THREE.Color(data.color),
                            transparent: true,
                            opacity: data.opacity,
                            depthWrite: false // Important pour un bon rendu de la transparence
                        });
                    }
                });
                this.el.setObject3D('model', this.model);
            });
        }
    });

    // --- Fonction pour charger le modèle 3D ---
    const loadModel = () => {
        // Nous chargeons le modèle une seule fois pour l'utiliser comme "copie maître"
        // Le modèle est temporairement ajouté à la scène pour que 'model-loaded' se déclenche
        const tempModelForLoading = document.createElement('a-gltf-model');
        tempModelForLoading.setAttribute('src', './assets/tree/tree.gltf');
        tempModelForLoading.setAttribute('visible', 'false'); // Invisible pendant le chargement

        return new Promise(resolve => {
            tempModelForLoading.addEventListener('model-loaded', () => {
                treeModel = tempModelForLoading.cloneNode(true); // Copie pour les placements futurs
                tempModelForLoading.remove(); // Enlève le temporaire
                resolve();
            });
            scene.appendChild(tempModelForLoading);
        });
    };

    // --- Initialisation et événements ---
    loadModel().then(() => {
        console.log("Modèle 3D maître chargé.");

        // Attendre que AR.js soit prêt et détecte une surface
        scene.addEventListener('ar-tracking-found', () => {
            arReady = true;
            console.log("AR.js prêt et surface détectée. La prévisualisation est activée.");

            // Ajouter le modèle de prévisualisation à l'entité #preview-object
            // et utiliser notre composant transparent-gltf
            previewObject.setAttribute('transparent-gltf', {
                src: './assets/tree/tree.gltf',
                opacity: 0.6, // Semi-transparent
                color: '#888888' // Couleur grise
            });
            previewObject.setAttribute('scale', '0.5 0.5 0.5'); // Assurez-vous d'avoir la même échelle
            previewObject.setAttribute('visible', 'true'); // Rendre la prévisualisation visible
        });

        // Mettre à jour la position de l'objet de prévisualisation pour qu'il suive le curseur
        // On utilise un composant A-Frame pour la position du curseur
        // Il est mis à jour à chaque "tick" de la scène pour suivre le curseur
        scene.addEventListener('tick', () => {
            if (arReady && previewObject.getAttribute('visible')) {
                const cursorPosition = cursor.object3D.position;
                const cameraPosition = camera.object3D.position;
                
                // Positionnement de la prévisualisation
                previewObject.object3D.position.set(
                    cameraPosition.x + cursorPosition.x,
                    cameraPosition.y + cursorPosition.y,
                    cameraPosition.z + cursorPosition.z
                );
            }
        });

        // Gérer le clic sur le bouton "Placer l'objet"
        placeButton.addEventListener('click', () => {
            if (treeModel && arReady) {
                const newTree = treeModel.cloneNode(true); // Clone le modèle maître