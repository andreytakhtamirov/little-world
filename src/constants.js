
export const ResolutionRatio = 0.6;

const WorldSidesCount = 1;

const CloudsCount = 10;
const RainDropsPerCloud = 30;
const CloudMovementSpeed = 0.01; // 0.001
const CloudParticleMovementSpeed = 0.002; //0.002
const CloudParticleMoveTimeOut = 3000;  //3000

const MinNumOfForests = 1
const MaxNumOfForests = 1;
const TreesPerForest = 20;
const LeafMovementSpeed = 0.02;

export class World {
    static get SidesCount() {
        return WorldSidesCount;
    }
}

export class Cloud {
    static get Count() {
        return CloudsCount;
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