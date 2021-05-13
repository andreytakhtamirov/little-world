import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

class App extends Component {
    componentDidMount() {
        initializeWorld()
    }

    render() {
        return (
            <div ref={ref => (this.mount = ref)}/>
        )
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);

var scene;
var world;
var world2;

function initializeWorld() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
    //const renderer = new THREE.CanvasRenderer();
    const renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setClearColor("rgb(255,255,255)");
    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    let light = new Light();

    let worlds = [];
    const worldsCount = 6;

    for (let i = 0; i < worldsCount + 1; i++) {
        worlds[i] = new World();
        if (i === 0) {
            scene.add(worlds[0]);
        } else {
            if (i % 5 === 0) {
                worlds[i].rotation.x = 180 * Math.PI / 180;
                worlds[i].position.set(0, -100, 0);
            } else if (i % 4 === 0) {
                worlds[i].rotation.z = 270 * Math.PI / 180;
                worlds[i].position.set(50, -50, 0);
            } else if (i % 3 === 0) {
                worlds[i].rotation.x = 90 * Math.PI / 180;
                worlds[i].position.set(0, -50, 50);
            } else if (i % 2 === 0) {
                worlds[i].rotation.z = 90 * Math.PI / 180;
                worlds[i].position.set(-50, -50, 0);
            } else if (i % 2 - 1 === 0) {
                worlds[i].rotation.x = 270 * Math.PI / 180;
                worlds[i].position.set(0, -50, -50);
            }

            worlds[0].add(worlds[i]);
        }
    }

    world = worlds[0];

    // set the light to always point at world
    light.target = world;

    const cloudsCount = 0;
    const rainDropsPerCloud = 30;
    let clouds = [];
    let rainDrops = []

    for (let i = 0; i < worldsCount; i++) {
        const numForests = Math.random() * 4;
        for (let j = 0; j < numForests; j++) {
            worlds[i].add(new Forest());
        }

        for (let j = 0; j < cloudsCount; j++) {
            clouds[j] = new Cloud();
            world.add(clouds[j]);
            for (let k = 0; k < rainDropsPerCloud; k++) {
                rainDrops[k] = new Rain(clouds[j]);
            }
        }
    }

    camera.position.set(70, 60, 70);
    controls.update();

    let animate = function () {
        requestAnimationFrame(animate);
        controls.update();

        light.position.set(light.position.x, light.position.y, light.position.z); //default; light shining from top
        light.rotation.y += 80;
        world.rotation.y += 0.0006;

        if (cloudsCount > 0) {

            for (let i = 0; i < clouds.length; i++) {
                clouds[i].position.set(clouds[i].position.x + clouds[i].cloudRandomMovementX, clouds[i].position.y, clouds[i].position.x + clouds[i].cloudRandomMovementZ);

                for (let j = 0; j < rainDrops.length; j++) {
                    const rainDropSpeed = Math.random() * (0.1 + 0.04) - 0.04;
                    rainDrops[j].rainDrop.position.set(rainDrops[j].rainDrop.position.x, rainDrops[j].rainDrop.position.y - rainDropSpeed, rainDrops[j].rainDrop.position.z);
                }
            }

            for (let i = 0; i < rainDrops.length; i++) {
                if (rainDrops[i].rainDrop.position.y < -30) {
                    rainDrops[i].rainDrop.position.set(rainDrops[i].positionX, rainDrops[i].positionY, rainDrops[i].positionZ);
                    for (let i = 0; i < cloudsCount; i++) {
                        for (let j = 0; j < rainDropsPerCloud; j++) {
                            rainDrops[j] = new Rain(clouds[i].cloud);
                        }
                    }
                }
            }
        }

        renderer.render(scene, camera);
    };
    animate();
}


function Light() {
    //Create a DirectionalLight and turn on shadows for the light
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    const lightDistance = 600;

    light.position.set(lightDistance, lightDistance, 0);
    light.castShadow = true;
    scene.add(light);

    const lightArea = 800;
    // set light position
    light.shadowCameraLeft = -lightArea;
    light.shadowCameraRight = lightArea;
    light.shadowCameraTop = lightArea;
    light.shadowCameraBottom = -lightArea;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 7000;
    light.shadow.mapSize.height = 7000;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = Math.sqrt(Math.pow(light.position.x, 2) + Math.pow(light.position.y, 2)) + 300;

    //light helper
    const helper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(helper);

    return light;
}

function World() {
    const worldGeometry = new THREE.BoxGeometry(100, 10, 100);
    const worldLine = new THREE.LineSegments(new THREE.EdgesGeometry(worldGeometry), new THREE.LineBasicMaterial({color: "rgb(98,150,103)"}));
    const grassMaterial = new THREE.MeshStandardMaterial({color: "rgb(112,72,60)"});
    this.world = new THREE.Mesh(worldGeometry, grassMaterial);

    this.world.receiveShadow = true;

    this.world.add(worldLine);

    return this.world;
}

function Forest() {
    this.forest = new Tree();

    const worldWidth = world.geometry.parameters.width / 2;
    const positionX = Math.random() * (worldWidth - 12 + worldWidth - 12) - (worldWidth - 12);
    const positionY = 0;
    const positionZ = Math.random() * (worldWidth - 12 + worldWidth - 12) - (worldWidth - 12);

    // generate 200 trees
    const treesCount = 30;

    let trees = [];

    for (let i = 0; i < treesCount; i++) {
        trees[i] = new Tree();
        this.forest.add(trees[i]);
    }

    this.forest.position.set(positionX, positionY, positionZ);

    return this.forest;
}

