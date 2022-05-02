export default class Utils {
    static randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
}