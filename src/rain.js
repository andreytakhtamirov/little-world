import * as THREE from "three";
import * as Colours from "./colours";

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

        const rainDropMaterial = new THREE.MeshStandardMaterial({color: Colours.Rain.Material});
        const rainDropGeometry = new THREE.BoxGeometry(rainDropWidthHeightDepth, rainDropWidthHeightDepth, rainDropWidthHeightDepth);
        const rainDropLine = new THREE.LineSegments(new THREE.EdgesGeometry(rainDropGeometry), new THREE.LineBasicMaterial({color: Colours.Rain.Outline}));

        this.mesh = new THREE.Mesh(rainDropGeometry, rainDropMaterial);
        this.mesh.add(rainDropLine);
        this.mesh.position.set(positionX, positionY, positionZ);
    }
}