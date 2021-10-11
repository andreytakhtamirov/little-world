export default class Utils {
    static randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static create2dArray(rows) {
        let array = [];

        for (let i = 0; i < rows; i++) {
            array[i] = [];
        }
        return array;
    }
}