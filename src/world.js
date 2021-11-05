import * as THREE from "three";
import Utils from "./utils";
import * as Constants from "./constants";

export default class World {
    constructor() {
        const worldWidth = 30;
        const worldHeight = 1;
        const worldDepth = 30;

        const worldGeometry = new THREE.BoxGeometry(worldWidth, worldHeight, worldDepth);
        const grassMaterial = new THREE.MeshStandardMaterial({color: "rgb(19,45,13)"});
        let line = new THREE.LineSegments(new THREE.EdgesGeometry(worldGeometry), new THREE.MeshStandardMaterial({color: "rgb(34,34,34)"}));

        this.mesh = new THREE.Mesh(worldGeometry, grassMaterial);
        this.mesh.add(line);
        this.mesh.receiveShadow = true;
        this.numForests = Utils.randomInteger(Constants.Forest.MinCount, Constants.Forest.MaxCount)
    }
}