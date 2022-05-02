import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Sun from "./entities/sun"
import Forest from "./entities/forest";
import Utils from "./utils";
import Cloud from "./entities/cloud";
import World from "./entities/world";
import * as Constants from "./worldProperties/constants";
import Stats from "three/examples/jsm/libs/stats.module";
import Weather from "./worldProperties/weather";
import Snow from "./entities/particles/snow";
import Player from "./entities/player";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Helmet from "react-helmet"
import Settings from "./components/Settings";
import ActionButtons from "./components/ActionButtons";
import Heading from "./components/Heading"

class App extends Component {
    constructor(props) {
        super(props);
        this.refreshButton = React.createRef();
        this.playButton = React.createRef();
        this.state = {
            isPlaying: false
        };
    }

    componentDidMount() {
        if (this.refreshButton.current != null) {
            this.refreshButton.current.focus();
        }
        window.addEventListener('resize', function () {
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(function () {
                onWindowResize();
            }, 100);
        });
        document.addEventListener("pagehide", stopAnimations);
        document.addEventListener("pageshow", startAnimations);
        initializeScene();
        initializeWorld();
        startAnimationLoop();
    }

    onRefreshClick = () => {
        purgeWorld(scene);
        initializeWorld();
    }

    onPlayClick = () => {
        this.setState({ isPlaying: true });
        loadPlayer();
        setCamera(true);
    }

    handleChange = (event) => {
        let resolutionWidth;
        let resolutions = Constants.Page.ResolutionWidths;
        switch (event.target.value) {
            case "low":
                resolutionWidth = resolutions[0];
                break;
            case "medium":
                resolutionWidth = resolutions[1];
                break;
            case "high":
                resolutionWidth = resolutions[2];
                break;
            case "ultra":
                resolutionWidth = resolutions[3];
                break;
            default:
                resolutionWidth = resolutions[0];
                break;
        }

        setResolution(resolutionWidth);
    };

    getCurrentResolution() {
        let resolutions = Constants.Page.ResolutionWidths;
        let resolutionWidth = Constants.Page.SetResolutionWidth;
        let resolutionValue = "";
        let index = resolutions.indexOf(resolutionWidth);
        switch (index) {
            case 0:
                resolutionValue = "low";
                break;
            case 1:
                resolutionValue = "medium";
                break;
            case 2:
                resolutionValue = "high";
                break;
            case 3:
                resolutionValue = "ultra";
                break;
            default:
                resolutionValue = "medium";
                break;
        }

        return resolutionValue;
    }

    render() {
        return (<div ref={(mount) => {
        }}>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0 user-scalable=no" />
            </Helmet>
            {/* <Heading /> */}
            {!this.state.isPlaying &&
                <ActionButtons
                    playButton={this.playButton}
                    onPlayClick={this.onPlayClick}
                    refreshButton={this.refreshButton}
                    onRefreshClick={this.onRefreshClick} />
            }
            <Settings onChange={this.handleChange} setResolution={this.getCurrentResolution} />
        </div>)
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

var stats;
var scene;
var camera;
var renderer;
var animationActive;
var weather;
var worlds;
var player;
var light;
var controls;
var rotateWorld;

function initializeScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, Constants.World.Width * Constants.World.Depth * Constants.World.SidesCount);
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    Constants.Page.SetResolutionWidth = Constants.Page.ResolutionWidths[1]; // Set default to medium
    setResolution(Constants.Page.SetResolutionWidth);

    // Show stats (framerate)
    // stats = new Stats();
    // document.body.appendChild(stats.dom);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rootElement.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.saveState();
    onWindowResize();
}

function setResolution(resolutionWidth) {
    Constants.Page.SetResolutionWidth = resolutionWidth;
    let screenWidth = window.innerWidth * window.devicePixelRatio;
    Constants.Page.ResolutionRatio = resolutionWidth / screenWidth;
    renderer.setPixelRatio(Constants.Page.ResolutionRatio);
}

