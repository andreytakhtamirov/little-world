import Utils from "../utils";

const ResolutionWidths = [720, 1920, 2560, 4000];
var SetResolutionWidth = 1;
var ResolutionRatio = 1;
const WorldSidesCount = 1;
const WorldRotationSpeed = 0.001;
const WorldWidth = 50;
const WorldHeight = 1;
const WorldDepth = 50;

const MinCloudsCount = 3;
const MaxCloudsCount = 10;
const RainDropsPerCloud = 30;
const CloudMovementSpeed = 0.004;
const CloudParticleMovementSpeed = 0.001;
const CloudParticleMoveTimeOut = 300;

const WindSpeedX = Utils.randomNumber(-CloudMovementSpeed, CloudMovementSpeed);
const WindSpeedY = 0;
const WindSpeedZ = Utils.randomNumber(-CloudMovementSpeed, CloudMovementSpeed);

const MinNumOfForests = 3;
const MaxNumOfForests = 10;
const TreesPerForest = 10;
const LeafMovementSpeed = 0.02;

export class Page {
    static get ResolutionRatio() {
        return ResolutionRatio;
    }

    static set ResolutionRatio(newRatio) {
        ResolutionRatio = newRatio;
    }

    static get ResolutionWidths() {
        return ResolutionWidths;
    }

    static get SetResolutionWidth() {
        return SetResolutionWidth;
    }

    static set SetResolutionWidth(newResolution) {
        SetResolutionWidth = newResolution;
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

    static get WindSpeedX() {
        return WindSpeedX;
    }

    static get WindSpeedY() {
        return WindSpeedY;
    }

    static get WindSpeedZ() {
        return WindSpeedZ;
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