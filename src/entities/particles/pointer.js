import * as THREE from "three";

export default class Pointer {

    constructor(parentPositionVector) {
        const front = Math.tan(Math.PI / 6)
        const back = Math.cos(Math.PI / 6)
        const vertices = [
            0, 1, 0,
            1, 0, front,
            -1, 0, front,
            0, 0, -back,
            0, -1, 0,
        ]
        const faces = [
            2, 1, 0,
            1, 3, 0,
            3, 2, 0,
            2, 4, 1,
            1, 4, 3,
            3, 4, 2,
        ]
        const geometry = new THREE.PolyhedronGeometry(vertices, faces, 20, 0);
        const material = new THREE.MeshBasicMaterial({color: new THREE.Color("#b77cf2")});

        let posX = 0;
        let posY = 20;
        let posZ = 0;

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.scale.set(0.05, 0.10, 0.05);
        this.mesh.material.transparent = true;
        this.mesh.material.flatShading = true;
        this.mesh.position.set(parentPositionVector.x + posX, posY, parentPositionVector.z + posZ);
    }
}