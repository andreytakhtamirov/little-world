import * as THREE from "three";
import Utils from "./utils";
import * as Constants from "./constants";
import * as Colours from "./colours";

export default class World {
    constructor() {
        const worldWidth = Constants.World.Width;
        const worldHeight = Constants.World.Height;
        const worldDepth = Constants.World.Depth;

        const worldGeometry = new THREE.BoxGeometry(worldWidth, worldHeight, worldDepth);
        const grassMaterial = new THREE.MeshStandardMaterial({color: Colours.World.Grass});

        this.mesh = new THREE.Mesh(worldGeometry, grassMaterial);
        this.mesh.receiveShadow = true;
        this.numForests = Utils.randomInteger(Constants.Forest.MinCount, Constants.Forest.MaxCount)
        this.numClouds = Utils.randomInteger(Constants.Cloud.MinCount, Constants.Cloud.MaxCount);
    }
}