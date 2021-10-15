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
import Stats from "three/examples/jsm/libs/stats.module";
import * as Constants from "./constants";

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
    let cloudParticles = Utils.create2dArray(Constants.CloudsCount);
    let rainDrops = [];

    let initialCloudParticleLocation = Utils.create2dArray(Constants.CloudsCount);
    let cloudParticleMovement = Utils.create2dArray(Constants.CloudsCount);
    let lastMovement = Utils.create2dArray(Constants.CloudsCount);
    let moveCounter = 0;
    let moveForward = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(236,222,136)");
    scene.add(new THREE.AmbientLight("rgb(232,104,104)", 0.6));
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({antialias: true});

    // Show stats on page (framerate)
    // stats = new Stats();
    // document.body.appendChild(stats.dom);

    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor();
    renderer.setPixelRatio(window.devicePixelRatio * 0.40);
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

    // Set up plane orientation (for a 1-6 sided earth)
    for (let i = 0; i < Constants.WorldSidesCount; i++) {
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

    let star1 = new Star(worldReference, 1800, 1000, 1000, 500, 1.8);
    let star2 = new Star(worldReference, -800, -1900, 100, 200, 2);
    scene.add(star1.light);
    scene.add(star2.light);

    // Don't show stars (too many objects cause low frame rates)
    // scene.add(star1.mesh);
    // scene.add(star2.mesh);
    // let moon = new Moon(1000, 0, 1000, 100);
    // scene.add(moon.mesh);

    //light helper
    // const helper = new THREE.CameraHelper(star1.light.shadow.camera);
    // scene.add(helper);
    // const helper2 = new THREE.CameraHelper(star2.light.shadow.camera);
    // scene.add(helper2);

    // Set up forests, clouds, and rain for each world plane
    for (let i = 0; i < Constants.WorldSidesCount; i++) {
        const numForests = Utils.randomInteger(Constants.MinNumOfForests, Constants.MaxNumOfForests)
        for (let j = 0; j < numForests; j++) {
            worlds[i].add(new Forest(Constants.TreesPerForest - 1, worldReference).mesh);
        }

        for (let j = 0; j < Constants.CloudsCount; j++) {
            clouds[i + j] = new Cloud(cloudParticles[j], worldReference);
            worlds[i].add(clouds[i + j].mesh);
            // for (let k = 0; k < rainDropsPerCloud; k++) {
            //     rainDrops[k] = new Rain().mesh;
            //     clouds[j].add(rainDrops[k]);
            // }
        }
    }
    camera.position.set(40, 25, 50); // Camera position for small earth (50x50)
    //camera.position.set(120, 120, 200); // Camera position for medium earth (100x100)
    // camera.position.set(5000, 5000, 5000); // Camera position for huge earth
    controls.update();

    for (let i = 0; i < Constants.CloudsCount; i++) {
        cloudParticleMovementLoop[i] = Utils.randomInteger(1, Constants.CloudParticleMoveTimeOut);
        setCloudParticleMovement(cloudParticleMovement[i], Constants.CloudParticleMovementSpeed);
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

        if (clouds.length > 0) {
            // ---------------- WHOLE CLOUD MOVEMENT ---------------- //
            for (let i = 0; i < clouds.length; i++) {
                clouds[i].mesh.translateX(clouds[i].cloudRandomMovementX);
                clouds[i].mesh.translateY(clouds[i].cloudRandomMovementY);
                clouds[i].mesh.translateZ(clouds[i].cloudRandomMovementZ);

                if (clouds[i].mesh.position.x > worlds[0].geometry.parameters.width / 2 ||
                    clouds[i].mesh.position.x < -worlds[0].geometry.parameters.width / 2 ||
                    clouds[i].mesh.position.y > 20 ||
                    clouds[i].mesh.position.y < 5 ||
                    clouds[i].mesh.position.z > worlds[0].geometry.parameters.depth / 2 ||
                    clouds[i].mesh.position.z < -worlds[0].geometry.parameters.depth / 2) {

                    worlds[0].remove(clouds[i].mesh);
                    clouds[i].mesh.geometry.dispose();
                    clouds[i].mesh.material.dispose();
                    clouds[i] = new Cloud(cloudParticles, worldReference);
                    worlds[0].add(clouds[i].mesh);
                    // clouds.splice(i, 1); // Remove cloud from array
                }
            }

            // ---------------- CLOUD PARTICLE MOVEMENT ---------------- //\
            for (let i = 0; i < clouds.length; i++) {
                for (let j = 0; j < cloudParticles[i].length; j++) {
                    cloudParticles[i][j].translateX(cloudParticleMovement[i][0]);
                    cloudParticles[i][j].translateY(cloudParticleMovement[i][1]);
                    cloudParticles[i][j].translateZ(cloudParticleMovement[i][2]);

                    if (moveCounter % (cloudParticleMovementLoop[i] * 2) === 0) {
                        cloudParticleMovement[i][0] = -cloudParticleMovement[i][0];
                        cloudParticleMovement[i][1] = -cloudParticleMovement[i][1];
                        cloudParticleMovement[i][2] = -cloudParticleMovement[i][2];
                    } else if (moveCounter % cloudParticleMovementLoop[i] === 0) {
                        cloudParticleMovementLoop[i] = Utils.randomInteger(0, Constants.CloudParticleMoveTimeOut);
                        setCloudParticleMovement(cloudParticleMovement[i], Constants.CloudParticleMovementSpeed);
                    }
                    moveCounter++;
                }
            }
        }
        renderer.render(scene, camera);
    };
    animate();
}

function setCloudParticleMovement(particleXYZ, speed) {
    particleXYZ[0] = Utils.randomNumber(-speed, speed);
    particleXYZ[1] = Utils.randomNumber(-speed, speed);
    particleXYZ[2] = Utils.randomNumber(-speed, speed);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
