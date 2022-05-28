import * as THREE from "three";
import Utils from "../utils";
import * as Constants from "../worldProperties/constants";
import * as Colours from "../worldProperties/colours"
import * as TWEEN from "@tweenjs/tween.js";

export default class World {
    constructor(weather, width, height, depth, numForests, numClouds) {
        this.numForests = numForests;
        this.numClouds = numClouds;
        this.forests = [];
        this.clouds = [];
        this.snow = [];
        this.river = null;

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
    }

    animateSpawn() {
        for (let j = 0; j < this.forests.length; j++) {
            let trees = this.forests[j].trees;
            for (let k = 0; k < trees.length; k++) {
                let tree = trees[k].mesh;
                let treeY = tree.position.y;
                tree.position.set(tree.position.x, tree.position.y + 60, tree.position.z);
                tree.visible = false;
                let treeAnimation = { y: tree.position.y, scale: 0 };
                let leafDimensions = [];
                for (let m = 0; m < tree.children.length; m++) {
                    let leaf = tree.children[m];
                    leafDimensions.push(leaf.geometry.parameters.width);
                    leaf.geometry.scale(0.001, 0.001, 0.001);
                    leaf.updateMatrix();
                }

                let animateTree = new TWEEN.Tween(treeAnimation).to({
                    y: treeY
                }, 500).onUpdate(function ({ y }) {
                    if (!tree.isVisible) {
                        tree.visible = true;
                    }
                    tree.position.set(tree.position.x, y, tree.position.z);
                });

                let animateLeaves = new TWEEN.Tween(treeAnimation).to({
                    scale: 1
                }, 2000).onUpdate(function ({ scale }) {
                    for (let m = 0; m < tree.children.length; m++) {
                        let leaf = tree.children[m];
                        let oldSize = leafDimensions[m];
                        let leafGeometry = new THREE.BoxBufferGeometry(oldSize * scale, oldSize * scale, oldSize * scale);
                        leaf.geometry.dispose();
                        leaf.geometry = leafGeometry;
                        leaf.updateMatrix();
                    }
                });

                animateTree.easing(TWEEN.Easing.Exponential.Out);
                animateLeaves.easing(TWEEN.Easing.Elastic.Out);
                animateTree.chain(animateLeaves);

                // Timing of tree dropping animation depends on the number of trees.
                // We don't want too many trees appearing at the same time!
                let rate = Constants.World.SidesCount * this.forests.length * trees.length * 60;
                animateTree.delay(Utils.randomInteger(0, rate));
                animateLeaves.delay(100);
                animateTree.start();
            }
        }

        for (let j = 0; j < this.clouds.length; j++) {
            let cloudParts = this.clouds[j].group.children;
            for (let k = 0; k < cloudParts.length; k++) {
                let particle = cloudParts[k];
                let particleY = particle.position.y;
                particle.position.set(particle.position.x, particle.position.y + 60, particle.position.z);
                particle.visible = false;
                let particlePosition = { y: particle.position.y };
                let animateCloud = new TWEEN.Tween(particlePosition).to({
                    y: particleY
                }, 1000).onUpdate(function ({ y }) {
                    if (!particle.isVisible) {
                        particle.visible = true;
                    }
                    particle.position.set(particle.position.x, y, particle.position.z);
                });

                animateCloud.easing(TWEEN.Easing.Back.Out);
                let startOffset = Constants.World.SidesCount * this.forests.length * Constants.Forest.TreesCount * 60;
                let rate = Constants.World.SidesCount * this.clouds.length * cloudParts.length * 60;
                animateCloud.delay(Utils.randomInteger(startOffset, rate));
                animateCloud.start();
            }
        }
    }
}