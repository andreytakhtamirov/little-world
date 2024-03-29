import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Utils from "../utils";
import * as Constants from "../properties/constants";
import * as Colours from "../properties/colours"
import Sparkle from "./particles/sparkle";
import Pointer from "./particles/pointer";

export default class Forest {
    constructor(world, treesCount, weather) {
        // First set up a center Tree for the forest. Other Tree meshes will be added to this mesh
        this.group = new THREE.Group();
        this.trees = [];

        for (let i = 0; i < treesCount; i++) {
            let tree = new Tree(world, treesCount, weather);
            this.trees.push(tree);
            this.group.add(tree.mesh);
        }
    }
}

class Tree {
    constructor(world, treesCount, weather) {
        // How many leaves are in each tree
        const leavesInTree = Utils.randomInteger(2, 3);

        // Stem dimensions
        const randDimension = Utils.randomNumber(3, 8);
        const stemWidth = randDimension / 8;
        const stemHeight = randDimension;
        const stemDepth = stemWidth;    // Tree trunk will be square-based

        let stemMaterial = new THREE.MeshLambertMaterial({ color: Colours.Tree.Stem });
        let stemGeometry = new THREE.BoxGeometry(stemWidth, stemHeight, stemDepth);

        this.mesh = new THREE.Mesh(stemGeometry, stemMaterial);

        let treeDistance = treesCount * 0.8;
        // Tree location
        const treePositionX = Utils.randomNumber(-treeDistance + stemWidth, treeDistance - stemWidth);
        const treePositionY = world.mesh.geometry.parameters.height / 2 + this.mesh.geometry.parameters.height / 2;
        const treePositionZ = Utils.randomNumber(-treeDistance + stemDepth, treeDistance - stemDepth);

        this.mesh.position.set(treePositionX, treePositionY, treePositionZ);
        this.mesh.castShadow = true;

        this.leaves = [];
        this.shouldContinueAnimation = false;

        for (let i = 0; i < leavesInTree; i++) {
            let leaf = new Leaf(this.mesh, weather, i === 0);
            this.leaves[i] = leaf;
            this.mesh.add(leaf.mesh);
        }
        this.mesh.rotation.y = Utils.getRadians(Utils.randomNumber(0, 360));
        this.mesh.renderOrder = 1;

        const stemMesh = this.mesh;
        let r = stemMesh.material.color.r;
        let g = stemMesh.material.color.g;
        let b = stemMesh.material.color.b;

        let colour = { r: r, g: g, b: b };
        this.highlight = new TWEEN.Tween(colour).to({
            r: r + 1,
            g: g,
            b: b + 1
        }, 500).onUpdate(function ({ r, g, b }) {
            stemMesh.material.color.r = r;
            stemMesh.material.color.g = g;
            stemMesh.material.color.b = b;
        });

        const tree = this;

        this.unHighlight = new TWEEN.Tween({ r: r + 1, g: g, b: b + 1 }).to({
            r: r,
            g: g,
            b: b
        }, 500).onUpdate(function ({ r, g, b }) {
            stemMesh.material.color.r = r;
            stemMesh.material.color.g = g;
            stemMesh.material.color.b = b;
        }).onComplete(function() {
            if (tree.shouldContinueAnimation) {
                tree.highlight.start();
            }
        });
    }

    showHighlightAnimation() {
        this.highlight.chain(this.unHighlight);
        this.highlight.start();
    }

    showHitAnimation() {
        let tree = this.mesh;
        let treePosition = new THREE.Vector3();
        tree.getWorldPosition(treePosition);

        let colour = { colour: 14017487 };
        let initialTrunkColour = tree.material.color.getHex();

        // animate tree falling
        let animateColour = new TWEEN.Tween(colour).to({
            colour: 13790554
        }, 500).onUpdate(function ({ colour }) {
            let children = tree.children;
            for (let i = 0; i < children.length; i++) {
                children[i].material.color.setHex(colour);
            }
            tree.material.color.setHex(colour);
        }).onComplete(function () {
            tree.material.color.setHex(initialTrunkColour);
            let rotation = { z: tree.rotation.z };

            let animateTree = new TWEEN.Tween(rotation).to({
                z: 90
            }, 2000).onUpdate(function ({ z }) {
                tree.rotation.z = Utils.getRadians(z);
            });

            let stemHeight = tree.geometry.parameters.height;
            let stemWidth = tree.geometry.parameters.width / 2;
            let drop = { yDisplacement: stemHeight };

            let treeFall = new TWEEN.Tween(drop).to({
                yDisplacement: Constants.World.Height / 2 + stemWidth
            }, 2000).onUpdate(function ({ yDisplacement }) {
                tree.position.set(tree.position.x, yDisplacement, tree.position.z);
            });

            let children = tree.children;
            let fade = { opacity: (tree.children[0].opacity * 100) };

            let leavesDisappear = new TWEEN.Tween(fade).to({
                opacity: 0.01
            }, 5000).onUpdate(function ({ opacity }) {
                for (let i = 0; i < children.length; i++) {
                    children[i].material.opacity -= opacity;
                }
            }).onComplete(function () {
                for (let i = 0; i < children.length; i++) {
                    children[i].geometry.dispose();
                    children[i].material.dispose();
                    tree.remove(children[i]);
                }
            });

            animateTree.easing(TWEEN.Easing.Bounce.Out);
            animateTree.start();
            treeFall.easing(TWEEN.Easing.Bounce.Out);
            treeFall.chain(leavesDisappear);
            treeFall.start();
        });
        animateColour.start();
    }

