import * as THREE from 'three';

export default class Lights {
    constructor(env) {
        const ambient = new THREE.AmbientLight(0xb9d5ff, 0.5);
        env.scene.add(ambient);
    }
}
