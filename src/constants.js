const ResolutionWidth = 2560; // Keep resolution at 2560x1440 if greater
var ResolutionRatio = 1;
const WorldSidesCount = 1;
const WorldRotationSpeed = 0.001;
const WorldWidth = 30;
const WorldHeight = 1;
const WorldDepth = 30;

const MinCloudsCount = 2;
const MaxCloudsCount = 5;
const RainDropsPerCloud = 30;
const CloudMovementSpeed = 0.01; // 0.001
const CloudParticleMovementSpeed = 0.002; //0.002
const CloudParticleMoveTimeOut = 3000;  //3000

const MinNumOfForests = 2;
const MaxNumOfForests = 3;
const TreesPerForest = 10;
const LeafMovementSpeed = 0.02;

export class Page {
    static get ResolutionRatio() {
        return ResolutionRatio;
    }

    static set ResolutionRatio(newRatio) {
        ResolutionRatio = newRatio;
    }

    static get ResolutionWidth() {
        return ResolutionWidth;
    }
}

export class World {
    static get SidesCount() {
        return WorldSidesCount;
    }

    static get RotationSpeed() {
        return WorldRotationSpeed;
    }

    static get Width() {
        return WorldWidth;
    }

    static get Height() {
        return WorldHeight;
    }

    static get Depth() {
        return WorldDepth;
    }
}

export class Cloud {
    static get MinCount() {
        return MinCloudsCount;
    }

    static get MaxCount() {
        return MaxCloudsCount;
    }

    static get RainDropsCount() {
        return RainDropsPerCloud;
    }

    static get MoveSpeed() {
        return CloudMovementSpeed;
    }

    static get ParticleMoveSpeed() {
        return CloudParticleMovementSpeed;
    }

    static get ParticleMoveTimeOut() {
        return CloudParticleMoveTimeOut;
    }
}

export class Forest {
    static get MinCount() {
        return MinNumOfForests;
    }

    static get MaxCount() {
        return MaxNumOfForests;
    }

    static get TreesCount() {
        return TreesPerForest;
    }

    static get LeafMoveSpeed() {
        return LeafMovementSpeed;
    }
}