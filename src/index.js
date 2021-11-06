import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Star from "./star"
import Forest from "./forest";
import Utils from "./utils";
import Cloud from "./cloud";
import World from "./world";
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import * as Constants from "./constants";
import Stats from "three/examples/jsm/libs/stats.module";

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

var stats;
var scene;
var worldReference;
var camera;
var renderer;
var composer;

function initializeWorld() {
    const cloudParticleMovementLoop = [];

    let worlds = [];
    let clouds = [];
    let grove = [];

    let cloudParticleMoveCounter = 0;
    let leafMoveCounter = 0;

    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(186,212,255)");
    scene.add(new THREE.AmbientLight("rgb(236,222,136)", 0.3));
    scene.add(new THREE.AmbientLight("rgb(255,255,255)", 0.3));
    scene.add(new THREE.AmbientLight("rgb(232,104,104)", 0.7));
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({antialias: true});

    // Show stats on page (framerate)
    // stats = new Stats();
    // document.body.appendChild(stats.dom);

    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor();
    renderer.setPixelRatio(window.devicePixelRatio * Constants.ResolutionRatio);
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

    const worldWidth = Constants.World.Width;
    const worldDepth = Constants.World.Depth;

    // Set up plane orientation (for a 1-6 sided earth)
    for (let i = 0; i < Constants.World.SidesCount; i++) {
        worlds[i] = new World();
        if (i === 0) {
            scene.add(worlds[0].mesh);
        } else {
            if (i % 5 === 0) {
                worlds[i].mesh.rotation.x = 180 * Math.PI / 180;
                worlds[i].mesh.position.set(0, -worldWidth, 0);
            } else if (i % 4 === 0) {
                worlds[i].mesh.rotation.z = 270 * Math.PI / 180;
                worlds[i].mesh.position.set(worldWidth / 2, -worldDepth / 2, 0);
            } else if (i % 3 === 0) {
                worlds[i].mesh.rotation.x = 90 * Math.PI / 180;
                worlds[i].mesh.position.set(0, -worldWidth / 2, worldDepth / 2);
            } else if (i % 2 === 0) {
                worlds[i].mesh.rotation.z = 90 * Math.PI / 180;
                worlds[i].mesh.position.set(-worldWidth / 2, -worldDepth / 2, 0);
            } else if (i % 2 - 1 === 0) {
                worlds[i].mesh.rotation.x = 270 * Math.PI / 180;
                worlds[i].mesh.position.set(0, -worldWidth / 2, -worldDepth / 2);
            }
            worlds[0].mesh.add(worlds[i].mesh);
        }
    }

    worldReference = worlds[0].mesh;

    let star1 = new Star(worldReference, 200, 100, 170, 50, 1.3);
    //let star2 = new Star(worldReference, 50, 80, 100, 50, 1);

    scene.add(star1.light);
    // scene.add(star2.light);

    // Don't show stars (too many objects cause low frame rates)
    // scene.add(star1.mesh);
    // scene.add(star2.mesh);

    //light helper
    // const helper = new THREE.CameraHelper(star1.light.shadow.camera);
    // scene.add(helper);
    // const helper2 = new THREE.CameraHelper(star2.light.shadow.camera);
    // scene.add(helper2);

    // Set up forests, clouds, and rain for each world plane
    for (let i = 0; i < Constants.World.SidesCount; i++) {
        for (let j = 0; j < worlds[i].numForests; j++) {
            let forest = new Forest(Constants.Forest.TreesCount - 1, worldReference);
            grove[j] = forest.trees;

            worlds[i].mesh.add(forest.mesh);
        }

        for (let j = 0; j < Constants.Cloud.Count; j++) {
            clouds[i + j] = new Cloud(worldReference);
            worlds[i].mesh.add(clouds[i + j].mesh);
        }
    }
    camera.position.set(-15, 26, 85);
    controls.update();

    for (let i = 0; i < clouds.length; i++) {
        cloudParticleMovementLoop[i] = Utils.randomInteger(1, Constants.Cloud.ParticleMoveTimeOut);
    }

    let animate = function () {
        requestAnimationFrame(animate);
        composer.render();

        if (stats != null) {
            stats.update();
        }

        // ---------------- WORLD MOVEMENT ---------------- //
        //world.rotation.y += 0.006;
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

                clouds[i] = new Cloud(worldReference);
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

        // worlds[0].mesh.rotation.y += Constants.World.RotationSpeed;

    };
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
