import * as THREE from "three";
import * as Colours from "./colours"
import * as Constants from "./constants";

export default class Star {
    constructor(positionX, positionY, positionZ, size, intensity) {
        const starGeometry = new THREE.BoxGeometry(size, size, size);
        const starLine = new THREE.LineSegments(new THREE.EdgesGeometry(starGeometry), new THREE.LineBasicMaterial({color: Colours.Star.Outline}));
        const starMaterial = new THREE.MeshStandardMaterial({color: Colours.Star.Material});

        this.mesh = new THREE.Mesh(starGeometry, starMaterial);
        this.mesh.add(starLine);

        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;

        // Star will emit light from its position
        this.light = new Light(positionX, positionY, positionZ, intensity).light;
        this.mesh.position.set(positionX, positionY, positionZ);
    }
}

class Light {
    constructor(positionX, positionY, positionZ, intensity) {
        const numWorldsWidth = Math.cbrt(Constants.World.SidesCount);

        // Add 50% of world width to capture the whole world, even when it rotates
        const lightArea = Constants.World.Width / 2 * numWorldsWidth + Constants.World.Depth * numWorldsWidth * 0.5;

        //Create a DirectionalLight and turn on shadows for the light
        this.light = new THREE.DirectionalLight("rgb(246,200,67)", intensity);
        this.light.castShadow = true

        // set light position
        this.light.position.set(positionX, positionY, positionZ);
        this.light.shadow.camera.left = -lightArea;
        this.light.shadow.camera.right = lightArea;
        this.light.shadow.camera.top = lightArea;
        this.light.shadow.camera.bottom = -lightArea;

        //Set up shadow properties for the light
        this.light.shadow.mapSize.width = Math.pow(Constants.World.Width, 2);
        this.light.shadow.mapSize.height = Math.pow(Constants.World.Depth, 2);
        this.light.shadow.camera.far =
            Math.sqrt(Math.pow(this.light.position.x, 2)
                + Math.pow(this.light.position.y, 2)
                + Math.pow(this.light.position.z, 2))
            + Constants.World.Width * numWorldsWidth;
    }
}