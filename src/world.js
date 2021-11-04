import * as THREE from "three";
import Utils from "./utils";
import * as Constants from "./constants";

export default class World {
    constructor() {
        const worldWidth = 50;
        const worldHeight = 1;
        const worldDepth = 50;

        const worldGeometry = new THREE.BoxGeometry(worldWidth, worldHeight, worldDepth);
        const grassMaterial = new THREE.MeshStandardMaterial({color: "rgb(54,85,48)"});
        this.mesh = new THREE.Mesh(worldGeometry, grassMaterial);
        this.mesh.receiveShadow = true;
        this.numForests = Utils.randomInteger(Constants.Forest.MinCount, Constants.Forest.MaxCount)
    }
}