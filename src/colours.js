export class World {
    static get Grass() {
        return "rgb(38,72,20)";
    }

    static get GrassOutline() {
        return "rgb(36,68,19)";
    }
}

export class Tree {
    static get Stem() {
        return "rgb(68,44,7)";
    }

    static get StemOutline() {
        return "rgb(47,31,8)";
    }

    static get Leaves() {
        return [
            "rgb(39,68,32)",
            "rgb(35,80,15)",
            "rgb(63,78,23)",
            "rgb(21,75,18)",
            "rgb(26,77,5)",
            "rgb(48,84,35)",
            "rgb(53,86,43)",
            "rgb(35,96,17)"];
    }
}

export class Cloud {
    static get Material() {
        return "rgb(213,213,213)";
    }
}

export class Rain {
    static get Material() {
        return "rgb(107,201,255)";
    }

    static get Outline() {
        return "rgb(1,45,116)";
    }
}

export class Star {
    static get Material() {
        return "rgb(255,129,22)";
    }

    static get Outline() {
        return "rgb(180,91,17)";
    }
}

export class Moon {
    static get Material() {
        return "rgb(123,123,121)";
    }

    static get Outline() {
        return "rgb(0,0,0)";
    }
}