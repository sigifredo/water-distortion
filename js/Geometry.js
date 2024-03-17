

import * as THREE from 'three';
import testFragmentShader from './shaders/test/fragment.glsl.js';
import testVertexShader from './shaders/test/vertex.glsl.js';

export default class Geometry {
    constructor(env) {
        this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.planeGeomety = new THREE.PlaneGeometry(1, 1);

        this.cubeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });
        this.planeMaterial = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide,
        });

        this.cubeMaterial.metalness = 0.2;
        this.cubeMaterial.roughness = 0.5;

        this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
        this.plane = new THREE.Mesh(this.planeGeomety, this.planeMaterial);

        this.cube.position.x = -0.7;
        this.plane.position.x = 0.7;

        env.scene.add(this.cube, this.plane);
    }

    update() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
    }
}
