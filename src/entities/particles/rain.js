import * as THREE from "three";
import Utils from "../../utils";
import * as Colours from "../../properties/colours";

export default class RainDrop {
    constructor(parentMesh) {
        const width = 0.1;
        const height = 0.3;
        const depth = width;

        let material = new THREE.MeshStandardMaterial({color: Colours.Rain.Material});
        let geometry = new THREE.BoxGeometry(width, height, depth);
        let parentWidth = parentMesh.geometry.parameters.width;
        let parentDepth = parentMesh.geometry.parameters.depth;
        const positionX = Utils.randomNumber(-parentWidth / 2, parentWidth / 2);
        const positionZ = Utils.randomNumber(-parentDepth / 2, parentDepth / 2);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(positionX, 0, positionZ);
        this.mesh.castShadow = true;
        this.fallSpeed = 0.4;
        this.timeOut = Utils.randomNumber(0, 10);
        this.hasCollided = false;
    }
}