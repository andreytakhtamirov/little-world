import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Star from "./star"
import Forest from "./forest";
import Utils from "./utils";
import Cloud from "./cloud";
import World from "./world";
import * as Constants from "./constants";
import Stats from "three/examples/jsm/libs/stats.module";
import Weather from "./weather";

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

function initializeWorld() {
    const cloudParticleMovementLoop = [];
    animationActive = true;
    let worlds = [];
    let clouds = [];
    let grove = [];

    let cloudParticleMoveCounter = 0;

    let randomWeather = Utils.randomInteger(1, 4);
    let weather = new Weather(randomWeather);

    scene = new THREE.Scene();
    scene.background = weather.sceneBackground;
    scene.add(weather.sceneAmbientLight1);
    scene.add(new THREE.AmbientLight("rgb(255,255,255)", 0.3));
    scene.add(weather.sceneAmbientLight2);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, Constants.World.Width * Constants.World.Depth * Constants.World.SidesCount);
    renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance"});
    if (window.screen.width * window.devicePixelRatio > Constants.Page.ResolutionWidth) {
        Constants.Page.ResolutionRatio = Constants.Page.ResolutionWidth / (window.screen.width * window.devicePixelRatio);
    }

    // Show stats (framerate)
    // stats = new Stats();
    // document.body.appendChild(stats.dom);

    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor();
    renderer.setPixelRatio(window.devicePixelRatio * Constants.Page.ResolutionRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rootElement.appendChild(renderer.domElement);

    const worldWidth = Constants.World.Width;
    const worldDepth = Constants.World.Depth;

    // Set up tiled world
    for (let i = 0; i < Constants.World.SidesCount; i++) {
        worlds[i] = new World();
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

    let star1 = new Star(200, 100, 170, 50, 1.3);
    //let star2 = new Star(50, 80, 100, 50, 1);

    scene.add(star1.light);

    //light helper
    // const helper = new THREE.CameraHelper(star1.light.shadow.camera);
    // scene.add(helper);

    // Set up forests, clouds, and rain for each world plane
    for (let i = 0; i < Constants.World.SidesCount; i++) {
        for (let j = 0; j < worlds[i].numForests; j++) {
            let forest = new Forest(Constants.Forest.TreesCount - 1);
            grove[j] = forest.trees;

            worlds[i].mesh.add(forest.mesh);
        }

        for (let j = 0; j < worlds[i].numClouds; j++) {
            clouds[i + j] = new Cloud();
            worlds[i].mesh.add(clouds[i + j].mesh);
        }
    }
    camera.position.set(-15, 38, 80);
    controls.update();

    for (let i = 0; i < clouds.length; i++) {
        cloudParticleMovementLoop[i] = Utils.randomInteger(1, Constants.Cloud.ParticleMoveTimeOut);
    }

    document.addEventListener("pagehide", function () {
        cancelAnimationFrame(animate);
        animationActive = false;
    });

    document.addEventListener("pageshow", function () {
        animationActive = true;
    });

    let animate = function () {
        if (!animationActive) {
            // fix bug with multiple animate() calls when switching to/from tab quickly
            return;
        }
        requestAnimationFrame(animate);

        if (stats != null) {
            stats.update();
        }

        // ---------------- WORLD MOVEMENT ---------------- //
        // worlds[0].mesh.rotation.y += 0.001;
        // ---------------- OTHER PLANET MOVEMENT ---------------- //
        //moon.rotation.y -= 0.02;
        // star1.rotation.y += 0.007
        // star2.rotation.y -= 0.007
        // star1.position.set(star1.position.x+=10, star1.position.y+=10, star1.position.z+=10);

        // ---------------- WHOLE CLOUD MOVEMENT ---------------- //
        for (let i = 0; i < clouds.length; i++) {
            clouds[i].mesh.translateX(clouds[i].cloudRandomMovementX);
            clouds[i].mesh.translateY(clouds[i].cloudRandomMovementY);
            clouds[i].mesh.translateZ(clouds[i].cloudRandomMovementZ);

            if (clouds[i].mesh.position.x > worlds[0].mesh.geometry.parameters.width / 2 ||
                clouds[i].mesh.position.x < -worlds[0].mesh.geometry.parameters.width / 2 ||
                clouds[i].mesh.position.y > 20 ||
                clouds[i].mesh.position.y < 10 ||
                clouds[i].mesh.position.z > worlds[0].mesh.geometry.parameters.depth / 2 ||
                clouds[i].mesh.position.z < -worlds[0].mesh.geometry.parameters.depth / 2) {

                worlds[0].mesh.remove(clouds[i].mesh);
                clouds[i].mesh.geometry.dispose();
                clouds[i].mesh.material.dispose();

                clouds[i] = new Cloud();
                worlds[0].mesh.add(clouds[i].mesh);
            }
        }

        // ---------------- CLOUD PARTICLE MOVEMENT ---------------- //
        for (let i = 0; i < clouds.length; i++) {
            for (let j = 0; j < clouds[i].particles.length; j++) {
                let particle = clouds[i].particles[j];

                particle.mesh.translateX(particle.movementXYZ[0]);
                particle.mesh.translateY(particle.movementXYZ[1]);
                particle.mesh.translateZ(particle.movementXYZ[2]);

                if (cloudParticleMoveCounter % (cloudParticleMovementLoop[i] * 2) === 0) {
                    particle.movementXYZ[0] = -particle.movementXYZ[0];
                    particle.movementXYZ[1] = -particle.movementXYZ[1];
                    particle.movementXYZ[2] = -particle.movementXYZ[2];
                } else if (cloudParticleMoveCounter % cloudParticleMovementLoop[i] === 0) {
                    cloudParticleMovementLoop[i] = Utils.randomInteger(0, Constants.Cloud.ParticleMoveTimeOut);

                    for (let j = 0; j < clouds[i].particles.length; j++) {
                        Utils.setObjectSpeed(clouds[i].particles[j].movementXYZ, Constants.Cloud.ParticleMoveSpeed);
                    }
                }
                cloudParticleMoveCounter++;
            }
        }

        // ---------------- TREE LEAF MOVEMENT ---------------- //
        // for (let i = 0; i < grove.length; i++) {
        //     for (let j = 0; j < grove[i].length; j++) {
        //         for (let k = 0; k < grove[i][j].length; k++) {
        //             let leaf = grove[i][j][k];
        //
        //             leaf.mesh.translateX(leaf.movementXYZ[0]);
        //             leaf.mesh.translateY(leaf.movementXYZ[1]);
        //             leaf.mesh.translateZ(leaf.movementXYZ[2]);
        //
        //             if (leafMoveCounter % 2 === 0) {
        //                 leaf.movementXYZ[0] = -leaf.movementXYZ[0];
        //                 leaf.movementXYZ[1] = -leaf.movementXYZ[1];
        //                 leaf.movementXYZ[2] = -leaf.movementXYZ[2];
        //             } else if (leafMoveCounter % 1 === 0) {
        //                 for (let l = 0; l < grove[i].length; l++) {
        //                     for (let m = 0; m < grove[l]; m++) {
        //                         for (let n = 0; n < grove[l][m].length; n++) {
        //                             let leaf = grove[i][j][k];
        //                             Utils.setObjectSpeed(leaf.movementXYZ, Constants.Forest.LeafMoveSpeed);
        //                         }
        //                     }
        //                 }
        //             }
        //             leafMoveCounter++;
        //         }
        //     }
        // }

        renderer.render(scene, camera);
    };
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
