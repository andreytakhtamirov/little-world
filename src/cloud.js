import * as THREE from "three";
import Utils from "./utils";

export default class Cloud {
    constructor(cloudParticles, worldReference) {
        const cloudWidthHeightDepth = Utils.randomNumber(2, 5);
        const particlesInEachCloud = 3;

        const cloudRotation = Math.random() * (180);
        const cloudPositionX = Math.random() * (worldReference.geometry.parameters.width / 2 - cloudWidthHeightDepth) + 1;
        const cloudPositionY = Utils.randomNumber(10, 15);
        const cloudPositionZ = Math.random() * (worldReference.geometry.parameters.width / 2 - cloudWidthHeightDepth) + 1;

        this.cloudParticle = new CloudParticle(cloudWidthHeightDepth);
        cloudParticles[0] = this.cloudParticle.mesh;
        this.mesh = this.cloudParticle.mesh;

        for (let i = 0; i < particlesInEachCloud - 1; i++) {
            this.cloudParticle = new CloudParticle(cloudWidthHeightDepth);
            cloudParticles[i + 1] = this.cloudParticle.mesh;
            this.mesh.add(this.cloudParticle.mesh);
        }

        this.mesh.position.set(cloudPositionX, cloudPositionY, cloudPositionZ);
        this.mesh.rotation.y = cloudRotation;

        return this.mesh;
    }
}

class CloudParticle {
    constructor(cloudWidthHeightDepth) {
        const cloudMaterial = new THREE.MeshLambertMaterial({color: "rgb(213,213,213)"});
        const cloudGeometry = new THREE.BoxGeometry(cloudWidthHeightDepth, cloudWidthHeightDepth, cloudWidthHeightDepth);

        this.mesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

        const cloudLine = new THREE.LineSegments(new THREE.EdgesGeometry(cloudGeometry), new THREE.LineBasicMaterial({color: "rgb(170,170,170)"}));

        // set cloud to cast a shadow
        this.mesh.castShadow = true;

        // Hide cloud outline to save memory!!
        //this.cloudParticle.add(cloudLine);

        const particlePositionX = Math.random() * Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);
        const particlePositionY = Math.random() * Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);
        const particlePositionZ = Math.random() * Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);

        this.mesh.position.set(particlePositionX, particlePositionY, particlePositionZ);

        this.mesh.material.transparent = true;
        this.mesh.material.opacity = 0.9;
    }
}