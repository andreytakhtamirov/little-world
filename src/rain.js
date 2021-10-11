import * as THREE from "three";

export default class Rain {
    constructor() {
        // TODO Add multiple raindrop creation
        this.mesh = new RainDrop().mesh;
    }
}

class RainDrop {
    constructor() {
        const rainDropWidthHeightDepth = 1;
        const positionX = Math.random() * (8 + 4) - 4;
        const positionY = 0;
        const positionZ = Math.random() * (8 + 4) - 4;

        const rainDropMaterial = new THREE.MeshStandardMaterial({color: "rgb(107,201,255)"});
        const rainDropGeometry = new THREE.BoxGeometry(rainDropWidthHeightDepth, rainDropWidthHeightDepth, rainDropWidthHeightDepth);

        this.mesh = new THREE.Mesh(rainDropGeometry, rainDropMaterial);

        const rainDropLine = new THREE.LineSegments(new THREE.EdgesGeometry(rainDropGeometry), new THREE.LineBasicMaterial({color: "rgb(1,45,116)"}));

        this.mesh.add(rainDropLine);

        this.mesh.position.set(positionX, positionY, positionZ);
    }
}