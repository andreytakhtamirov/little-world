import * as THREE from "three";
import Utils from "../utils";
import * as Constants from "../worldProperties/constants";
import * as Colours from "../worldProperties/colours"

export default class World {
    constructor(weather, width, height, depth, numForests, numClouds) {
        this.numForests = numForests;
        this.numClouds = numClouds;

        if (width == null) {
            width = Constants.World.Width;
        }
        if (height == null) {
            height = Constants.World.Height;
        }
        if (depth == null) {
            depth = Constants.World.Depth;
        }
        if (numForests == null) {
            this.numForests = Utils.randomInteger(Constants.Forest.MinCount, Constants.Forest.MaxCount)
        }
        if (numClouds == null) {
            this.numClouds = Utils.randomInteger(Constants.Cloud.MinCount, Constants.Cloud.MaxCount);
        }

        let worldColour = Colours.World.Grass;
        if (weather.conditions.includes('snowy')) {
            worldColour = Colours.World.SnowyGrass;
        }
        const worldGeometry = new THREE.BoxBufferGeometry(width, height, depth);
        const grassMaterial = new THREE.MeshPhongMaterial({color: worldColour});

        this.mesh = new THREE.Mesh(worldGeometry, grassMaterial);
        this.mesh.receiveShadow = true;
        this.forests = [];
        this.clouds = [];
        this.snow = [];
    }
}