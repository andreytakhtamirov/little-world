import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Sun from "./sun"
import Forest from "./forest";
import Utils from "./utils";
import Cloud from "./cloud";
import World from "./world";
import * as Constants from "./constants";
import Stats from "three/examples/jsm/libs/stats.module";
import Weather from "./weather";
import Snow from "./snow";
import Player from "./player";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';

class App extends Component {
    componentDidMount() {
        window.addEventListener('resize', onWindowResize);
        initializeWorld();
    }

    render() {
        return (
            <div ref={(mount) => {
            }}/>
        )
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);

var stats;
var scene;
var camera;
var renderer;
var animationActive;
var weather;

function initializeWorld() {
    animationActive = true;
    let worlds = [];

    let randomWeather = Utils.randomInteger(1, 5);
    weather = new Weather(randomWeather);

    scene = new THREE.Scene();
    scene.background = weather.sceneBackground;

    let light = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(light);

    for (let i = 0; i < weather.ambientLights.length; i++) {
        scene.add(weather.ambientLights[i]);
    }

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, Constants.World.Width * Constants.World.Depth * Constants.World.SidesCount);
    renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance"});
    if (window.screen.width * window.devicePixelRatio > Constants.Page.ResolutionWidth) {
        Constants.Page.ResolutionRatio = Constants.Page.ResolutionWidth / (window.screen.width * window.devicePixelRatio);
    }

    // Show stats (framerate)
    stats = new Stats();
    document.body.appendChild(stats.dom);

    // const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio * Constants.Page.ResolutionRatio);
    renderer.shadowMapEnabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rootElement.appendChild(renderer.domElement);

    const worldWidth = Constants.World.Width;
    const worldDepth = Constants.World.Depth;

    // Set up tiled world
    for (let i = 0; i < Constants.World.SidesCount; i++) {
        worlds[i] = new World(weather);
        if (i === 0) {
            scene.add(worlds[0].mesh);
        } else {
            if (i % 8 === 0) {
                worlds[i].mesh.position.set(worldWidth, 0, worldDepth);
            } else if (i % 7 === 0) {
                worlds[i].mesh.position.set(0, 0, worldDepth);
            } else if (i % 6 === 0) {
                worlds[i].mesh.position.set(-worldWidth, 0, worldDepth);
            } else if (i % 5 === 0) {
                worlds[i].mesh.position.set(worldWidth, 0, 0);
            } else if (i % 4 === 0) {
                worlds[i].mesh.position.set(worldWidth, 0, -worldDepth);
            } else if (i % 3 === 0) {
                worlds[i].mesh.position.set(0, 0, -worldDepth);
            } else if (i % 2 === 0) {
                worlds[i].mesh.position.set(-worldWidth, 0, 0);
            } else if (i % 2 - 1 === 0) {
                worlds[i].mesh.position.set(-worldWidth, 0, -worldDepth);
            }
            worlds[0].mesh.add(worlds[i].mesh);
        }
    }

    let star1 = new Sun(70, 100, 0, 50, weather.sunColour, 1);
    scene.add(star1.light);

    //light helper
    // const helper = new THREE.CameraHelper(star1.light.shadow.camera);
    // scene.add(helper);

    // Set up forests, clouds, and rain/snow for each world plane
    for (let i = 0; i < Constants.World.SidesCount; i++) {
        for (let j = 0; j < worlds[i].numForests; j++) {
            let forest = new Forest(Constants.Forest.TreesCount - 1, weather);
            worlds[i].forests.push(forest.group);
            worlds[i].mesh.add(forest.group);
        }
        if (weather.conditions === 'snowy') {
            // temporary as snow from different clouds will keep stacking
            worlds[i].numClouds = 1;
        }
        for (let j = 0; j < worlds[i].numClouds; j++) {
            let cloud = new Cloud();
            worlds[i].clouds.push(cloud);
            worlds[i].mesh.add(cloud.group);
        }
    }
    // camera.position.set(0, worldDepth * 1.2, worldWidth * 1.4);
    // camera.rotation.set(Utils.getRadians(-40), 0, 0);
    camera.position.set(0, worldDepth * 1.7, worldWidth * 0.6);
    camera.rotation.set(Utils.getRadians(-70), 0, 0);
    light.position.copy(camera.position);
    light.rotation.copy(camera.rotation);
    //controls.update();

