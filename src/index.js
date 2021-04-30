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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor("rgb(255,255,255)");
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const worldGeometry = new THREE.BoxGeometry(100, 100, 100);
    const worldLine = new THREE.LineSegments(new THREE.EdgesGeometry(worldGeometry), new THREE.LineBasicMaterial({color: "rgb(98,150,103)"}));
    const grassMaterial = new THREE.MeshBasicMaterial({color: "rgb(11,119,52)"});
    world = new THREE.Mesh(worldGeometry, grassMaterial);

    let trees = [];

    for (let i = 0; i < 100; i++) {
        trees[i] = new Tree();
    }

    scene.add(world);

    // cube edge lines
    scene.add(worldLine);

    camera.position.set(120, 120, 80);
    controls.update();

    let animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
}

function Tree() {
    world.add(new Stem().stem);


    function Stem() {
        const stemWidth = 1;
        const stemHeight = 4;
        const stemDepth = 1;

        const stemMaterial = new THREE.MeshBasicMaterial({color: "rgb(62,39,25)"});
        const stemGeometry = new THREE.BoxGeometry(stemWidth, stemHeight, stemDepth);

        this.stem = new THREE.Mesh(stemGeometry, stemMaterial);
        const stemLine = new THREE.LineSegments(new THREE.EdgesGeometry(stemGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));

        const randomTreePositionX = Math.random() * (45 + 45) - 45;
        const treePositionY = world.geometry.parameters.height / 2 + this.stem.geometry.parameters.height / 2;
        const randomTreePositionZ = Math.random() * (45 + 45) - 45;

        this.stem.position.set(randomTreePositionX, treePositionY, randomTreePositionZ);

        this.stem.add(stemLine);

        for (let i = 0; i < 4; i++) {
            this.stem.add(new Leaf().leaf);
        }
    }


    function Leaf() {
        const leafWidth = 2;
        const leafHeight = 1.8;
        const leafDepth = 2;

        const leafMaterial = new THREE.MeshBasicMaterial({color: "rgb(77,150,49)"});
        const leafGeometry = new THREE.BoxGeometry(leafWidth, leafHeight, leafDepth);
        this.leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        this.leafLine = new THREE.LineSegments(new THREE.EdgesGeometry(leafGeometry), new THREE.LineBasicMaterial({color: "rgb(23,65,9)"}));

        const randomLeafPositionX = Math.random() * (1+0.5) - 0.5;
        const randomLeafPositionY = Math.random() * (3-1.5) + 1.5;
        const randomLeafPositionZ = Math.random() * (1+0.5) - 0.5;

        this.leaf.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);

        this.leaf.add(this.leafLine);
    };
}