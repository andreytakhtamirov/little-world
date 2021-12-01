import * as THREE from "three";
import Utils from "./utils";
import * as Constants from "./constants";
import * as Colours from "./colours";

export default class Forest {
    constructor(treesCount) {
        this.trees = [];

        // First set up a center Tree for the forest. Other Tree meshes will be added to this mesh
        let tree = new Tree(0);
        this.trees[0] = tree.leaves;
        this.mesh = tree.mesh;

        const worldWidth = Constants.World.Width / 2;
        const worldDepth = Constants.World.Depth / 2;
        const treeWidth = tree.mesh.geometry.parameters.width;
        const treeDepth = tree.mesh.geometry.parameters.depth;

        const positionX = Utils.randomNumber(-worldWidth + treeWidth + 5, worldWidth - treeWidth - 5);
        const positionY = Constants.World.Height / 2 + this.mesh.geometry.parameters.height / 2;
        const positionZ = Utils.randomNumber(-worldDepth + treeDepth + 5, worldDepth - treeDepth - 5);

        this.mesh.position.set(positionX, positionY, positionZ);


        for (let i = 0; i < treesCount; i++) {
            let tree = new Tree(-positionY);
            this.trees[i + 1] = tree.leaves;
            this.mesh.add(tree.mesh);
        }
    }
}

class Tree {
    constructor(yOffset) {
        // How many leaves are in each tree
        const leavesInTree = Utils.randomInteger(2, 3);

        // Stem dimensions
        const randDimension = Utils.randomNumber(3, 8);
        const stemWidth = randDimension / 8;
        const stemHeight = randDimension;
        const stemDepth = stemWidth;    // Tree trunk will be square-based

        let stemMaterial = new THREE.MeshStandardMaterial({color: Colours.Tree.Stem});
        let stemGeometry = new THREE.BoxGeometry(stemWidth, stemHeight, stemDepth);

        this.mesh = new THREE.Mesh(stemGeometry, stemMaterial);

        // Tree location
        const treePositionX = Utils.randomNumber(-5, 5);
        const treePositionY = Constants.World.Height / 2 + this.mesh.geometry.parameters.height / 2;
        const treePositionZ = Utils.randomNumber(-5, 5);

        this.mesh.position.set(treePositionX, treePositionY + yOffset, treePositionZ);
        this.mesh.castShadow = true;

        this.leaves = [];

        for (let i = 0; i < leavesInTree; i++) {
            let leaf = new Leaf(this.mesh);
            this.leaves[i] = leaf;
            this.mesh.add(leaf.mesh);
        }
        this.mesh.rotation.y = Math.random() * 360;
        this.mesh.renderOrder = 1;
    }
}

class Leaf {
    constructor(stemMesh) {
        // Leaf dimensions (cube)
        const leafWidthHeightDepth = Utils.randomNumber(2, 2.5) * stemMesh.geometry.parameters.width;

        // Leaf positions
        const treeHeight = stemMesh.geometry.parameters.height;
        const minLeafPosY = treeHeight / 2 - leafWidthHeightDepth / 2;
        const randomLeafPositionX = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;
        const randomLeafPositionY = Math.random() * (treeHeight / 2 - minLeafPosY) + minLeafPosY;
        const randomLeafPositionZ = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;

        let randomColour = new THREE.Color(Colours.Tree.Leaves[(Utils.randomInteger(0, Colours.Tree.Leaves.length - 1))]);
        let leafMaterial = new THREE.MeshStandardMaterial({color: randomColour});

        let leafGeometry = new THREE.BoxGeometry(leafWidthHeightDepth, leafWidthHeightDepth, leafWidthHeightDepth);

        this.mesh = new THREE.Mesh(leafGeometry, leafMaterial);
        this.mesh.castShadow = true;
        this.mesh.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);

        this.movementXYZ = [];
        Utils.setObjectSpeed(this.movementXYZ, Constants.Forest.LeafMoveSpeed);
    }
}
