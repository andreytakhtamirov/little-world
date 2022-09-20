import * as THREE from "three";
import Utils from "../../utils";
import * as Colours from "../../properties/colours"

export default class Snow {
    constructor(parentMesh) {
        const width = 0.1;
        const height = 0.1;
        const depth = width;

        let snowMaterial = new THREE.MeshStandardMaterial({color: Colours.Snow.Material});
        let snowGeometry = new THREE.BoxBufferGeometry(width, height, depth);
        let parentWidth = parentMesh.geometry.parameters.width;
        let parentDepth = parentMesh.geometry.parameters.depth;
        const positionX = Utils.randomNumber(-parentWidth / 2, parentWidth / 2);
        const positionZ = Utils.randomNumber(-parentDepth / 2, parentDepth / 2);

        this.mesh = new THREE.Mesh(snowGeometry, snowMaterial);
        this.mesh.position.set(positionX, 0, positionZ);
        this.mesh.castShadow = true;
        this.fallSpeed = 0.05;
        this.timeOut = Utils.randomNumber(0, 100);
        this.hasCollided = false;
    }
}