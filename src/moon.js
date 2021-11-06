import * as THREE from "three";
import * as Colours from "./colours";

export default class Moon {
    constructor(positionX, positionY, positionZ, size) {
        const moonGeometry = new THREE.BoxGeometry(size, size, size);
        const moonLine = new THREE.LineSegments(new THREE.EdgesGeometry(moonGeometry), new THREE.LineBasicMaterial({color: Colours.Moon.Outline}));
        const moonMaterial = new THREE.MeshStandardMaterial({color: Colours.Moon.Material});
        this.mesh = new THREE.Mesh(moonGeometry, moonMaterial);

        this.mesh.add(moonLine);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.position.set(positionX, positionY, positionZ);
    }
}