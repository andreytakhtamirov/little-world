import Utils from "../utils";

const ResolutionStorageKey = 'Resolution';
const ResolutionWidths = [480, 720, 1920, 2560, 4000];
var SetResolutionWidth = 1;
var ResolutionRatio = 1;
const WorldSidesCount = 1;
const WorldRotationSpeed = 0.10;
const WorldWidth = 50;
const WorldHeight = 5;
const WorldDepth = 50;

var SeedCount; // Seed value for random number generator
var Seed; // Store original generated seed

const MinCloudsCount = 3;
const MaxCloudsCount = 10;
const RainDropsPerCloud = 30;
const CloudMovementSpeed = 0.004;
const CloudParticleMovementSpeed = 0.5;
const CloudParticleMoveTimeOut = 300;
const CloudParticleMinHeight = 15;
const CloudParticleMaxHeight = 20;

const WindSpeedX = Utils.randomNumberOriginal(-CloudMovementSpeed, CloudMovementSpeed);
const WindSpeedY = 0;
const WindSpeedZ = Utils.randomNumberOriginal(-CloudMovementSpeed, CloudMovementSpeed);

const MinNumOfForests = 3;
const MaxNumOfForests = 5;
const TreesPerForest = 10;
const LeafMovementSpeed = 0.02;

const InitialRiverSpeed = 20;

export class Page {
    static get ResolutionStorageKey() {
        return ResolutionStorageKey;
    }

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
    static get SeedCount() {
        SeedCount -= 1;
        return SeedCount;
    }

    static NewSeed() {
        SeedCount = Utils.randomIntegerOriginal(-100000, 100000);
        Seed = SeedCount;
    }

    static get Seed() {
        return Seed;
    }

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

    static get ParticleMinHeight() {
        return CloudParticleMinHeight;
    }

    static get ParticleMaxHeight() {
        return CloudParticleMaxHeight;
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

export class River {
    static get InitialSpeed() {
        return InitialRiverSpeed;
    }
}