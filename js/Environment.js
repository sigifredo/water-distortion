

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'lil-gui';

export default class Environment {
    /**
     *
     * @param {*} debugMode La variable toma los valores de "Verdadero" o "Falso" y determina si se muestra el gui de debug.
     */
    constructor(debugMode) {

        const canvasSize = {
            height: window.innerHeight,
            width: window.innerWidth
        };

        // class members
        this.camera = new THREE.PerspectiveCamera(75, canvasSize.width / canvasSize.height);
        this.canvas = document.querySelector('canvas.webgl');
        this.renderer = null;
        this.scene = new THREE.Scene();
        this.textureLoader = new THREE.TextureLoader();
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.clock = new THREE.Clock();
        this.elapsedTime = 0;

        if (debugMode) {
            this.gui = new dat.GUI();
        } else {
            this.gui = null;
        }

        // init members
        this.camera.position.set(0, 0, 2);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(canvasSize.width, canvasSize.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.render(this.scene, this.camera);
        this.controls.enabled = true;
        this.controls.enableDamping = true;

        // #region listeners
        const self = this;

        window.addEventListener('resize', () => {
            self.canvas.height = window.innerHeight;
            self.canvas.width = window.innerWidth;

            self.camera.aspect = self.canvas.width / self.canvas.height;
            self.camera.updateProjectionMatrix();

            self.renderer.setSize(self.canvas.width, self.canvas.height);
            self.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
        window.addEventListener('dblclick', () => {
            const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

            if (fullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            } else {
                if (self.canvas.requestFullscreen) {
                    self.canvas.requestFullscreen();
                }
                else if (self.canvas.webkitRequestFullscreen) {
                    self.canvas.webkitRequestFullscreen();
                }
            }
        });
        // #endregion
    }

    render() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.elapsedTime;
        this.elapsedTime = elapsedTime;

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}