function purgeWorld(obj) {
    while (obj.children.length > 0) {
        purgeWorld(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();

    if (obj.material) {
        Object.keys(obj.material).forEach(prop => {
            if (!obj.material[prop]) return;
            if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function') obj.material[prop].dispose();
        })
        obj.material.dispose();
    }

    if (player != null) {
        player.cancelKeyEvents();
        player = null;
    }
}

function initializeWorld() {
    animationActive = true;
    rotateWorld = true;
    worlds = [];

    light = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(light);

    let randomWeather = Utils.randomInteger(1, 5);
    weather = new Weather(randomWeather);
    scene.background = weather.sceneBackground;
    for (let i = 0; i < weather.ambientLights.length; i++) {
        scene.add(weather.ambientLights[i]);
    }

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
            let box = new THREE.Box3().setFromObject(forest.group);
            let sizeX = box.getSize(new THREE.Vector3()).x;
            let sizeZ = box.getSize(new THREE.Vector3()).z;
            const forestPositionX = Utils.randomNumber(-worldWidth / 2 + sizeX / 2, worldWidth / 2 - sizeX / 2);
            const forestPositionZ = Utils.randomNumber(-worldDepth / 2 + sizeZ / 2, worldDepth / 2 - sizeZ / 2);

            forest.group.position.set(forestPositionX, 0, forestPositionZ);
            worlds[i].forests.push(forest);
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

    worlds[0].mesh.rotation.set(0, Utils.getRadians(-5), 0);

    // Animate adding elements
    for (let i = 0; i < worlds.length; i++) {
        let world = worlds[i];
        for (let j = 0; j < world.forests.length; j++) {
            let trees = world.forests[j].trees;
            for (let k = 0; k < trees.length; k++) {
                let tree = trees[k].mesh;
                let treeY = tree.position.y;
                tree.position.set(tree.position.x, tree.position.y + 60, tree.position.z);
                tree.visible = false;
                let treeAnimation = { y: tree.position.y, scale: 0 };
                let leafDimensions = [];
                for (let m = 0; m < tree.children.length; m++) {
                    let leaf = tree.children[m];
                    leafDimensions.push(leaf.geometry.parameters.width);
                    leaf.geometry.scale(0.001, 0.001, 0.001);
                    leaf.updateMatrix();
                }

                let animateTree = new TWEEN.Tween(treeAnimation).to({
                    y: treeY
                }, 500).onUpdate(function ({ y }) {
                    if (!tree.isVisible) {
                        tree.visible = true;
                    }
                    tree.position.set(tree.position.x, y, tree.position.z);
                });

                let animateLeaves = new TWEEN.Tween(treeAnimation).to({
                    scale: 1
                }, 2000).onUpdate(function ({ scale }) {
                    for (let m = 0; m < tree.children.length; m++) {
                        let leaf = tree.children[m];
                        let oldSize = leafDimensions[m];
                        let leafGeometry = new THREE.BoxBufferGeometry(oldSize * scale, oldSize * scale, oldSize * scale);
                        leaf.geometry.dispose();
                        leaf.geometry = leafGeometry;
                        leaf.updateMatrix();
                    }
                });

                animateTree.easing(TWEEN.Easing.Exponential.Out);
                animateLeaves.easing(TWEEN.Easing.Elastic.Out);
                animateTree.chain(animateLeaves);

                // Timing of tree dropping animation depends on the number of trees.
                // We don't want too many trees appearing at the same time!
                let rate = worlds.length * world.forests.length * trees.length * 60;
                animateTree.delay(Utils.randomInteger(0, rate));
                animateLeaves.delay(100);
                animateTree.start();
            }
        }

        for (let j = 0; j < world.clouds.length; j++) {
            let cloudParts = world.clouds[j].group.children;
            for (let k = 0; k < cloudParts.length; k++) {
                let particle = cloudParts[k];
                let particleY = particle.position.y;
                particle.position.set(particle.position.x, particle.position.y + 60, particle.position.z);
                particle.visible = false;
                let particlePosition = { y: particle.position.y };
                let animateCloud = new TWEEN.Tween(particlePosition).to({
                    y: particleY
                }, 1000).onUpdate(function ({ y }) {
                    if (!particle.isVisible) {
                        particle.visible = true;
                    }
                    particle.position.set(particle.position.x, y, particle.position.z);
                });

                animateCloud.easing(TWEEN.Easing.Back.Out);
                let startOffset = worlds.length * world.forests.length * Constants.Forest.TreesCount * 60;
                let rate = worlds.length * world.clouds.length * cloudParts.length * 60;
                animateCloud.delay(Utils.randomInteger(startOffset, rate));
                animateCloud.start();
            }
        }
    }

    camera.position.set(0, worldWidth * 1.4, worldDepth * 1.6);
    camera.rotation.set(Utils.getRadians(-40), 0, 0);

    // camera.rotation.set(Utils.getRadians(-60), 0, 0);
    // camera.position.set(0, 50 * 1.1, 50 * 0.7);
    light.position.copy(camera.position);
    light.rotation.copy(camera.rotation);
    controls.saveState();
}

function startAnimationLoop() {
    animate();
}

function animate() {
    TWEEN.update();

    if (!animationActive) {
        // prevent multiple animate() calls when switching to/from tab quickly
        return;
    }
    if (stats != null) {
        stats.update();
    }
    controls.update();

    for (let i = 0; i < worlds.length; i++) {
        animateClouds(worlds[i]);
        if (rotateWorld) {
            worlds[i].mesh.rotation.y += Utils.getRadians(0.10);
        }
        if (player != null) {
            detectPlayerHits(player, worlds[i]);
            //checkClosestTree(player, worlds[i]);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function setCamera(isPlaying) {
    rotateWorld = !isPlaying;

    if (isPlaying) {
        let world = worlds[0];
        world.mesh.rotation.set(0, 0, 0);
        controls.reset();
        controls.enabled = false;
    } else {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
    }
}

function loadPlayer() {
    rotateWorld = false;
    let world = worlds[0];
    const mtlLoader = new MTLLoader();
    mtlLoader.load("/models/beaver.vox.mtl", mtlParseResult => {
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtlParseResult);
        objLoader.load("/models/beaver.vox.obj", function (obj) {
            obj.scale.set(1.1, 1.1, 1.1);
            obj.translateX(world.mesh.geometry.parameters.width / 2.5);
            obj.translateY(world.mesh.geometry.parameters.height / 2);
            obj.translateZ(world.mesh.geometry.parameters.depth / 2.5);
            obj.rotation.set(0, Utils.getRadians(180), 0);
            obj.traverse(function (child) {
                child.castShadow = true;
            });

            player = new Player(obj, camera);
            world.mesh.add(player.mesh);
        });
    });

}

function detectPlayerHits(player, world) {
    if (player == null || !player.isHitting) {
        return;
    }

    let closestTree = findClosestTree(player, world);

    if (closestTree != null) {
        player.isHitting = false;
        closestTree.showHitAnimation(scene);
    }
}

function checkClosestTree(player, world) {
    if (player == null) {
        return;
    }

    let closestTree = findClosestTree(player, world);

    if (closestTree != null) {
        if (player.closestTree !== closestTree) {
            player.closestTree = closestTree;
            closestTree.showSelectedTree(scene);
        }
    }
}

function findClosestTree(player, world) {
    let forests = world.forests;
    let closestHitDistance = 0; // closest distance will be the largest one
    let closestTree = null;

    for (let i = 0; i < forests.length; i++) {
        let trees = forests[i].trees;

        for (let j = 0; j < trees.length; j++) {
            let tree = trees[j];
            if (tree.mesh.rotation.z !== Utils.getRadians(0)) {
                // downed tree
                continue;
            }

            let distance = distanceFromPointToCircle(player.hitBox, player.mesh, tree.mesh);
            if (distance > 0 && distance > closestHitDistance) {
                closestHitDistance = distance;
                closestTree = tree;
            }
        }
    }
    return closestTree;
}

function animateClouds(parentWorld) {
    // TODO Redo using Tween
    let clouds = parentWorld.clouds;

    // ---------------- SNOW MOVEMENT ---------------- //
    if (weather.conditions === 'snowy') {
        for (let i = 0; i < clouds.length; i++) {
            animateSnow(parentWorld, clouds[i], clouds[i].snow);
        }
    }

    // ---------------- WHOLE CLOUD MOVEMENT ---------------- //ss
    for (let i = 0; i < clouds.length; i++) {
        let cloud = clouds[i];
        cloud.group.translateX(Constants.Cloud.WindSpeedX);
        cloud.group.translateY(Constants.Cloud.WindSpeedY);
        cloud.group.translateX(Constants.Cloud.WindSpeedZ);

        if (cloud.group.position.x > parentWorld.mesh.geometry.parameters.width / 2
            || cloud.group.position.x < -parentWorld.mesh.geometry.parameters.width / 2
            || cloud.group.position.y > 30 || cloud.group.position.y < 10
            || cloud.group.position.z > parentWorld.mesh.geometry.parameters.depth / 2
            || cloud.group.position.z < -parentWorld.mesh.geometry.parameters.depth / 2) {
            for (let j = 0; j < cloud.group.children.length; j++) {
                cloud.group.children[j].geometry.dispose();
                cloud.group.children[j].material.dispose();
            }
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
            let trees = forests[j].trees;

            for (let k = 0; k < trees.length; k++) {
                let treeLeaves = trees[k].mesh.children;

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
        parentCloud.group.remove(snowFlake.mesh);
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

function stopAnimations() {
    cancelAnimationFrame(animate);
    animationActive = false;
}

function startAnimations() {
    requestAnimationFrame(animate);
    animationActive = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // Scale camera zoom with viewport dimensions
    if (window.innerWidth > window.innerHeight) {
        camera.zoom = window.innerHeight / window.innerHeight;
    } else {
        camera.zoom = window.innerWidth / window.innerHeight;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    setResolution(Constants.Page.SetResolutionWidth);
}
