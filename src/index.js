import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";
import Stats from "three/examples/jsm/libs/stats.module";

class App extends Component {
    componentDidMount() {
        //window.addEventListener('resize', onWindowResize);
        initializeWorld()
    }

    render() {
        return (
            <div ref={(mount) => {
                this.mount = mount
            }}/>
        )
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);

var scene;
var world;
var globalGeometry;
var camera;
var renderer;

function initializeWorld() {
    const worldsCount = 1;
    const cloudsCount = 1;
    const rainDropsPerCloud = 30;
    const maxNumOfForests = 3;
    const treesPerForest = 15;

    let worlds = [];
    let clouds = [];
    let rainDrops = [];

    scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);

    renderer = new THREE.WebGLRenderer({antialias: true});

    // let stats = new Stats();
    // document.body.appendChild(stats.dom);

    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rootElement.appendChild(renderer.domElement);

    let star1 = new Star(1800, 1000, 1000, 500, 2.2);
    let star2 = new Star(-800, -1900, 100, 200, 2);

    //let moon = new Moon(1000, 0, 1000, 100);

    globalGeometry = new Geometry();

    for (let i = 0; i < worldsCount; i++) {
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

    for (let i = 0; i < worldsCount; i++) {
        const numForests = Math.random() * maxNumOfForests;
        for (let j = 0; j < numForests; j++) {
            worlds[i].add(new Forest(treesPerForest - 1));
        }

        let cloudsPerWorld = 1;
        //randomInteger(0, 2)

        for (let j = 0; j < cloudsPerWorld; j++) {
            clouds[i + j] = new Cloud();
            worlds[i].add(clouds[i + j]);
            // for (let k = 0; k < rainDropsPerCloud; k++) {
            //     rainDrops[k] = new Rain(clouds[j]);
            // }
        }
    }

    camera.position.set(120, 120, 200);
    //camera.position.set(5000, 5000, 5000);
    controls.update();

    const cloudRandomMovementX = Math.random() * (0.01 + 0.01) - 0.01;
    const cloudRandomMovementZ = Math.random() * (0.01 + 0.01) - 0.01;

    let animate = function () {
        requestAnimationFrame(animate);
        // stats.update();
        //light.position.set(light.position.x, light.position.y, light.position.z);
        //light.rotation.y += 80;
        //world.rotation.y += 0.006;

        //moon.rotation.y -= 0.02;
        // star1.rotation.y += 0.007
        // star2.rotation.y -= 0.007

        //star1.position.set(star1.position.x+=10, star1.position.y+=10, star1.position.z+=10);

        if (clouds.length > 0) {

            for (let i = 0; i < clouds.length - 1; i++) {
                clouds[i].position.set(clouds[i].position.x + cloudRandomMovementX, clouds[i].position.y, clouds[i].position.z + cloudRandomMovementZ);

                // for (let j = 0; j < rainDrops.length; j++) {
                //     const rainDropSpeed = Math.random() * (0.1 + 0.04) - 0.04;
                //     rainDrops[j].rainDrop.position.set(rainDrops[j].rainDrop.position.x, rainDrops[j].rainDrop.position.y - rainDropSpeed, rainDrops[j].rainDrop.position.z);
                // }
            }

            // for (let i = 0; i < rainDrops.length; i++) {
            //     if (rainDrops[i].rainDrop.position.y < -30) {
            //         rainDrops[i].rainDrop.position.set(rainDrops[i].positionX, rainDrops[i].positionY, rainDrops[i].positionZ);
            //         for (let i = 0; i < cloudsCount; i++) {
            //             for (let j = 0; j < rainDropsPerCloud; j++) {
            //                 rainDrops[j] = new Rain(clouds[i].cloud);
            //             }
            //         }
            //     }
            // }
        }

        renderer.render(scene, camera);
    };
    animate();
}

function Star(positionX, positionY, positionZ, size, intensity) {
    const starGeometry = new THREE.BoxGeometry(size, size, size);
    const starLine = new THREE.LineSegments(new THREE.EdgesGeometry(starGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));
    const starMaterial = new THREE.MeshStandardMaterial({color: "rgb(255,129,22)"});

    this.star = new THREE.Mesh(starGeometry, starMaterial);

    this.star.add(starLine);

    this.star.castShadow = false;
    this.star.receiveShadow = false;

    new Light(positionX, positionY, positionZ, intensity);

    this.star.position.set(positionX, positionY, positionZ);

    scene.add(this.star);
    return this.star;
}

function Moon(positionX, positionY, positionZ, size) {
    const moonGeometry = new THREE.BoxGeometry(size, size, size);
    const moonLine = new THREE.LineSegments(new THREE.EdgesGeometry(moonGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));
    const moonMaterial = new THREE.MeshStandardMaterial({color: "rgb(123,123,121)"});
    this.moon = new THREE.Mesh(moonGeometry, moonMaterial);

    this.moon.add(moonLine);

    this.moon.castShadow = false;
    this.moon.receiveShadow = false;

    this.moon.position.set(positionX, positionY, positionZ);

    return this.moon;
}

function Light(positionX, positionY, positionZ, intensity) {
    //Create a DirectionalLight and turn on shadows for the light
    const light = new THREE.DirectionalLight(0xffffff, intensity);

    light.position.set(positionX, positionY, positionZ);
    light.castShadow = true
    scene.add(light);

    const lightArea = 120;
    // set light position
    light.shadowCameraLeft = -lightArea;
    light.shadowCameraRight = lightArea;
    light.shadowCameraTop = lightArea;
    light.shadowCameraBottom = -lightArea;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 7000;
    light.shadow.mapSize.height = 7000;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = Math.sqrt(Math.pow(light.position.x, 2) + Math.pow(light.position.y, 2)) + Math.abs(light.position.x);

    //light helper
    //const helper = new THREE.CameraHelper(light.shadow.camera);
    //scene.add(helper);

    return light;
}

function World() {
    const worldGeometry = new THREE.BoxGeometry(100, 1, 100);
    const worldLine = new THREE.LineSegments(new THREE.EdgesGeometry(worldGeometry), new THREE.LineBasicMaterial({color: "rgb(71,47,37)"}));
    const grassMaterial = new THREE.MeshStandardMaterial({color: "rgb(54,85,48)"});
    this.world = new THREE.Mesh(worldGeometry, grassMaterial);

    this.world.receiveShadow = true;

    this.world.add(worldLine);

    return this.world;
}

function Forest(treesCount) {
    this.forest = new Tree(0);

    const worldWidth = world.geometry.parameters.width / 2;
    const positionX = Math.random() * (worldWidth - 12 + worldWidth - 12) - (worldWidth - 12);
    const positionY = world.geometry.parameters.height / 2 + this.forest.geometry.parameters.height / 2;
    const positionZ = Math.random() * (worldWidth - 12 + worldWidth - 12) - (worldWidth - 12);

    let trees = [];

    this.forest.position.set(positionX, positionY, positionZ);


    for (let i = 0; i < treesCount; i++) {
        trees[i] = new Tree(-positionY);
        this.forest.add(trees[i]);
    }


    return this.forest;
}

// function Mountain() {
//     const widthHeightDepth = 2;
//     const MOUNTAIN_SIZE = 5;
//
//     const mountainRotation = Math.random() * (18);
//
//     const cloudPositionX = 0;
//     const cloudPositionY = 30;
//     const cloudPositionZ = -100;
//
//     this.cloudRandomMovementX = Math.random() * (0.01 + 0.01) - 0.01;
//     this.cloudRandomMovementZ = Math.random() * (0.01 + 0.01) - 0.01;
//
//     this.mountain = new MountainParticle().cloudParticle;
//
//     for (let i = 0; i < MOUNTAIN_SIZE; i++) {
//         this.mountain.add(new MountainParticle());
//     }
//
//     this.mountain.position.set(cloudPositionX, cloudPositionY, cloudPositionZ);
//
//     return this.mountain;
//
//     function MountainParticle() {
//         const mountainMaterial = new THREE.MeshStandardMaterial({color: "rgb(64,64,64)"});
//         const mountainGeometry = new THREE.BoxGeometry(widthHeightDepth, widthHeightDepth, widthHeightDepth);
//         const mountainLine = new THREE.LineSegments(new THREE.EdgesGeometry(mountainGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));
//
//         this.block = new THREE.Mesh(mountainGeometry, mountainMaterial);
//
//         // set mountain to cast a shadow
//         this.block.castShadow = true;
//
//         this.block.add(mountainLine);
//
//         const particlePositionX = Math.random() * (8 + 4) - 4;
//         const particlePositionY = Math.random() * (8 + 4) - 4;
//         const particlePositionZ = Math.random() * (8 + 4) - 4;
//
//         this.block.position.set(particlePositionX, particlePositionY, particlePositionZ);
//
//         return this.block;
//     }
// }

function Tree(yOffset) {

    return new Stem(yOffset);

    function Stem(yOffset) {
        // tree dimensions
        const stemWidth = 1;
        const stemHeight = Math.random() * (8 - 3) + 3;
        const stemDepth = 1;

        // how many leaves are in each tree
        const leavesInTree = 3;

        let stemMaterial = new THREE.MeshStandardMaterial({color:"rgb(62,39,25)"});
        let stemGeometry = new THREE.BoxGeometry(stemWidth, stemHeight, stemDepth);

        let stemLineMaterial = new THREE.LineBasicMaterial({color:"rgb(43,28,28)"});
        let stemLine = new THREE.LineSegments(new THREE.EdgesGeometry(stemGeometry), stemLineMaterial);

        this.stem = new THREE.Mesh(stemGeometry, stemMaterial);

        // tree location
        const treePositionX = Math.random() * (10 + 10) - 10;
        const treePositionY = world.geometry.parameters.height / 2 + this.stem.geometry.parameters.height / 2;
        const treePositionZ = Math.random() * (10 + 10) - 10;

        this.stem.position.set(treePositionX, treePositionY + yOffset, treePositionZ);

        this.stem.add(stemLine);

        // set stem to cast a shadow
        this.stem.castShadow = true;

        for (let i = 0; i < leavesInTree; i++) {
            this.stem.add(new Leaf(this.stem));
        }

        this.stem.rotation.y = Math.random() * 360;

        return this.stem;
    }

    function Leaf(stem) {
        // leaf dimensions
        const leafWidthHeightDepth = 2;

        // leaf positions
        const treeHeight = stem.geometry.parameters.height;
        const minLeafPosY = treeHeight / 2 - leafWidthHeightDepth / 2;
        const randomLeafPositionX = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;
        const randomLeafPositionY = Math.random() * (treeHeight / 2 - minLeafPosY) + minLeafPosY;
        const randomLeafPositionZ = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;

        let leafMaterial = new THREE.MeshStandardMaterial({color:"rgb(79, 121, 59)"});
        let leafGeometry = new THREE.BoxGeometry(leafWidthHeightDepth, leafWidthHeightDepth, leafWidthHeightDepth);

        let leafLineMaterial = new THREE.LineBasicMaterial({color:"rgb(35, 80, 22)"});
        let leafLine = new THREE.LineSegments(new THREE.EdgesGeometry(leafGeometry), leafLineMaterial);

        this.leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        this.leaf.add(leafLine);

        this.leaf.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);

        return this.leaf;
    }
}

