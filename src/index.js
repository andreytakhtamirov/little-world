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

    //Create a DirectionalLight and turn on shadows for the light
    const light = new THREE.DirectionalLight( 0xffffff, 1.5);
    light.position.set( 1000, 1500, 1000 );
    light.castShadow = true;
    scene.add( light );
    
    // set light position
    light.shadowCameraLeft = -800;
    light.shadowCameraRight = 800;
    light.shadowCameraTop = 800;
    light.shadowCameraBottom = -800;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 3000;
    light.shadow.mapSize.height = 3000;
    light.shadow.camera.near = 100;
    light.shadow.camera.far = 2500;

    // light helper
    // const helper = new THREE.CameraHelper( light.shadow.camera );
    // scene.add( helper );


    document.body.appendChild(renderer.domElement);
    const worldGeometry = new THREE.BoxGeometry(100, 10, 100);
    const worldLine = new THREE.LineSegments(new THREE.EdgesGeometry(worldGeometry), new THREE.LineBasicMaterial({color: "rgb(98,150,103)"}));
    const grassMaterial = new THREE.MeshStandardMaterial({color: "rgb(112,72,60)"});
    world = new THREE.Mesh(worldGeometry, grassMaterial);

    let trees = [];

    for (let i = 0; i < 100; i++) {
        trees[i] = new Tree();
    }

    world.receiveShadow = true;

    scene.add(world);

    light.target = world;

    // cube edge lines
    world.add(worldLine);

    camera.position.set(120, 120, 80);
    controls.update();

    let animate = function () {
        requestAnimationFrame(animate);
        controls.update();

        //light.position.set( light.position.x, light.position.y, light.position.z ); //default; light shining from top

        world.rotation.y += 0.0006;

        renderer.render(scene, camera);
    };
    animate();
}

function Tree() {
    world.add(new Stem().stem);

    function Stem() {
        const stemWidth = 1;
        const stemHeight = Math.random() * (7-3) + 3;
        const stemDepth = 1;

        const stemMaterial = new THREE.MeshStandardMaterial({color: "rgb(62,39,25)"});
        const stemGeometry = new THREE.BoxGeometry(stemWidth, stemHeight, stemDepth);

        this.stem = new THREE.Mesh(stemGeometry, stemMaterial);
        const stemLine = new THREE.LineSegments(new THREE.EdgesGeometry(stemGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));

        const worldWidth = world.geometry.parameters.width/2;
        const randomTreePositionX = Math.random() * (worldWidth-5 + worldWidth-5) - (worldWidth-5);
        const treePositionY = world.geometry.parameters.height / 2 + this.stem.geometry.parameters.height / 2;
        const randomTreePositionZ = Math.random() * (worldWidth-5 + worldWidth-5) - (worldWidth-5);

        this.stem.position.set(randomTreePositionX, treePositionY, randomTreePositionZ);

        this.stem.add(stemLine);

        this.stem.castShadow = true; //default is false
        this.stem.receiveShadow = false; //default

        for (let i = 0; i < 3; i++) {
            this.stem.add(new Leaf(this.stem).leaf);
        }

        this.stem.rotation.y = Math.random() * 360;
    }

    function Leaf(stem) {
        const leafWidth = 2;
        const leafHeight = 2;
        const leafDepth = 2;

        const leafMaterial = new THREE.MeshStandardMaterial({color: "rgb(77,150,49)"});
        const leafGeometry = new THREE.BoxGeometry(leafWidth, leafHeight, leafDepth);
        this.leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        this.leafLine = new THREE.LineSegments(new THREE.EdgesGeometry(leafGeometry), new THREE.LineBasicMaterial({color: "rgb(23,65,9)"}));

        const treeHeight = stem.geometry.parameters.height;
        const minLeafPosY = treeHeight/2 + 2;
        const randomLeafPositionX = Math.random() * (1+0.5) - 0.5;
        const randomLeafPositionY = Math.random() * (treeHeight/2 - minLeafPosY) + minLeafPosY;
        const randomLeafPositionZ = Math.random() * (1+0.5) - 0.5;

        this.leaf.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);

        this.leaf.castShadow = true; //default is false
        this.leaf.receiveShadow = false; //default

        this.leaf.add(this.leafLine);
    }
}