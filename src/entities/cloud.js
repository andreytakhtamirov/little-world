import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Utils from "../utils";
import * as Constants from "../properties/constants";
import * as Colours from "../properties/colours";

export default class Cloud {
    constructor() {
        const cloudWidthHeightDepth = Utils.randomNumber(1, 4);
        const particlesInEachCloud = 3;

        const cloudRotation = Math.random() * (360);
        const cloudPositionX = Utils.randomNumber((-Constants.World.Width / 2) + cloudWidthHeightDepth, (Constants.World.Width / 2) - cloudWidthHeightDepth);
        const cloudPositionY = Utils.randomNumber(Constants.Cloud.ParticleMinHeight, Constants.Cloud.ParticleMaxHeight);
        const cloudPositionZ = Utils.randomNumber((-Constants.World.Depth / 2) + cloudWidthHeightDepth, (Constants.World.Depth / 2) - cloudWidthHeightDepth);

        this.group = new THREE.Group();

        for (let i = 0; i < particlesInEachCloud - 1; i++) {
            let cloudPart = new CloudPart(cloudWidthHeightDepth);
            this.group.add(cloudPart.mesh);
        }

        this.group.position.set(cloudPositionX, cloudPositionY, cloudPositionZ);
        this.group.rotation.y = cloudRotation;

        this.movement = 0;
        this.movementCounter = 0;

        this.snow = [];
        this.rain = [];

        this.resetMovement();
    }

    resetMovement() {
        this.movement = Utils.randomInteger(Constants.Cloud.ParticleMoveTimeOut / 2, Constants.Cloud.ParticleMoveTimeOut);
    }

    animate(parentWorld) {
        let newCloud = null;

        this.group.translateX(Constants.Cloud.WindSpeedX);
        this.group.translateY(Constants.Cloud.WindSpeedY);
        this.group.translateX(Constants.Cloud.WindSpeedZ);

        // Check if cloud lies outside of world borders
        if (this.group.position.x > parentWorld.mesh.geometry.parameters.width / 2
            || this.group.position.x < -parentWorld.mesh.geometry.parameters.width / 2
            || this.group.position.y > Constants.Cloud.ParticleMaxHeight || this.group.position.y < Constants.Cloud.ParticleMinHeight
            || this.group.position.z > parentWorld.mesh.geometry.parameters.depth / 2
            || this.group.position.z < -parentWorld.mesh.geometry.parameters.depth / 2) {
            for (let j = 0; j < this.group.children.length; j++) {
                this.group.children[j].geometry.dispose();
                this.group.children[j].material.dispose();
            }
            newCloud = new Cloud();
        }

        return newCloud;
    }
}

class CloudPart {
    constructor(cloudWidthHeightDepth) {
        const cloudMaterial = new THREE.MeshStandardMaterial({color: Colours.Cloud.Material});
        const cloudGeometry = new THREE.BoxGeometry(cloudWidthHeightDepth, cloudWidthHeightDepth, cloudWidthHeightDepth);

        this.mesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

        // set cloud to cast a shadow
        this.mesh.castShadow = true;

        const particlePositionX = Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);
        const particlePositionY = Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);
        const particlePositionZ = Utils.randomNumber(cloudWidthHeightDepth / 2, cloudWidthHeightDepth);

        this.mesh.position.set(particlePositionX, particlePositionY, particlePositionZ);

        this.mesh.material.transparent = true;
        this.mesh.material.opacity = Utils.randomNumber(0.2, 0.5);
        this.mesh.renderOrder = 2;

        const particleMovementX = Utils.randomNumber(-Constants.Cloud.ParticleMoveSpeed, Constants.Cloud.ParticleMoveSpeed);
        const particleMovementY = Utils.randomNumber(-Constants.Cloud.ParticleMoveSpeed, Constants.Cloud.ParticleMoveSpeed);
        const particleMovementZ = Utils.randomNumber(-Constants.Cloud.ParticleMoveSpeed, Constants.Cloud.ParticleMoveSpeed);

        let particle = this.mesh;

        let position = { x: particle.position.x, y: particle.position.y, z: particle.position.z };
        let moveForward = new TWEEN.Tween(position).to({
            x: particle.position.x + particleMovementX,
            y: particle.position.y + particleMovementY,
            z: particle.position.z + particleMovementZ
        }, 5000).onUpdate(function ({ x, y, z }) {
            particle.position.x = x;
            particle.position.y = y;
            particle.position.z = z;
        });

        let moveBackward = new TWEEN.Tween({ x: particle.position.x + particleMovementX, y: particle.position.y + particleMovementY, z: particle.position.z + particleMovementZ}).to({
            x: position.x,
            y: position.y,
            z: position.z
        }, 5000).onUpdate(function ({ x, y, z }) {
            particle.position.x = x;
            particle.position.y = y;
            particle.position.z = z;
        });

        moveForward.chain(moveBackward);
        moveBackward.chain(moveForward);
        moveForward.easing(TWEEN.Easing.Quadratic.In);
        moveBackward.easing(TWEEN.Easing.Quadratic.In);
        moveForward.start();
    }
}