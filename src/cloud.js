import * as THREE from "three";
import Utils from "./utils";
import * as Constants from "./constants";
import * as Colours from "./colours";

export default class Cloud {
    constructor() {
        this.cloudRandomMovementX = Utils.randomNumber(-Constants.Cloud.MoveSpeed, Constants.Cloud.MoveSpeed);
        this.cloudRandomMovementY = Utils.randomNumber(-Constants.Cloud.MoveSpeed, Constants.Cloud.MoveSpeed);
        this.cloudRandomMovementZ = Utils.randomNumber(-Constants.Cloud.MoveSpeed, Constants.Cloud.MoveSpeed);
        const cloudWidthHeightDepth = Utils.randomNumber(1, 4);
        const particlesInEachCloud = 3;

        const cloudRotation = Math.random() * (360);
        const cloudPositionX = Utils.randomNumber((-Constants.World.Width / 2) + cloudWidthHeightDepth, (Constants.World.Width / 2) - cloudWidthHeightDepth);
        const cloudPositionY = Utils.randomNumber(10, 15);
        const cloudPositionZ = Utils.randomNumber((-Constants.World.Depth / 2) + cloudWidthHeightDepth, (Constants.World.Depth / 2) - cloudWidthHeightDepth);

        this.particles = [];

        let cloudParticle = new CloudParticle(cloudWidthHeightDepth);
        this.particles[0] = cloudParticle;
        this.mesh = cloudParticle.mesh;

        for (let i = 0; i < particlesInEachCloud - 1; i++) {
            let cloudParticle = new CloudParticle(cloudWidthHeightDepth);
            this.particles[i + 1] = cloudParticle;
            this.mesh.add(cloudParticle.mesh);
        }

        this.mesh.position.set(cloudPositionX, cloudPositionY, cloudPositionZ);
        this.mesh.rotation.y = cloudRotation;
    }
}

class CloudParticle {
    constructor(cloudWidthHeightDepth) {
        const cloudMaterial = new THREE.MeshStandardMaterial({color: Colours.Cloud.Material});
        const cloudGeometry = new THREE.BoxGeometry(cloudWidthHeightDepth, cloudWidthHeightDepth, cloudWidthHeightDepth);

        this.mesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

        // set cloud to cast a shadow
        this.mesh.castShadow = true;

        const particlePositionX = Math.random() * Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);
        const particlePositionY = Math.random() * Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);
        const particlePositionZ = Math.random() * Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);

        this.mesh.position.set(particlePositionX, particlePositionY, particlePositionZ);

        this.mesh.material.transparent = true;
        this.mesh.material.opacity = Utils.randomNumber(0.3, 0.9);
        this.mesh.renderOrder = 2;

        this.movementXYZ = [];
        Utils.setObjectSpeed(this.movementXYZ, Constants.Cloud.ParticleMoveSpeed);
    }
}