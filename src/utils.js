export default class Utils {
    static randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
}