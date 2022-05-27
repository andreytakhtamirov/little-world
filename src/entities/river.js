import * as THREE from "three";
import Utils from "../utils";
import * as Constants from "../worldProperties/constants";
import * as Colours from "../worldProperties/colours";

export default class River {
    constructor() {
        const width = Utils.randomNumber(4, 10);

        let rotation = 0; //Math.random() * (360);
        
        let posX = 0;
        let posY = 0;
        let posZ = 0;

        const orientation = Utils.randomInteger(0, 1);
        switch (orientation) {
            case 0:
                posX = Utils.randomNumber(-20, 20);
                rotation = Utils.getRadians(90);
                break;
            case 1:
                posZ = Utils.randomNumber(-20, 20);
                break;
        }

        const material = new THREE.MeshStandardMaterial({color: Colours.River.Material});
        const geometry = new THREE.BoxBufferGeometry(51, 6, width);

        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.material.transparent = true;
        this.mesh.material.opacity = Utils.randomNumber(0.5, 0.9);

        this.mesh.position.set(posX, posY, posZ);
        this.mesh.rotation.y = rotation;
    }
}
