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
    const controls = new OrbitControls(camera, renderer.domElement);


    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const worldGeometry = new THREE.BoxGeometry(100, 100, 100);
    const worldLine = new THREE.LineSegments(new THREE.EdgesGeometry(worldGeometry), new THREE.LineBasicMaterial({color: "rgb(255,255,255)"}));
    const grassMaterial = new THREE.MeshBasicMaterial({color: "rgb(26,152,72)"});
    world = new THREE.Mesh(worldGeometry, grassMaterial);

    for(let i = 0; i<10; i++){
        new Tree();
    }

    scene.add(world);

    // cube edge lines
    scene.add(worldLine);

    camera.position.set(120, 120, 80);
    controls.update();

    var animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
}

function Tree() {
    const treeWidth = 4;
    const treeHeight = 16;
    const treeDepth = 4;

    const leaveMaterial = new THREE.MeshBasicMaterial({color: 0x91E56E});
    const stemMaterial = new THREE.MeshBasicMaterial({color: "rgb(62,39,25)"});
    const stemGeometry = new THREE.BoxGeometry(treeWidth, treeHeight, treeDepth);

    this.stem = new THREE.Mesh(stemGeometry, stemMaterial);
    this.stemLine = new THREE.LineSegments(new THREE.EdgesGeometry(stemGeometry), new THREE.LineBasicMaterial({color: "rgb(0,0,0)"}));

    const randomTreePositionX = Math.floor(Math.random() * 80) + -40;
    const treePositionZ = world.geometry.parameters.height / 2 + this.stem.geometry.parameters.height / 2;
    const randomTreePositionZ = Math.floor(Math.random() * 80) + -40;


    this.stem.position.set(randomTreePositionX, treePositionZ, randomTreePositionZ);
    this.stemLine.position.set(randomTreePositionX, treePositionZ, randomTreePositionZ);

    scene.add(this.stemLine);
    world.add(this.stem);
}