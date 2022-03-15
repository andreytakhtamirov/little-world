import * as THREE from "three";
import Utils from "../utils";
import * as Constants from "../worldProperties/constants";
import * as Colours from "../worldProperties/colours"

export default class Forest {
    constructor(treesCount, weather) {
        // First set up a center Tree for the forest. Other Tree meshes will be added to this mesh
        this.group = new THREE.Group();

        for (let i = 0; i < treesCount; i++) {
            let tree = new Tree(weather);
            this.group.add(tree.mesh);
        }
    }
}

class Tree {
    constructor(weather) {
        // How many leaves are in each tree
        const leavesInTree = Utils.randomInteger(2, 3);

        // Stem dimensions
        const randDimension = Utils.randomNumber(3, 8);
        const stemWidth = randDimension / 8;
        const stemHeight = randDimension;
        const stemDepth = stemWidth;    // Tree trunk will be square-based

        let stemMaterial = new THREE.MeshLambertMaterial({ color: Colours.Tree.Stem });
        let stemGeometry = new THREE.BoxBufferGeometry(stemWidth, stemHeight, stemDepth);

        this.mesh = new THREE.Mesh(stemGeometry, stemMaterial);

        let treeDistance = Constants.Forest.TreesCount * 0.8;
        // Tree location
        const treePositionX = Utils.randomNumber(-treeDistance + stemWidth, treeDistance - stemWidth);
        const treePositionY = Constants.World.Height / 2 + this.mesh.geometry.parameters.height / 2;
        const treePositionZ = Utils.randomNumber(-treeDistance + stemDepth, treeDistance - stemDepth);

        this.mesh.position.set(treePositionX, treePositionY, treePositionZ);
        this.mesh.castShadow = true;

        this.leaves = [];

        for (let i = 0; i < leavesInTree; i++) {
            let leaf = new Leaf(this.mesh, weather, i === 0);
            this.leaves[i] = leaf;
            this.mesh.add(leaf.mesh);
        }
        this.mesh.rotation.y = Math.random() * 360;
        this.mesh.renderOrder = 1;
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
        let leafGeometry = new THREE.BoxBufferGeometry(leafWidthHeightDepth, leafWidthHeightDepth, leafWidthHeightDepth);

        this.mesh = new THREE.Mesh(leafGeometry, leafMaterial);
        this.mesh.castShadow = true;
        this.mesh.material.transparent = true;
        this.mesh.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);

        this.movementXYZ = [];
        Utils.setObjectSpeed(this.movementXYZ, Constants.Forest.LeafMoveSpeed);
    }
}
