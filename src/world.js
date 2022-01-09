import * as THREE from "three";
import Utils from "./utils";
import * as Constants from "./constants";
import * as Colours from "./colours";

export default class World {
    constructor(weather) {
        const worldWidth = Constants.World.Width;
        const worldHeight = Constants.World.Height;
        const worldDepth = Constants.World.Depth;

        let worldColour = Colours.World.Grass;
        if (weather.conditions.includes('snowy')) {
            worldColour = Colours.World.SnowyGrass;
        }
        const worldGeometry = new THREE.BoxBufferGeometry(worldWidth, worldHeight, worldDepth);
        const grassMaterial = new THREE.MeshPhongMaterial({color: worldColour});

        this.mesh = new THREE.Mesh(worldGeometry, grassMaterial);
        this.mesh.receiveShadow = true;
        this.numForests = Utils.randomInteger(Constants.Forest.MinCount, Constants.Forest.MaxCount)
        this.numClouds = Utils.randomInteger(Constants.Cloud.MinCount, Constants.Cloud.MaxCount);
        this.grove = [];
        this.clouds = [];
        this.snow = [];
    }
}