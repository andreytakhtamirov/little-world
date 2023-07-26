import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Sun from "./entities/sun"
import Forest from "./entities/forest";
import Utils from "./utils";
import Cloud from "./entities/cloud";
import River from "./entities/river";
import World from "./entities/world";
import * as Constants from "./properties/constants";
import Stats from "three/examples/jsm/libs/stats.module";
import Weather from "./properties/weather";
import Player from "./entities/player";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Helmet from "react-helmet"
import Settings from "./components/Settings";
import ActionButtons from "./components/ActionButtons";
import ControlButtons from "./components/ControlButtons";

class App extends Component {
    constructor(props) {
        super(props);
        this.refreshButton = React.createRef();
        this.playButton = React.createRef();
        this.state = {
            isPlaying: false
        };

        /* Check if user has set a custom resolution setting already.
            If resolution matches one of the available ones, load it.
        */
        let storedResolution = localStorage.getItem(Constants.Page.ResolutionStorageKey);
        if (storedResolution != null &&
            Constants.Page.ResolutionWidths.indexOf(parseInt(storedResolution)) !== -1) {
            Constants.Page.SetResolutionWidth = parseInt(storedResolution);
        } else {
            Constants.Page.SetResolutionWidth = Constants.Page.ResolutionWidths[2]; // Set default to medium
        }
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
        this.setState({ SeedNumber: Constants.World.Seed });
    }

    onRefreshClick = () => {
        purgeWorld(scene);
        controls.reset();
        initializeWorld();
        this.setState({ SeedNumber: Constants.World.Seed });
    }

    onPlayClick = () => {
        this.setState({ isPlaying: true });
        loadPlayer();
        setCamera(true);
    }

    onUpClick = () => {
        if (player == null) return;
        player.moveUp(camera);
    }

    onDownClick = () => {
        if (player == null) return;
        player.moveDown(camera);
    }

    onLeftClick = () => {
        if (player == null) return;
        player.moveLeft(camera);
    }

    onRightClick = () => {
        if (player == null) return;
        player.moveRight(camera);
    }

    onStrikeClick = () => {
        if (player == null) return;
        player.strike();
    }

    handleChange = (event) => {
        let resolutionWidth;
        let resolutions = Constants.Page.ResolutionWidths;
        switch (event.target.value) {
            case "ultra_low":
                resolutionWidth = resolutions[0];
                break;
            case "low":
                resolutionWidth = resolutions[1];
                break;
            case "medium":
                resolutionWidth = resolutions[2];
                break;
            case "high":
                resolutionWidth = resolutions[3];
                break;
            case "ultra":
                resolutionWidth = resolutions[4];
                break;
            default:
                resolutionWidth = resolutions[0];
                break;
        }

        setResolution(resolutionWidth);
    };

    render() {
        return (<div ref={(mount) => {
        }}>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0 user-scalable=no" />
            </Helmet>
            <Settings onChange={this.handleChange} />
            {!this.state.isPlaying &&
                <ActionButtons
                    playButton={this.playButton}
                    onPlayClick={this.onPlayClick}
                    refreshButton={this.refreshButton}
                    onRefreshClick={this.onRefreshClick} />
            }
            <ControlButtons
                onUpClick={this.onUpClick}
                onDownClick={this.onDownClick}
                onLeftClick={this.onLeftClick}
                onRightClick={this.onRightClick}
                onStrikeClick={this.onStrikeClick} />
        </div>)
    }
}
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

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
    setResolution(Constants.Page.SetResolutionWidth);

    // Show stats (framerate)
    stats = new Stats();
    document.body.appendChild(stats.dom);

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
    localStorage.setItem(Constants.Page.ResolutionStorageKey,resolutionWidth);
}

