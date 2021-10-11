import * as THREE from "three";

export default class Moon {
    constructor(positionX, positionY, positionZ, size) {
        const moonGeometry = new THREE.BoxGeometry(size, size, size);
        const moonLine = new THREE.LineSegments(new THREE.EdgesGeometry(moonGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));
        const moonMaterial = new THREE.MeshStandardMaterial({color: "rgb(123,123,121)"});
        this.mesh = new THREE.Mesh(moonGeometry, moonMaterial);

        this.mesh.add(moonLine);

        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;

        this.mesh.position.set(positionX, positionY, positionZ);
    }
}