function Cloud() {
    const cloudWidthHeightDepth = 8;
    const particlesInEachCloud = 2;

    const cloudRotation = Math.random() * (180);

    const cloudPositionX = Math.random() * (world.geometry.parameters.width / 2 - cloudWidthHeightDepth) + 1;
    const cloudPositionY = 20;
    const cloudPositionZ = Math.random() * (world.geometry.parameters.width / 2 - cloudWidthHeightDepth) + 1;

    this.cloud = new CloudParticle().cloudParticle;

    for (let i = 0; i < particlesInEachCloud; i++) {
        this.cloud.add(new CloudParticle().cloudParticle);
    }

    this.cloud.position.set(cloudPositionX, cloudPositionY, cloudPositionZ);

    this.cloud.rotation.y = cloudRotation;

    return this.cloud;

    function CloudParticle() {
        const cloudMaterial = new THREE.MeshStandardMaterial({color: "rgb(213,213,213)"});
        const cloudGeometry = new THREE.BoxGeometry(cloudWidthHeightDepth, cloudWidthHeightDepth, cloudWidthHeightDepth);

        this.cloudParticle = new THREE.Mesh(cloudGeometry, cloudMaterial);

        const cloudLine = new THREE.LineSegments(new THREE.EdgesGeometry(cloudGeometry), new THREE.LineBasicMaterial({color: "rgb(170,170,170)"}));

        // set cloud to cast a shadow
        this.cloudParticle.castShadow = true;

        this.cloudParticle.add(cloudLine);

        const particlePositionX = Math.random() * randomNumber(4, 8);
        const particlePositionY = Math.random() * randomNumber(4, 8);
        const particlePositionZ = Math.random() * randomNumber(4, 8);

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

        this.rain = new THREE.Mesh(rainDropGeometry, rainDropMaterial);

        const rainDropLine = new THREE.LineSegments(new THREE.EdgesGeometry(rainDropGeometry), new THREE.LineBasicMaterial({color: "rgb(1,45,116)"}));

        this.rain.add(rainDropLine);

        this.rain.position.set(positionX, positionY, positionZ);

        return this.rain;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
