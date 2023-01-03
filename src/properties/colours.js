export class World {
    static get Grass() {
        return "rgb(38,72,20)";
    }

    static get SnowyGrass() {
        return "rgb(215,215,215)";
    }
}

export class Tree {
    static get Stem() {
        return "rgb(68,44,7)";
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
            "rgb(35,96,17)"
        ];
    }

    static get SnowyLeaves() {
        return [
            "rgb(190,190,190)",
            "rgb(182,192,174)",
            "rgb(168,173,158)",
            "rgb(133,152,131)",
            "rgb(107,117,103)",
            "rgb(126,129,125)",
            "rgb(109,115,106)",
            "rgb(210,210,210)"
        ];
    }
}

export class Cloud {
    static get Material() {
        return "rgb(213,213,213)";
    }
}

export class River {
    static get Material() {
        return "#195d87";
    }
    static get Stream() {
        return "#8691ea";
    }
}

export class Weather {
    static get Sunny() {
        return [
            "rgb(186,212,255)",
            "rgb(233,196,106)",
            "rgb(255,255,255)",
            "rgb(254,200,154)",
            "rgb(232,104,104)"
        ];
    }

    static get Cloudy() {
        return [
            "#6b7076",
            "rgb(182,135,135)",
            "rgb(200,178,236)",
            "rgb(65,65,65)",
            "rgb(108,117,125)"
        ];
    }

    static get Rainy() {
        return [
            "#95989b",
            "#383636",
            "#533387",
            "rgb(65,65,65)",
            "rgb(108,117,125)"
        ];
    }

    static get Clear() {
        return [
            "rgb(186,212,255)",
            "rgb(246,200,67)",
            "rgb(255,255,255)",
            "rgb(236,222,136)",
            "rgb(232,104,104)"
        ];
    }

    static get Snowy() {
        return [
            "rgb(137,141,150)",
            "rgb(120,165,182)",
            "rgb(70,70,70)",
            "rgb(58,58,58)",
            "rgb(50,50,51)"
        ];
    }

    static get Snowy_clear() {
        return [
            "rgb(137,141,150)",
            "rgb(120,165,182)",
            "rgb(70,70,70)",
            "rgb(224,158,158)",
            "rgb(50,50,51)"
        ];
    }
}

export class Snow {
    static get Material() {
        return "rgb(255,255,255)";
    }
}

export class Rain {
    static get Material() {
        return "rgb(107,201,255)";
    }
}

export class Star {
    static get Material() {
        return "rgb(255,129,22)";
    }
}

export class Moon {
    static get Material() {
        return "rgb(123,123,121)";
    }
}