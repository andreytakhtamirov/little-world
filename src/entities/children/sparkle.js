import * as THREE from "three";
import Utils from "../../utils";

export default class Sparkle {

    constructor(parentPositionVector, parentHeight) {
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
        const material = new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(255,213,0)")});

        let posX = Utils.randomNumber(-1.5, 1.5);
        let posY = Utils.randomNumber(-1.5, 1.5);
        let posZ = Utils.randomNumber(-1.5, 1.5);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.scale.set(0.01, 0.03, 0.01);
        this.mesh.material.transparent = true;
        this.mesh.material.flatShading = true;
        this.mesh.position.set(parentPositionVector.x + posX, parentPositionVector.y + parentHeight + posY, parentPositionVector.z + posZ);
    }
}