    document.addEventListener("pagehide", function () {
        cancelAnimationFrame(animate);
        animationActive = false;
    });

    document.addEventListener("pageshow", function () {
        animationActive = true;
    });

    // controls.addEventListener('change', function () {
    //     light.position.copy(camera.position);
    // });

    let player
    const mtlLoader = new MTLLoader();
    mtlLoader.load("/models/beaver.mtl", mtlParseResult => {
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtlParseResult);
        objLoader.load("/models/beaver.obj", function (obj) {
            obj.scale.set(1.1, 1.1, 1.1);
            obj.translateY(0.5);
            obj.translateX(0.5);
            obj.translateZ(0.5);

            obj.traverse(function (child) {
                child.castShadow = true;
            });

            player = new Player(obj, camera);
            worlds[0].mesh.add(player.mesh);
        });
    });


    let animate = function () {
        TWEEN.update();

        if (!animationActive) {
            // prevent multiple animate() calls when switching to/from tab quickly
            return;
        }
        requestAnimationFrame(animate);

        if (stats != null) {
            stats.update();
        }

        for (let i = 0; i < worlds.length; i++) {
            animateClouds(worlds[i]);
            detectPlayerHits(player, worlds[i]);
        }

        // console.log("x:" + camera.position.x);
        // console.log("y:" + camera.position.y);
        // console.log("z:" + camera.position.z);

        renderer.render(scene, camera);
    };
    animate();
}

function detectPlayerHits(player, world) {
    if (player == null || !player.isHitting) {
        return;
    }
    let forests = world.forests;

    let closestTree = null;
    let closestHitDistance = 0; // closest distance will be the largest one

    for (let i = 0; i < forests.length; i++) {
        let trees = forests[i].children;

        for (let j = 0; j < trees.length; j++) {
            let tree = trees[j];

            let distance = distanceFromPointToCircle(player.hitBox, player.mesh, tree);
            if (distance > 0 && distance > closestHitDistance) {
                closestHitDistance = distance;
                closestTree = tree;
            }
        }
    }

    if (closestTree != null) {
        player.isHitting = false;
        closestTree.parent.remove(closestTree);
    }
}

function animateClouds(parentWorld) {
    let clouds = parentWorld.clouds;

    // ---------------- SNOW MOVEMENT ---------------- //
    if (weather.conditions === 'snowy') {
        for (let i = 0; i < clouds.length; i++) {
            animateSnow(parentWorld, clouds, clouds[i].snow);
        }
    }

    // ---------------- WHOLE CLOUD MOVEMENT ---------------- //ss
    for (let i = 0; i < clouds.length; i++) {
        let cloud = clouds[i];
        cloud.group.translateX(Constants.Cloud.WindSpeedX);
        cloud.group.translateY(Constants.Cloud.WindSpeedY);
        cloud.group.translateX(Constants.Cloud.WindSpeedZ);

        if (cloud.group.position.x > parentWorld.mesh.geometry.parameters.width / 2 ||
            cloud.group.position.x < -parentWorld.mesh.geometry.parameters.width / 2 ||
            cloud.group.position.y > 30 ||
            cloud.group.position.y < 10 ||
            cloud.group.position.z > parentWorld.mesh.geometry.parameters.depth / 2 ||
            cloud.group.position.z < -parentWorld.mesh.geometry.parameters.depth / 2) {

            // for (let j = 0; j < cloud.group.children.length; j++) {
            //     cloud.group.children[j].geometry.dispose();
            //     cloud.group.children[j].material.dispose();
            // }
            parentWorld.mesh.remove(cloud.group);

            clouds[i] = new Cloud();
            parentWorld.mesh.add(clouds[i].group);
        }
    }

    // ---------------- CLOUD PARTICLE MOVEMENT ---------------- //
    for (let i = 0; i < clouds.length; i++) {
        for (let j = 0; j < clouds[i].particles.length; j++) {
            let particle = clouds[i].particles[j];
            particle.mesh.translateX(particle.movementXYZ[0]);
            particle.mesh.translateY(particle.movementXYZ[1]);
            particle.mesh.translateZ(particle.movementXYZ[2]);
            if (clouds[i].movementCounter % (clouds[i].movement * 2) === 0) {
                particle.movementXYZ[0] = -particle.movementXYZ[0];
                particle.movementXYZ[1] = -particle.movementXYZ[1];
                particle.movementXYZ[2] = -particle.movementXYZ[2];
            } else if (clouds[i].movementCounter % clouds[i].movement === 0) {
                clouds[i].resetMovement();
                for (let j = 0; j < clouds[i].particles.length; j++) {
                    Utils.setObjectSpeed(clouds[i].particles[j].movementXYZ, Constants.Cloud.ParticleMoveSpeed);
                }
            }
        }
        clouds[i].movementCounter++;
    }
}

