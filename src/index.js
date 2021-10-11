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
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {GUI} from "three/examples/jsm/libs/dat.gui.module";

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
var composer;

function initializeWorld() {
    const worldSidesCount = 1;
    const cloudsCount = 2;
    const rainDropsPerCloud = 30;
    const minNumOfForests = 2
    const maxNumOfForests = 4;
    const treesPerForest = 15;

    const cloudRandomMovementX = Utils.randomNumber(-0.001, 0.001);
    const cloudRandomMovementY = Utils.randomNumber(-0.001, 0.001);
    const cloudRandomMovementZ = Utils.randomNumber(-0.001, 0.001);

    const cloudParticleMovementSpeed = 0.001;

    let worlds = [];
    let clouds = [];
    let cloudParticles = Utils.create2dArray(cloudsCount);
    let rainDrops = [];

    let initialCloudParticleLocation = Utils.create2dArray(cloudsCount);
    let cloudParticleMovement = Utils.create2dArray(cloudsCount);
    let lastMovement = Utils.create2dArray(cloudsCount);
    let moveCounter = 0;
    let moveForward = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(236,222,136)");
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
    renderer = new THREE.WebGLRenderer({antialias: true});

    // Show stats on page (framerate)
    // let stats = new Stats();
    // document.body.appendChild(stats.dom);

    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio*0.90);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rootElement.appendChild(renderer.domElement);

    const params = {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0,
        bloomRadius: 1
    };

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    composer = new EffectComposer(renderer);
    const renderScene = new RenderPass(scene, camera);
    composer.addPass(renderScene);
    composer.addPass(bloomPass)

    let star1 = new Star(1800, 1000, 1000, 500, 2.2);
    let star2 = new Star(-800, -1900, 100, 200, 2);
    scene.add(star1.light);
    scene.add(star2.light);

    //light helper
    // const helper = new THREE.CameraHelper(star1.light.shadow.camera);
    // scene.add(helper);
    // const helper2 = new THREE.CameraHelper(star2.light.shadow.camera);
    // scene.add(helper2);

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
            clouds[i + j] = new Cloud(cloudParticles[j], worldReference);
            worlds[i].add(clouds[i + j]);
            // for (let k = 0; k < rainDropsPerCloud; k++) {
            //     rainDrops[k] = new Rain().mesh;
            //     clouds[j].add(rainDrops[k]);
            // }
        }
    }

    for (let i = 0; i < cloudsCount; i++) {
        for (let j = 0; j < cloudParticles[i].length; j++) {
            initialCloudParticleLocation[j][0] = cloudParticles[i][j].position.x;
            initialCloudParticleLocation[j][1] = cloudParticles[i][j].position.y;
            initialCloudParticleLocation[j][2] = cloudParticles[i][j].position.z;
        }
    }
    camera.position.set(40, 25, 50); // Camera position for small earth (50x50)
    //camera.position.set(120, 120, 200); // Camera position for medium earth (100x100)
    // camera.position.set(5000, 5000, 5000); // Camera position for huge earth
    controls.update();

    for (let i = 0; i < cloudsCount; i++) {
        cloudParticleMovement[i][0] = Utils.randomNumber(-cloudParticleMovementSpeed, cloudParticleMovementSpeed);
        cloudParticleMovement[i][1] = Utils.randomNumber(-cloudParticleMovementSpeed, cloudParticleMovementSpeed);
        cloudParticleMovement[i][2] = Utils.randomNumber(-cloudParticleMovementSpeed, cloudParticleMovementSpeed);
    }

    let animate = function () {
        requestAnimationFrame(animate);
        composer.render();

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
            for (let i = 0; i < clouds.length; i++) {
                clouds[i].translateX(cloudRandomMovementX);
                clouds[i].translateY(cloudRandomMovementY);
                clouds[i].translateZ(cloudRandomMovementZ);

                if (clouds[i].position.x > worlds[0].geometry.parameters.width / 2 ||
                    clouds[i].position.x < -worlds[0].geometry.parameters.width / 2 ||
                    clouds[i].position.y > 20 ||
                    clouds[i].position.y < 0 ||
                    clouds[i].position.z > worlds[0].geometry.parameters.depth / 2 ||
                    clouds[i].position.z < -worlds[0].geometry.parameters.depth / 2) {

                    worlds[0].remove(clouds[i]);
                    clouds[i].geometry.dispose();
                    clouds[i].material.dispose();
                    clouds[i] = new Cloud(cloudParticles, worldReference);
                    worlds[0].add(clouds[i]);
                    // clouds.splice(i, 1); // Remove cloud from array
                }
            }

            // ---------------- CLOUD PARTICLE MOVEMENT ---------------- //\
            for (let i = 0; i < clouds.length; i++) {
                for (let j = 0; j < cloudParticles[i].length; j++) {
                    if (!moveForward) {
                        cloudParticles[i][j].translateX(-cloudParticleMovement[i][0]);
                        cloudParticles[i][j].translateY(-cloudParticleMovement[i][1]);
                        cloudParticles[i][j].translateZ(-cloudParticleMovement[i][2]);
                    } else if (moveForward) {
                        cloudParticles[i][j].translateX(cloudParticleMovement[i][0]);
                        cloudParticles[i][j].translateY(cloudParticleMovement[i][1]);
                        cloudParticles[i][j].translateZ(cloudParticleMovement[i][2]);
                    }

                    if (moveCounter % 5000 === 0) {
                        moveForward = false;
                    } else if (moveCounter % 2500 === 0) {
                        moveForward = true;
                        cloudParticleMovement[i][0] = Utils.randomNumber(-cloudParticleMovementSpeed, cloudParticleMovementSpeed);
                        cloudParticleMovement[i][1] = Utils.randomNumber(-cloudParticleMovementSpeed, cloudParticleMovementSpeed);
                        cloudParticleMovement[i][2] = Utils.randomNumber(-cloudParticleMovementSpeed, cloudParticleMovementSpeed);
                    }
                    moveCounter++;
                }
            }

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
    composer.setSize(window.innerWidth, window.innerHeight);
}
