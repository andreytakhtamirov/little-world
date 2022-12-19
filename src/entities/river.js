import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Utils from "../utils";
import * as Constants from "../properties/constants";
import * as Colours from "../properties/colours";
import Stream from "./particles/stream";
import BigStream from "./particles/bigStream";

export default class River {
    constructor() {
        const worldLength = Constants.World.Width;
        const worldHeight = Constants.World.Height;
        const width = Utils.randomNumber(worldLength * 0.17, worldLength * 0.22);

        let rotation = 0;
        let position = Utils.randomNumber(-worldLength / 2 + width / 2 - 0.5, worldLength / 2 - width / 2 + 0.5);

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
            default:
                break;
        }

        const material = new THREE.MeshStandardMaterial({ color: Colours.River.Material });
        const geometry = new THREE.BoxGeometry(worldLength + 1, worldHeight + 1, width);

        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.material.transparent = true;
        this.mesh.material.opacity = Utils.randomNumber(0.5, 0.8);

        this.mesh.position.set(posX, posY, posZ);
        this.mesh.rotation.y = rotation;
    }

    animate() {
        let riverMesh = this.mesh;
        // TODO redo with random numbers
        if (riverMesh.children.length < 20) {
            let stream = new Stream(riverMesh);
            riverMesh.add(stream.mesh);
        } else if (riverMesh.children.length < 40) {
            let bigStream = new BigStream(riverMesh);
            riverMesh.add(bigStream.mesh);
        }

        for (let i = 0; i < riverMesh.children.length; i++) {
            let mesh = riverMesh.children[i];

            let streamPosition = new THREE.Vector3();
            mesh.getWorldPosition(streamPosition);

            let position = { x: mesh.position.x };

            let animateFlow = new TWEEN.Tween(position).to({
                x: mesh.position.x + 10
            }, 1000).onUpdate(function ({ x }) {
            
                if (mesh.position.x >= riverMesh.geometry.parameters.width/2) {
                    riverMesh.remove(mesh);
                    return;
                }
                mesh.position.x = x;
            });
            animateFlow.easing(TWEEN.Easing.Linear.None);
            animateFlow.start();
        }
    }
}