function purgeWorld(obj) {
    while (obj.children.length > 0) {
        purgeWorld(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) {
        obj.geometry.dispose();
    }

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
    Constants.World.NewSeed();
    animationActive = true;
    rotateWorld = true;
    worlds = [];

    light = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(light);

    const randomWeather = Utils.randomInteger(1, 6);
    weather = new Weather(randomWeather);
    scene.background = weather.sceneBackground;
    for (let i = 0; i < weather.ambientLights.length; i++) {
        scene.add(weather.ambientLights[i]);
    }

    const worldWidth = Constants.World.Width;
    const worldDepth = Constants.World.Depth;

    // Set up 6-sided planet
    for (let i = 0; i < Constants.World.SidesCount; i++) {
        worlds[i] = new World(weather);
        if (i === 0) {
            scene.add(worlds[0].mesh);
        } else {
            if (i % 5 === 0) {
                worlds[i].mesh.rotation.x = Utils.getRadians(180);
                worlds[i].mesh.position.set(0, -worldWidth, 0);
            } else if (i % 4 === 0) {
                worlds[i].mesh.rotation.z = Utils.getRadians(270);
                worlds[i].mesh.position.set(worldWidth/2, -worldDepth/2, 0);
            } else if (i % 3 === 0) {
                worlds[i].mesh.rotation.x = Utils.getRadians(90);
                worlds[i].mesh.position.set(0, -worldWidth/2, worldWidth/2);
            } else if (i % 2 === 0) {
                worlds[i].mesh.rotation.z = Utils.getRadians(90);
                worlds[i].mesh.position.set(-worldWidth/2, -worldWidth/2, 0);
            } else if (i % 1 === 0) {
                worlds[i].mesh.rotation.x = Utils.getRadians(270);
                worlds[i].mesh.position.set(0, -worldWidth/2, -worldWidth/2);
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
            let forest = new Forest(worlds[i], Constants.Forest.TreesCount - 1, weather);
            let box = new THREE.Box3().setFromObject(forest.group);
            let sizeX = box.getSize(new THREE.Vector3()).x;
            let sizeZ = box.getSize(new THREE.Vector3()).z;
            const forestPositionX = Utils.randomNumber(-worldWidth / 2 + sizeX / 2, worldWidth / 2 - sizeX / 2);
            const forestPositionZ = Utils.randomNumber(-worldDepth / 2 + sizeZ / 2, worldDepth / 2 - sizeZ / 2);

            forest.group.position.set(forestPositionX, 0, forestPositionZ);
            worlds[i].forests.push(forest);
            worlds[i].mesh.add(forest.group);
        }

        for (let j = 0; j < worlds[i].numClouds; j++) {
            let cloud = new Cloud();
            worlds[i].clouds.push(cloud);
            worlds[i].mesh.add(cloud.group);
        }
    }

    // Our main world. This world owns all other worlds and key features (river, player).
    let world = worlds[0];

    // Add river
    let river = new River();
    world.mesh.add(river.mesh);
    world.river = river;

    // Remove trees that are within the river
    world.forests.forEach(forest => {
        for (let i = 0; i < forest.trees.length; i++) {
            let tree = forest.trees[i];
            if (doesTreeTouchRiver(world.river, tree)) {
                forest.group.remove(tree.mesh);
                tree.mesh.geometry.dispose();
                tree.mesh.material.dispose();
                forest.trees.splice(i, 1);

                // Since we've just spliced the current index, move back to the next tree
                i--;
            }
        }
    });

    if (rotateWorld) {
        // Start with a small negative rotation so by the time the page loads the world will look unrotated
        world.mesh.rotation.set(0, Utils.getRadians(-5), 0);
    }

    // Animate adding elements
    for (let i = 0; i < worlds.length; i++) {
        worlds[i].animateSpawn();
    }

    camera.position.set(0, worldWidth * 1.4, worldDepth * 1.6);
    camera.rotation.set(Utils.getRadians(-40), 0, 0);

    light.position.copy(camera.position);
    light.rotation.copy(camera.rotation);
    controls.saveState();
}

function doesTreeTouchRiver(river, tree) {
    let treePosition = new THREE.Vector3();
    tree.mesh.getWorldPosition(treePosition);
    
    const riverX = river.mesh.position.x;
    const riverZ = river.mesh.position.z;
    const riverDepth = river.mesh.geometry.parameters.depth;

    const treeX = treePosition.x;
    const treeZ = treePosition.z;
    const treeWidth = tree.mesh.geometry.parameters.width;

    // The river has 2 orientations, it either lies on the X-axis or on the Z-axis (covering whole world width).
    return (riverX !== 0 && treeX - treeWidth/2 <= riverX + riverDepth/2 && treeX + treeWidth/2 >= riverX - riverDepth/2) ||
           (riverZ !== 0 && treeZ - treeWidth/2 <= riverZ + riverDepth/2 && treeZ + treeWidth/2 >= riverZ - riverDepth/2);
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
        let world = worlds[i];
        animateClouds(world);
        if (rotateWorld) {
            world.mesh.rotation.y += Utils.getRadians(Constants.World.RotationSpeed);
        }
        if (player != null) {
            checkClosestTree(player, worlds[i]);
            detectPlayerHits(player);
        }

        if (world.river != null) {
            world.river.animate();
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
        controls.enabled = false;
        controls.reset();
    } else {
        controls.enabled = true;
        controls.update();
    }
}

function loadPlayer() {
    let world = worlds[0];
    const mtlLoader = new MTLLoader();
    mtlLoader.load("/models/beaver.vox.mtl", mtlParseResult => {
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtlParseResult);
        objLoader.load("/models/beaver.vox.obj", function (obj) {
            obj.scale.set(1.1, 1.1, 1.1);
            obj.translateX(0);
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

function detectPlayerHits(player) {
    if (player == null || !player.isHitting) {
        return;
    }

    if (player.closestTree != null) {
        player.isHitting = false;
        player.closestTree.showHitAnimation();
    }
}

function checkClosestTree(player, world) {
    if (player == null) {
        return;
    }

    let closestTree = findClosestTree(player, world);

    if (closestTree != null) {
        if (player.closestTree !== closestTree) {
            // Closest tree has changed
            if (player.closestTree != null) {
                // Hide animation for last closest tree
                player.closestTree.hideProximityAnimation();
            }

            // Set new closest tree and start animation
            player.closestTree = closestTree;
            closestTree.showProximityAnimation();
        }
    } else {
        // player is not close to any tree
        if (player.closestTree != null) {
            player.closestTree.hideProximityAnimation();
        }
        player.closestTree = null;
    }
}

function findClosestTree(player, world) {
    let forests = world.forests;
    let closestHitDistance = 0; // closest distance will be the largest value
    let closestTree = null;

    for (let i = 0; i < forests.length; i++) {
        let trees = forests[i].trees;

        for (let j = 0; j < trees.length; j++) {
            let tree = trees[j];
            if (tree.mesh.rotation.z !== Utils.getRadians(0)) {
                // downed tree
                continue;
            }

            let distance = Utils.distanceFromPointToCircle(player.hitBox, player.mesh, tree.mesh);
            if (distance > 0 && distance > closestHitDistance) {
                closestHitDistance = distance;
                closestTree = tree;
            }
        }
    }
    return closestTree;
}

function animateClouds(parentWorld) {
    let clouds = parentWorld.clouds;

    for (let i = 0; i < clouds.length; i++) {
        let cloud = clouds[i];
        let newCloud = cloud.animate(parentWorld, weather.conditions);

        if (newCloud != null) {
            // Cloud movement resulted in the cloud needing to be recreated
            parentWorld.mesh.remove(clouds[i].group);
            clouds[i] = newCloud;
            parentWorld.mesh.add(clouds[i].group);
        }
    }
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
