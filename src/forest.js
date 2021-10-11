import * as THREE from "three";
import Utils from "./utils";

export default class Forest {
    constructor(treesCount, worldReference) {
        // First set up a center Tree for the forest. Other Tree meshes will be added to this mesh
        this.mesh = new Tree(0, worldReference).mesh;

        const worldWidth = worldReference.geometry.parameters.width / 2;
        const positionX = Math.random() * (worldWidth - 12 + worldWidth - 12) - (worldWidth - 12);
        const positionY = worldReference.geometry.parameters.height / 2 + this.mesh.geometry.parameters.height / 2;
        const positionZ = Math.random() * (worldWidth - 12 + worldWidth - 12) - (worldWidth - 12);

        this.mesh.position.set(positionX, positionY, positionZ);

        for (let i = 0; i < treesCount; i++) {
            this.mesh.add(new Tree(-positionY, worldReference).mesh);
        }
    }
}

class Tree {
    constructor(yOffset, worldReference) {
        // How many leaves are in each tree
        const leavesInTree = 3;

        // Stem dimensions
        const randDimension = Utils.randomNumber(3, 8);
        const stemWidth = randDimension / 8;
        const stemHeight = randDimension;
        const stemDepth = stemWidth;    // Tree trunk will be square-based

        let stemMaterial = new THREE.MeshStandardMaterial({color: "rgb(62,35,25)"});
        let stemGeometry = new THREE.BoxGeometry(stemWidth, stemHeight, stemDepth);

        let stemLineMaterial = new THREE.LineBasicMaterial({color: "rgb(43,28,28)"});
        let stemLine = new THREE.LineSegments(new THREE.EdgesGeometry(stemGeometry), stemLineMaterial);

        this.mesh = new THREE.Mesh(stemGeometry, stemMaterial);

        // Tree location
        const treePositionX = Math.random() * (10 + 10) - 10;
        const treePositionY = worldReference.geometry.parameters.height / 2 + this.mesh.geometry.parameters.height / 2;
        const treePositionZ = Math.random() * (10 + 10) - 10;

        this.mesh.position.set(treePositionX, treePositionY + yOffset, treePositionZ);
        this.mesh.add(stemLine);
        this.mesh.castShadow = true;

        for (let i = 0; i < leavesInTree; i++) {
            this.mesh.add(new Leaf(this.mesh).mesh);
        }
        this.mesh.rotation.y = Math.random() * 360;
    }
}

class Leaf {
    constructor(stemMesh) {
        // Leaf dimensions (cube)
        const leafWidthHeightDepth = Utils.randomNumber(2, 2.5) * stemMesh.geometry.parameters.width;

        // Leaf colours
        const leafColours =
            ["rgb(24,65,15)", "rgb(35,80,15)",
                "rgb(19,42,16)", "rgb(14,61,12)",
                "rgb(26,77,5)", "rgb(31,52,17)",
                "rgb(19,45,6)", "rgb(23,61,12)"];

        // Leaf positions
        const treeHeight = stemMesh.geometry.parameters.height;
        const minLeafPosY = treeHeight / 2 - leafWidthHeightDepth / 2;
        const randomLeafPositionX = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;
        const randomLeafPositionY = Math.random() * (treeHeight / 2 - minLeafPosY) + minLeafPosY;
        const randomLeafPositionZ = Math.random() * (leafWidthHeightDepth / 2 + leafWidthHeightDepth / 4) - leafWidthHeightDepth / 4;

        let randomColour = new THREE.Color(leafColours[(Utils.randomInteger(0, leafColours.length - 1))]);
        let leafMaterial = new THREE.MeshLambertMaterial({color: randomColour});

        let leafGeometry = new THREE.BoxGeometry(leafWidthHeightDepth, leafWidthHeightDepth, leafWidthHeightDepth);

        let leafLineMaterial = new THREE.LineBasicMaterial({color: "rgb(11,35,4)"});
        let leafLine = new THREE.LineSegments(new THREE.EdgesGeometry(leafGeometry), leafLineMaterial);

        this.mesh = new THREE.Mesh(leafGeometry, leafMaterial);
        this.mesh.add(leafLine);

        this.mesh.position.set(randomLeafPositionX, randomLeafPositionY, randomLeafPositionZ);
    }
}
