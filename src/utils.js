import { Box3, Vector3, MathUtils } from 'three';
import * as Constants from './properties/constants';


export default class Utils {
    static randomIntegerOriginal(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomNumberOriginal(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomNumber(min, max) {
        return MathUtils.seededRandom(Constants.World.SeedCount) * (max - min) + min;
    }

    static randomInteger(min, max) {
        return Math.floor(MathUtils.seededRandom(Constants.World.SeedCount) * (max - min + 1)) + min;
    }

    static getWidth(mesh) {
        let boundingBox = mesh.geometry.boundingBox;
        return boundingBox.max.x - boundingBox.min.x;
    }

    static getHeight(mesh) {
        let boundingBox = mesh.geometry.boundingBox;
        return boundingBox.max.y - boundingBox.min.y;
    }

    static getDepth(mesh) {
        let boundingBox = mesh.geometry.boundingBox;
        return boundingBox.max.z - boundingBox.min.z;
    }

    static getRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    static create2dArray(rows) {
        let array = [];

        for (let i = 0; i < rows + 1; i++) {
            array[i] = [];
        }
        return array;
    }

    static setObjectSpeed(objectMovementSpeed, newSpeed) {
        for (let i = 0; i < 3; i++) {
            objectMovementSpeed[i] = Utils.randomNumber(-newSpeed, newSpeed);
        }
    }

    static setGroupSpeed(objectArr, newSpeed) {
        for (let i = 0; i < objectArr.length; i++) {
            for (let j = 0; j < 3; j++) {
                objectArr[i][j] = Utils.randomNumber(-newSpeed, newSpeed);
            }
        }
    }

    static shade(col, light) {
        let r = parseInt(col.substr(1, 2), 16);
        let g = parseInt(col.substr(3, 2), 16);
        let b = parseInt(col.substr(5, 2), 16);

        if (light < 0) {
            r = (1 + light) * r;
            g = (1 + light) * g;
            b = (1 + light) * b;
        } else {
            r = (1 - light) * r + light * 255;
            g = (1 - light) * g + light * 255;
            b = (1 - light) * b + light * 255;
        }

        function color(r, g, b) {
            return "#" + hex2(r) + hex2(g) + hex2(b);
        }

        function hex2(c) {
            c = Math.round(c);
            if (c < 0) c = 0;
            if (c > 255) c = 255;

            let s = c.toString(16);
            if (s.length < 2) s = "0" + s;

            return s;
        }

        return color(r, g, b);
    }

    static detectCollision(object1, object2) {
        object1.geometry.computeBoundingBox();
        object2.geometry.computeBoundingBox();
        object1.updateMatrixWorld(true);
        object2.updateMatrixWorld(true);
    
        let box1 = object1.geometry.boundingBox.clone();
        box1.applyMatrix4(object1.matrixWorld);
        let box2 = object2.geometry.boundingBox.clone();
        box2.applyMatrix4(object2.matrixWorld);
    
        return box1.intersectsBox(box2);
    }
    
    static detectSnowCollision(object1, object2) {
        object1.geometry.computeBoundingBox();
        object2.geometry.computeBoundingBox();
        object1.updateMatrixWorld();
        object2.updateMatrixWorld();
    
        let box1 = new Box3();
        box1.setFromObject(object1);
        box1.applyMatrix4(object1.matrixWorld);
    
        let box2 = new Box3();
        box2.setFromObject(object2);
        box2.applyMatrix4(object2.matrixWorld);
    
        return box1.intersectsBox(box2);
    }

    static distanceFromPointToCircle(circleRadius, hittingObject, targetObject) {
        let object1Position = new Vector3();
        let object2Position = new Vector3();
        hittingObject.updateMatrixWorld(true);
        targetObject.updateMatrixWorld(true);
        targetObject.getWorldPosition(object1Position);
        hittingObject.getWorldPosition(object2Position);
    
        return Math.pow(circleRadius, 2) - (Math.pow(object1Position.x - object2Position.x, 2) + Math.pow(object1Position.z - object2Position.z, 2));
    }
}