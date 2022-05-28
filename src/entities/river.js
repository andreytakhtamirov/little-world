import * as THREE from "three";
import Utils from "../utils";
import * as Constants from "../worldProperties/constants";
import * as Colours from "../worldProperties/colours";

export default class River {
    constructor() {
        const worldWidth = Constants.World.Width;
        const worldHeight = Constants.World.Height;
        const width = Utils.randomNumber(8, 10);

        let rotation = 0;
        let position = Utils.randomNumber(-worldWidth / 2 + width / 2 - 0.5, worldWidth / 2 - width / 2 + 0.5);

        let posX = 0;
        let posY = 0;
        let posZ = 0;

        const orientation = Utils.randomInteger(0, 1);
        switch (orientation) {
            case 0:
                posX = position;
                rotation = Utils.getRadians(90);
                break;
            case 1:
                posZ = position;
                rotation = 0;
                break;
        }

        const material = new THREE.MeshStandardMaterial({ color: Colours.River.Material });
        const geometry = new THREE.BoxBufferGeometry(worldWidth + 1, worldHeight + 1, width);

        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.material.transparent = true;
        this.mesh.material.opacity = Utils.randomNumber(0.5, 0.8);

        this.mesh.position.set(posX, posY, posZ);
        this.mesh.rotation.y = rotation;
    }

    animate() {

    }
}