    showSelectedTree(scene) {
        let tree = this.mesh;
        let treePosition = new THREE.Vector3();
        tree.getWorldPosition(treePosition);

        for (let i = 0; i < 1; i++) {
            let treeHeight = tree.geometry.parameters.height;
            let pointer = new Pointer(treePosition, treeHeight).mesh;
            scene.add(pointer);

            let float = { offsetY: pointer.position.y };
            let down = new TWEEN.Tween(float).to({
                offsetY: treeHeight * 2
            }, 1000).onUpdate(function ({ offsetY }) {
                pointer.position.y = offsetY;
            });

            const constScene = scene;
            let fade = { opacity: (pointer.opacity * 100) };
            let disappear = new TWEEN.Tween(fade).to({
                opacity: 0.01
            }, 100).onUpdate(function ({ opacity }) {
                pointer.material.opacity -= opacity;
            }).onComplete(function () {
                pointer.geometry.dispose();
                pointer.material.dispose();
                constScene.remove(pointer);
            });

            down.easing(TWEEN.Easing.Bounce.Out);
            down.chain(disappear);
            down.start();
        }
    }

    showProximityAnimation() {
        for (let i = 0; i < this.leaves.length; i++) {
            this.leaves[i].showHighlightAnimation();
            this.leaves[i].shouldContinueAnimation = true;
        }
        this.shouldContinueAnimation = true;
        this.showHighlightAnimation();
    }

    hideProximityAnimation() {
        this.shouldContinueAnimation = false;

        for (let i = 0; i < this.leaves.length; i++) {
           this.leaves[i].shouldContinueAnimation = false;
        }
    }
}

class Leaf {
    constructor(stemMesh, weather, firstLeaf) {
        // Leaf dimensions (cube)
        const leafWidthHeightDepth = Utils.randomNumber(2, 2.5) * stemMesh.geometry.parameters.width;

        // Leaf positions
        const treeHeight = stemMesh.geometry.parameters.height;
        const minLeafPosY = treeHeight / 2 - leafWidthHeightDepth / 2;
        const randomLeafPositionX = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;
        let randomLeafPositionY = Math.random() * (treeHeight - minLeafPosY);
        const randomLeafPositionZ = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;

        if (firstLeaf) {
            // First leaf will always cover the top of the tree
            randomLeafPositionY = treeHeight / 2;
        }

        let randomColour = new THREE.Color(Colours.Tree.Leaves[(Utils.randomInteger(0, Colours.Tree.Leaves.length - 1))]);
        if (weather.conditions.includes('snowy')) {
            randomColour = new THREE.Color(Colours.Tree.SnowyLeaves[(Utils.randomInteger(0, Colours.Tree.SnowyLeaves.length - 1))]);
        }
        let leafMaterial = new THREE.MeshLambertMaterial({ color: randomColour });
        let leafGeometry = new THREE.BoxGeometry(leafWidthHeightDepth, leafWidthHeightDepth, leafWidthHeightDepth);

        this.mesh = new THREE.Mesh(leafGeometry, leafMaterial);
        this.mesh.castShadow = true;
        this.mesh.material.transparent = true;
        this.mesh.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);

        this.shouldContinueAnimation = false;

        const leafMesh = this.mesh;
        let r = leafMesh.material.color.r;
        let g = leafMesh.material.color.g;
        let b = leafMesh.material.color.b;

        let colour = { r: r, g: g, b: b };
        this.highlight = new TWEEN.Tween(colour).to({
            r: r + 1,
            g: g,
            b: b + 1
        }, 500).onUpdate(function ({ r, g, b }) {
            leafMesh.material.color.r = r;
            leafMesh.material.color.g = g;
            leafMesh.material.color.b = b;
        });

        const leaf = this;

        this.unHighlight = new TWEEN.Tween({ r: r + 1, g: g, b: b + 1}).to({
            r: r,
            g: g,
            b: b
        }, 500).onUpdate(function ({ r, g, b }) {
            leafMesh.material.color.r = r;
            leafMesh.material.color.g = g;
            leafMesh.material.color.b = b;
        }).onComplete(function() {
            if (leaf.shouldContinueAnimation) {
                leaf.highlight.start();
            }
        });
    }

    showHighlightAnimation() {
        this.highlight.chain(this.unHighlight);
        this.highlight.start();
    }
}
