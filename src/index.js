import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Star from "./star"
import Moon from "./moon";
import Forest from "./forest";
import Utils from "./utils";
import Cloud from "./cloud";
import Rain from "./rain";
import World from "./world";

class App extends Component {
    componentDidMount() {
        window.addEventListener('resize', onWindowResize);
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
var worldReference;
var camera;
var renderer;

function initializeWorld() {
    const worldSidesCount = 1;
    const cloudsCount = 2;
    const rainDropsPerCloud = 30;
    const minNumOfForests = 2
    const maxNumOfForests = 4;
    const treesPerForest = 15;

    const cloudRandomMovementX = Math.random() * (0.01 + 0.01) - 0.01;
    const cloudRandomMovementZ = Math.random() * (0.01 + 0.01) - 0.01;

    let worlds = [];
    let clouds = [];
    let cloudParticles = [];
    let rainDrops = [];

    let initialCloudParticleLocation = Utils.create2dArray(3);
    let moveCounter = 0;
    let moveForward = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
    renderer = new THREE.WebGLRenderer({antialias: true});

    // Show stats on page (framerate)
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
    scene.add(star1.light);
    scene.add(star2.light);

    // Don't show stars (too many objects cause low frame rates)
    // scene.add(star1.mesh);
    // scene.add(star2.mesh);
    // let moon = new Moon(1000, 0, 1000, 100);
    // scene.add(moon.mesh);

    // Set up plane orientation (for a 1-6 sided earth)
    for (let i = 0; i < worldSidesCount; i++) {
        worlds[i] = new World().mesh;
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

    worldReference = worlds[0];

    // Set up forests, clouds, and rain for each world plane
    for (let i = 0; i < worldSidesCount; i++) {
        const numForests = Utils.randomInteger(minNumOfForests, maxNumOfForests)
        for (let j = 0; j < numForests; j++) {
            worlds[i].add(new Forest(treesPerForest - 1, worldReference).mesh);
        }

        for (let j = 0; j < cloudsCount; j++) {
            clouds[i + j] = new Cloud(cloudParticles, worldReference);
            worlds[i].add(clouds[i + j]);
            // for (let k = 0; k < rainDropsPerCloud; k++) {
            //     rainDrops[k] = new Rain().mesh;
            //     clouds[j].add(rainDrops[k]);
            // }
        }
    }

    for (let i = 0; i < cloudParticles.length; i++) {
        initialCloudParticleLocation[0][i] = cloudParticles[i].position.x;
        initialCloudParticleLocation[1][i] = cloudParticles[i].position.y;
        initialCloudParticleLocation[2][i] = cloudParticles[i].position.z;
    }

    camera.position.set(120, 120, 200);
    // camera.position.set(5000, 5000, 5000); // Camera position for huge earth
    controls.update();

    let animate = function () {
        requestAnimationFrame(animate);
        // stats.update();

        // ---------------- WORLD MOVEMENT ---------------- //
        //world.rotation.y += 0.006;

        // ---------------- OTHER PLANET MOVEMENT ---------------- //
        //moon.rotation.y -= 0.02;
        // star1.rotation.y += 0.007
        // star2.rotation.y -= 0.007
        // star1.position.set(star1.position.x+=10, star1.position.y+=10, star1.position.z+=10);

        if (clouds.length > 0) {
            // ---------------- WHOLE CLOUD MOVEMENT ---------------- //
            // for (let i = 0; i < clouds.length; i++) {
            //     clouds[i].position.set(clouds[i].position.x + cloudRandomMovementX, clouds[i].position.y, clouds[i].position.z + cloudRandomMovementZ);
            //
            //     // for (let j = 0; j < rainDrops.length; j++) {
            //     //     const rainDropSpeed = Math.random() * (0.1 + 0.04) - 0.04;
            //     //     rainDrops[j].rainDrop.position.set(rainDrops[j].rainDrop.position.x, rainDrops[j].rainDrop.position.y - rainDropSpeed, rainDrops[j].rainDrop.position.z);
            //     // }
            // }

            // ---------------- CLOUD PARTICLE MOVEMENT ---------------- //
            // for (let i = 0; i < cloudParticles.length; i++) {
            //     // let randomMovementX = Utils.randomNumber(-0.05, 0.05);
            //     // let randomMovementY = Utils.randomNumber(-0.05, 0.05);
            //     // let randomMovementZ = Utils.randomNumber(-0.05, 0.05);
            //     let position = cloudParticles[i].position;
            //     let movement = 0.001;
            //
            //     if (!moveForward) {
            //         cloudParticles[i].position.set(position.x - movement, position.y - movement, position.z - movement);
            //     } else if (moveForward) {
            //         cloudParticles[i].position.set(position.x + movement, position.y + movement, position.z + movement);
            //     }
            //
            //     if (moveCounter % 5000 === 0){
            //         moveForward = false;
            //         //cloudParticles[i].position.set(initialCloudParticleLocation[0][i], initialCloudParticleLocation[1][i], initialCloudParticleLocation[2][i]);
            //     } else if (moveCounter % 2500 === 0) {
            //         moveForward = true;
            //     }
            //     moveCounter++;
            // }

            // ---------------- RAIN DROP MOVEMENT ---------------- //
            // for (let i = 0; i < rainDrops.length; i++) {
            //     if (rainDrops[i].position.y < -30) {
            //         rainDrops[i].position.set(rainDrops[i].positionX, rainDrops[i].positionY, rainDrops[i].positionZ);
            //         for (let i = 0; i < cloudsCount; i++) {
            //             for (let j = 0; j < rainDropsPerCloud; j++) {
            //                 rainDrops[j] = new Rain();
            //                 clouds[i].add(rainDrops[j]);
            //             }
            //         }
            //     }
            // }
        }

        renderer.render(scene, camera);
    };
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