function animateSnow(parentWorld, parentCloud, snow) {
    let forests = parentWorld.forests;
    let snowProbability = Utils.randomInteger(1, 40);
    if (snowProbability === 10) {
        snow[snow.length] = new Snow(parentCloud.mesh);
        parentCloud.mesh.add(snow[snow.length - 1].mesh);
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

        if (detectCollision(snow[i].mesh, parentWorld.mesh)) {
            snowCollision(snow[i], 10);

            let collidedWithSnow = false;
            for (let j = 0; j < snow.length; j++) {
                if (i === j || !snow[j].hasCollided) {
                    continue;
                }
                if (detectSnowCollision(snow[i].mesh, snow[j].mesh)) {
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
            let trees = forests[j].children;

            for (let k = 0; k < trees.length; k++) {
                let treeLeaves = trees[k].children;

                for (let m = 0; m < treeLeaves.length; m++) {
                    let treeLeaf = treeLeaves[m];

                    if (detectCollision(snow[i].mesh, treeLeaf)) {
                        snowCollision(snow[i], 5);

                        let collidedWithSnow = false;
                        for (let n = 0; n < snow.length; n++) {
                            if (i === n || !snow[n].hasCollided) {
                                continue;
                            }
                            if (detectSnowCollision(snow[i].mesh, snow[n].mesh)) {
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

    function snowCollision(snowFlake, x, y = 1, z = x) {
        snowFlake.hasCollided = true;
        parentWorld.mesh.attach(snowFlake.mesh);
        parentCloud.mesh.remove(snowFlake.mesh);
        snowFlake.mesh.geometry.scale(x, y, z);
        snowFlake.mesh.updateMatrix();
    }
}

function distanceFromPointToCircle(circleRadius, hittingObject, targetObject) {
    let object1Position = new THREE.Vector3();
    let object2Position = new THREE.Vector3();
    hittingObject.updateMatrixWorld(true);
    targetObject.updateMatrixWorld(true);
    targetObject.getWorldPosition(object1Position);
    hittingObject.getWorldPosition(object2Position);

    return Math.pow(circleRadius, 2) - (Math.pow(object1Position.x - object2Position.x, 2) + Math.pow(object1Position.z - object2Position.z, 2));
}

function detectCollision(object1, object2) {
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld(true);
    object2.updateMatrixWorld(true);

    let box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);
    let box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);

    return box1.intersectsBox(box2);
}

function detectSnowCollision(object1, object2) {
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();

    let box1 = new THREE.Box3();
    box1.setFromObject(object1);
    box1.applyMatrix4(object1.matrixWorld);

    let box2 = new THREE.Box3();
    box2.setFromObject(object2);
    box2.applyMatrix4(object2.matrixWorld);

    return box1.intersectsBox(box2);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
