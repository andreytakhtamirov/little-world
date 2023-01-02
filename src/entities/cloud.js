import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Utils from "../utils";
import * as Constants from "../properties/constants";
import * as Colours from "../properties/colours";
import Rain from "./particles/rain";
import Snow from "./particles/snow";

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

    animate(parentWorld, weatherConditions) {
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

        if (weatherConditions === 'snowy') {
            this.animateSnow(parentWorld);
        } else if (weatherConditions === 'rainy') {
            this.animateRain(parentWorld);
        }

        return newCloud;
    }


    animateSnow(parentWorld) {
        let snow = this.snow;
        let parentCloud = this;
        let forests = parentWorld.forests;
        let snowProbability = Utils.randomInteger(1, 40);
        if (snowProbability === 1) {
            snow[snow.length] = new Snow(parentCloud.group.children[0]);
            parentCloud.group.add(snow[snow.length - 1].mesh);
        }

        for (let i = 0; i < snow.length; i++) {
            if (snow[i].timeOut > 0) {
                snow[i].timeOut--;
                continue;
            }
            if (!snow[i].hasCollided) {
                snow[i].mesh.translateY(-snow[i].fallSpeed);
            } else {
                continue;
            }

            if (Utils.detectCollision(snow[i].mesh, parentWorld.mesh)) {
                this.snowCollision(parentWorld, parentCloud, snow[i], 10);

                let collidedWithSnow = false;
                for (let j = 0; j < snow.length; j++) {
                    if (i === j || !snow[j].hasCollided) {
                        continue;
                    }
                    if (Utils.detectSnowCollision(snow[i].mesh, snow[j].mesh)) {
                        parentWorld.mesh.remove(snow[i].mesh);
                        snow[i].mesh.geometry.dispose();
                        snow[i].mesh.material.dispose();
                        collidedWithSnow = true;
                        snow[j].mesh.geometry.scale(1, 1, 1);
                        snow.splice(i, 1);
                        break;
                    }
                }
                if (collidedWithSnow) {
                    break;
                }

                continue;
            }

            for (let j = 0; j < forests.length; j++) {
                let trees = forests[j].trees;

                for (let k = 0; k < trees.length; k++) {
                    let treeLeaves = trees[k].mesh.children;

                    for (let m = 0; m < treeLeaves.length; m++) {
                        let treeLeaf = treeLeaves[m];

                        if (Utils.detectCollision(snow[i].mesh, treeLeaf)) {
                            this.snowCollision(parentWorld, parentCloud, snow[i], 5);

                            let collidedWithSnow = false;
                            for (let n = 0; n < snow.length; n++) {
                                if (i === n || !snow[n].hasCollided) {
                                    continue;
                                }
                                if (Utils.detectSnowCollision(snow[i].mesh, snow[n].mesh)) {
                                    parentWorld.mesh.remove(snow[i].mesh);
                                    snow[i].mesh.geometry.dispose();
                                    snow[i].mesh.material.dispose();
                                    collidedWithSnow = true;
                                    snow.splice(i, 1);
                                    break;
                                }
                            }
                            if (collidedWithSnow) {
                                break;
                            }
                            break;
                        }
                    }
                    if (snow[i] == null || snow[i].hasCollided) {
                        break;
                    }
                }
                if (snow[i] == null || snow[i].hasCollided) {
                    break;
                }
            }
        }
    }

    snowCollision(parentWorld, parentCloud, snowFlake, x, y = 1, z = x) {
        snowFlake.hasCollided = true;
        parentWorld.mesh.attach(snowFlake.mesh);
        parentCloud.group.remove(snowFlake.mesh);
        snowFlake.mesh.geometry.scale(x, y, z);
        snowFlake.mesh.updateMatrix();
    }

    animateRain(parentWorld) {
        let rain = this.rain;
        let parentCloud = this;
        let forests = parentWorld.forests;
        let rainProbability = Utils.randomInteger(1, 10);
        if (rainProbability === 1) {
            rain[rain.length] = new Rain(parentCloud.group.children[0]);
            parentCloud.group.add(rain[rain.length - 1].mesh);
        }

        for (let i = 0; i < rain.length; i++) {
            if (rain[i].timeOut > 0) {
                rain[i].timeOut--;
                continue;
            }
            if (!rain[i].hasCollided) {
                rain[i].mesh.translateY(-rain[i].fallSpeed);
            } else {
                continue;
            }

            if (Utils.detectCollision(rain[i].mesh, parentWorld.mesh)) {
                parentCloud.group.remove(rain[i].mesh);
                rain[i].mesh.geometry.dispose();
                rain[i].mesh.material.dispose();
                rain.splice(i, 1);
                continue;
            }

            for (let j = 0; j < forests.length; j++) {
                let trees = forests[j].trees;

                for (let k = 0; k < trees.length; k++) {
                    let treeLeaves = trees[k].mesh.children;

                    for (let m = 0; m < treeLeaves.length; m++) {
                        let treeLeaf = treeLeaves[m];

                        if (Utils.detectCollision(rain[i].mesh, treeLeaf)) {
                            parentCloud.group.remove(rain[i].mesh);
                            rain[i].mesh.geometry.dispose();
                            rain[i].mesh.material.dispose();
                            rain.splice(i, 1);
                            break;
                        }
                    }
                    if (rain[i] == null) {
                        break;
                    }
                }
                if (rain[i] == null) {
                    break;
                }
            }
        }
    }
}

class CloudPart {
    constructor(cloudWidthHeightDepth) {
        const cloudMaterial = new THREE.MeshStandardMaterial({ color: Colours.Cloud.Material });
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

        let moveBackward = new TWEEN.Tween({ x: particle.position.x + particleMovementX, y: particle.position.y + particleMovementY, z: particle.position.z + particleMovementZ }).to({
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