function Tree() {
    return this.stem = new Stem().stem;

    function Stem() {
        // tree dimensions
        const stemWidth = 1;
        const stemHeight = Math.random() * (7 - 3) + 3;
        const stemDepth = 1;

        // how many leaves are in each tree
        const leavesInTree = 3;

        const stemMaterial = new THREE.MeshStandardMaterial({color: "rgb(62,39,25)"});
        const stemGeometry = new THREE.BoxGeometry(stemWidth, stemHeight, stemDepth);
        const stemLine = new THREE.LineSegments(new THREE.EdgesGeometry(stemGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));

        this.stem = new THREE.Mesh(stemGeometry, stemMaterial);

        // tree location
        const treePositionX = Math.random() * (10 + 10) - 10;
        const treePositionY = world.geometry.parameters.height / 2 + this.stem.geometry.parameters.height / 2;;
        const treePositionZ = Math.random() * (10 + 10) - 10;

        this.stem.position.set(treePositionX, treePositionY, treePositionZ);

        this.stem.add(stemLine);

        // set stem to cast a shadow
        this.stem.castShadow = true;

        for (let i = 0; i < leavesInTree; i++) {
            this.stem.add(new Leaf(this.stem).leaf);
        }

        this.stem.rotation.y = Math.random() * 360;
    }

    function Leaf(stem) {
        // leaf dimensions
        const leafWidthHeightDepth = 2;

        // leaf positions
        const treeHeight = stem.geometry.parameters.height;
        const minLeafPosY = treeHeight / 2 + leafWidthHeightDepth;
        const randomLeafPositionX = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;
        const randomLeafPositionY = Math.random() * (treeHeight / 2 - minLeafPosY) + minLeafPosY;
        const randomLeafPositionZ = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;


        const leafMaterial = new THREE.MeshStandardMaterial({color: "rgb(77,150,49)"});
        const leafGeometry = new THREE.BoxGeometry(leafWidthHeightDepth, leafWidthHeightDepth, leafWidthHeightDepth);
        const leafLine = new THREE.LineSegments(new THREE.EdgesGeometry(leafGeometry), new THREE.LineBasicMaterial({color: "rgb(23,65,9)"}));

        this.leaf = new THREE.Mesh(leafGeometry, leafMaterial);

        this.leaf.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);

        // set leaf to cast a shadow
        this.leaf.castShadow = true;

        this.leaf.add(leafLine);
    }
}

function Cloud() {
    const cloudWidthHeightDepth = 8;
    const particlesInEachCloud = 10;

    const cloudRotation = Math.random() * (180);

    const cloudPositionX = 0;
    const cloudPositionY = 30;
    const cloudPositionZ = -100;

    this.cloudRandomMovementX = Math.random() * (0.01 + 0.01) - 0.01;
    this.cloudRandomMovementZ = Math.random() * (0.01 + 0.01) - 0.01;

    this.cloud = new CloudParticle().cloudParticle;

    for (let i = 0; i < particlesInEachCloud; i++) {
        this.cloud.add(new CloudParticle().cloudParticle);
    }

    this.cloud.position.set(cloudPositionX, cloudPositionY, cloudPositionZ);

    this.cloud.rotation.y = cloudRotation;

    return this.cloud;

    function CloudParticle() {
        const cloudMaterial = new THREE.MeshStandardMaterial({color: "rgb(255,255,255)"});
        const cloudGeometry = new THREE.BoxGeometry(cloudWidthHeightDepth, cloudWidthHeightDepth, cloudWidthHeightDepth);

        this.cloudParticle = new THREE.Mesh(cloudGeometry, cloudMaterial);

        const cloudLine = new THREE.LineSegments(new THREE.EdgesGeometry(cloudGeometry), new THREE.LineBasicMaterial({color: "rgb(64,64,64)"}));

        // set cloud to cast a shadow
        this.cloudParticle.castShadow = true;

        this.cloudParticle.add(cloudLine);

        const particlePositionX = Math.random() * (8 + 4) - 4;
        const particlePositionY = Math.random() * (8 + 4) - 4;
        const particlePositionZ = Math.random() * (8 + 4) - 4;

        this.cloudParticle.position.set(particlePositionX, particlePositionY, particlePositionZ);
    }
}


function Rain(cloud) {
    this.rainDrop = new RainDrop();
    cloud.add(this.rainDrop);

    function RainDrop() {
        const rainDropWidthHeightDepth = 1;
        const positionX = Math.random() * (8 + 4) - 4;
        const positionY = 0;
        const positionZ = Math.random() * (8 + 4) - 4;

        const rainDropMaterial = new THREE.MeshStandardMaterial({color: "rgb(107,201,255)"});
        const rainDropGeometry = new THREE.BoxGeometry(rainDropWidthHeightDepth, rainDropWidthHeightDepth, rainDropWidthHeightDepth);

        this.rainDrop = new THREE.Mesh(rainDropGeometry, rainDropMaterial);

        const rainDropLine = new THREE.LineSegments(new THREE.EdgesGeometry(rainDropGeometry), new THREE.LineBasicMaterial({color: "rgb(1,45,116)"}));

        this.rainDrop.add(rainDropLine);

        this.rainDrop.position.set(positionX, positionY, positionZ);

        return this.rainDrop;
    }
}