import * as THREE from "three";
import Utils from "../../utils";
import * as Colours from "../../properties/colours";

export default class BigStream {
    constructor(parentMesh) {
        const width = 2;
        const height = 0.5;
        const depth = height;

        let material = new THREE.MeshStandardMaterial({ color: Colours.River.Stream });
        let geometry = new THREE.BoxBufferGeometry(width, height, depth);
        let parentWidth = parentMesh.geometry.parameters.width;
        let parentHeight = parentMesh.geometry.parameters.height;
        let parentDepth = parentMesh.geometry.parameters.depth;
        const positionX = Utils.randomNumber(-parentWidth / 2 + width / 2, 0 - width / 2);
        const positionY = parentHeight / 2 - height / 2 - 0.1;
        const positionZ = Utils.randomNumber(-parentDepth / 2 + depth/2, parentDepth / 2 - depth/2);
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(positionX, positionY, positionZ);
        this.mesh.castShadow = false;
    }
}