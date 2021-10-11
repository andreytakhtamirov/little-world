import * as THREE from "three";

export default class World {
    constructor() {
        const worldWidth = 50;
        const worldHeight = 1;
        const worldDepth = 50;

        const worldGeometry = new THREE.BoxGeometry(worldWidth, worldHeight, worldDepth);
        const worldLine = new THREE.LineSegments(new THREE.EdgesGeometry(worldGeometry), new THREE.LineBasicMaterial({color: "rgb(71,47,37)"}));
        const grassMaterial = new THREE.MeshStandardMaterial({color: "rgb(54,85,48)"});
        this.mesh = new THREE.Mesh(worldGeometry, grassMaterial);
        this.mesh.receiveShadow = true;
        this.mesh.add(worldLine);
    }
}