import * as THREE from "three";
import * as Constants from "../properties/constants";
import * as Colours from "../properties/colours"

export default class Sun {
    constructor(positionX, positionY, positionZ, size, lightColour, intensity) {
        const starGeometry = new THREE.BoxBufferGeometry(size, size, size);
        const starMaterial = new THREE.MeshStandardMaterial({color: Colours.Star.Material});

        this.mesh = new THREE.Mesh(starGeometry, starMaterial);
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;

        // Sun will emit light from its position
        this.light = new Light(positionX, positionY, positionZ, lightColour, intensity).light;
        this.mesh.position.set(positionX, positionY, positionZ);
    }
}

class Light {
    constructor(positionX, positionY, positionZ, colour, intensity) {
        const numWorldsWidth = Math.cbrt(Constants.World.SidesCount);

        // Add 50% of world width to capture the whole world, even when it rotates
        const lightArea = Constants.World.Width / 2 * numWorldsWidth + Constants.World.Depth * numWorldsWidth * 0.5;

        //Create a DirectionalLight and turn on shadows for the light
        this.light = new THREE.DirectionalLight(colour, intensity);
        this.light.castShadow = true

        // set light position
        this.light.position.set(positionX, positionY, positionZ);
        this.light.shadow.camera.left = -lightArea;
        this.light.shadow.camera.right = lightArea;
        this.light.shadow.camera.top = lightArea;
        this.light.shadow.camera.bottom = -lightArea;

        //Set up shadow properties for the light
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.shadow.camera.far =
            Math.sqrt(Math.pow(this.light.position.x, 2)
                + Math.pow(this.light.position.y, 2)
                + Math.pow(this.light.position.z, 2))
            + Constants.World.Width * numWorldsWidth;
    }
}