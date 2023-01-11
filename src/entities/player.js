import * as THREE from "three";
import Utils from "../utils";
import * as TWEEN from "@tweenjs/tween.js";
import * as Constants from "../properties/constants";

export default class Player {
    constructor(obj, camera) {
        this.mesh = null;

        if (obj == null) {
            // If beaver model wasn't loaded properly, draw a cube to represent the player
            let material = new THREE.MeshStandardMaterial({ color: new THREE.Color("rgb(108,80,80)") });
            let geometry = new THREE.BoxGeometry(2, 2, 2);
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.translateY(1 + Constants.World.Height/2);
        } else {
            this.mesh = obj;
        }

        this.camera = camera;
        this.closestTree = null;
        this.isHitting = null;
        this.hitBox = 3.4;

        this.tweenUp = null;
        this.tweenTurn = null;
        this.tweenMove = null;
        this.tweenDown = null;
        this.tweenHitForward = null;

        this.defaultMovement = 2;
        this.minMovement = this.defaultMovement/2;
        this.kWalk = 1.90;
        this.moveLock = 0;
        this.movement = 0;

        this.durationDown = 1;
        this.durationTurn = 40;
        this.durationMove = 280;

        KeyboardController({
            // D
            68: () => {
                this.moveRight();
            },
            // A
            65: () => {
                this.moveLeft();
            },
            // W
            87: () => {
                this.moveUp();
            },
            // S
            83: () => {
                this.moveDown();
            },
            // Space
            32: () => {
                this.strike();
            }
        }, 50);
    }

    cancelKeyEvents() {
        document.onkeydown = null;
        document.onkeyup = null;
    }

    moveRight() {
        let mesh = this.mesh;
        let camera = this.camera;
        let move = this.defaultMovement * this.kWalk;
        if (mesh.position.x + move > Constants.World.Width / 2 - 1) {
            move = this.minMovement * this.kWalk;
            if (mesh.position.x + move > Constants.World.Width / 2) {
                this.movement = 0;
            } else {
                this.movement = this.minMovement;
            }
        } else {
            this.movement = this.defaultMovement;
        }

        this.movement *= this.kWalk;

        if (!this.moveLock) {
            this.moveLock = 1;
            let position = { x: mesh.position.x, y: mesh.position.y };
            this.tweenTurn = new TWEEN.Tween({ rotation: mesh.rotation.y }).to({
                rotation: Utils.getRadians(90)
            }, this.durationTurn).onUpdate(function ({ rotation }) {
                mesh.rotation.set(0, rotation, 0);
            });

            let move = this.movement;
            this.tweenMove = new TWEEN.Tween({ x: mesh.position.x, y: mesh.position.y }).to({
                x: position.x + move,
                y: position.y
            }, this.durationMove).onUpdate(function ({ x, y }) {
                camera.position.x += Math.abs(mesh.position.x - x);
                camera.rotation.z -= Utils.getRadians(Math.abs(mesh.position.x - x) * 0.05);
                mesh.position.x = x;
                mesh.position.y = y;
            }).onComplete(() => {
                this.moveLock = 0;
            });

            if (mesh.rotation.y === Utils.getRadians(90)) {
                this.tweenTurn.duration(0);
            }
            this.tweenTurn.chain(this.tweenMove);
            this.tweenTurn.start();
        }
    }

    moveLeft() {
        let mesh = this.mesh;
        let camera = this.camera;
        let move = this.defaultMovement * this.kWalk;
        if (mesh.position.x - move < -Constants.World.Width / 2 + 1) {
            move = this.minMovement * this.kWalk;
            if (mesh.position.x - move < -Constants.World.Width / 2) {
                this.movement = 0;
            } else {
                this.movement = this.minMovement;
            }
        } else {
            this.movement = this.defaultMovement;
        }

        this.movement *= this.kWalk;

        if (!this.moveLock) {
            this.moveLock = 2;
            let position = { x: mesh.position.x, y: mesh.position.y };
            this.tweenTurn = new TWEEN.Tween({ rotation: mesh.rotation.y }).to({
                rotation: Utils.getRadians(270)
            }, this.durationTurn).onUpdate(function ({ rotation }) {
                mesh.rotation.set(0, rotation, 0);
            });
            let move = this.movement;
            this.tweenMove = new TWEEN.Tween({ x: mesh.position.x, y: mesh.position.y }).to({
                x: position.x - move,
                y: position.y
            }, this.durationMove).onUpdate(function ({ x, y }) {
                camera.position.x -= Math.abs(mesh.position.x - x);
                camera.rotation.z += Utils.getRadians(Math.abs(mesh.position.x - x) * 0.05);
                mesh.position.x = x;
                mesh.position.y = y;
            }).onComplete(() => {
                this.moveLock = 0;
            });

            if (mesh.rotation.y === Utils.getRadians(270)) {
                this.tweenTurn.duration(0);
            }

            this.tweenTurn.chain(this.tweenMove);
            this.tweenTurn.start();
        }
    }

    moveUp() {
        let mesh = this.mesh;
        let camera = this.camera;
        let move = this.defaultMovement * this.kWalk;
        if (mesh.position.z - move < -Constants.World.Depth / 2 + 1) {
            move = this.minMovement * this.kWalk;
            if (mesh.position.z - move < -Constants.World.Depth / 2) {
                this.movement = 0;
            } else {
                this.movement = this.minMovement;
            }
        } else {
            this.movement = this.defaultMovement;
        }

        this.movement *= this.kWalk;

        if (!this.moveLock) {
            this.moveLock = 4;
            let position = { z: mesh.position.z, y: mesh.position.y };
            this.tweenTurn = new TWEEN.Tween({ rotation: mesh.rotation.y }).to({
                rotation: Utils.getRadians(180)
            }, this.durationTurn).onUpdate(function ({ rotation }) {
                mesh.rotation.set(0, rotation, 0);
            });
            let move = this.movement;
            this.tweenMove = new TWEEN.Tween({ z: mesh.position.z, y: mesh.position.y }).to({
                z: position.z - move,
                y: position.y
            }, this.durationMove).onUpdate(function ({ z, y }) {
                camera.position.z -= Math.abs((mesh.position.z - z) * 0.9);
                camera.position.y += Math.abs((mesh.position.z - z) * 0.3);
                camera.rotation.x -= Utils.getRadians(Math.abs(mesh.position.z - z) * 0.45);
                mesh.position.z = z;
                mesh.position.y = y;
            }).onComplete(() => {
                this.moveLock = 0;
            });

            if (mesh.rotation.y === Utils.getRadians(180)) {
                this.tweenTurn.duration(0);
            }

            this.tweenTurn.chain(this.tweenMove);
            this.tweenTurn.start();
        }
    }

    moveDown() {
        let mesh = this.mesh;
        let camera = this.camera;
        let move = this.defaultMovement * this.kWalk;
        if (mesh.position.z + move > Constants.World.Depth / 2 - 1) {
            move = this.minMovement * this.kWalk;
            if (mesh.position.z + move < Constants.World.Depth / 2) {
                this.movement = 0;
            } else {
                this.movement = this.minMovement;
            }
        } else {
            this.movement = this.defaultMovement;
        }

        this.movement *= this.kWalk;

        if (!this.moveLock) {
            this.moveLock = 3;
            let position = { z: mesh.position.z, y: mesh.position.y };
            this.tweenTurn = new TWEEN.Tween({ rotation: mesh.rotation.y }).to({
                rotation: Utils.getRadians(0)
            }, this.durationTurn).onUpdate(function ({ rotation }) {
                mesh.rotation.set(0, rotation, 0);
            });
            let move = this.movement;
            this.tweenMove = new TWEEN.Tween({ z: mesh.position.z, y: mesh.position.y }).to({
                z: position.z + move,
                y: position.y
            }, this.durationMove).onUpdate(function ({ z, y }) {
                camera.position.z += Math.abs((mesh.position.z - z) * 0.9);
                camera.position.y -= Math.abs((mesh.position.z - z) * 0.3);
                camera.rotation.x += Utils.getRadians(Math.abs(mesh.position.z - z) * 0.45);
                mesh.position.z = z;
                mesh.position.y = y;
            }).onComplete(() => {
                this.moveLock = 0;
            });

            if (mesh.rotation.y === Utils.getRadians(0)) {
                this.tweenTurn.duration(0);
            }

            this.tweenTurn.chain(this.tweenMove);
            this.tweenTurn.start();
        }
    }

    strike() {
        let mesh = this.mesh;

        if (!this.moveLock) {
            this.moveLock = 5;
            this.isHitting = true;
            let jump = 1;
            let position = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
            let storedRotation = { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z };
            this.tweenUp = new TWEEN.Tween(position).to({
                x: mesh.position.x,
                y: mesh.position.y + jump,
                z: mesh.position.z
            }, 50).onUpdate(function ({ x, y, z }) {
                mesh.position.x = x;
                mesh.position.y = y;
                mesh.position.z = z;
            });

            const geometry3 = new THREE.TorusGeometry(this.hitBox, 0.01, 4, 10);
            const material3 = new THREE.MeshBasicMaterial({ color: "rgb(255,213,0)" });
            const torus3 = new THREE.Mesh(geometry3, material3);

            const geometry = new THREE.TorusGeometry(this.hitBox, 0.4, 4, 20);
            const material = new THREE.MeshBasicMaterial({ color: "rgb(71,0,255)" });
            material.transparent = true;
            material.opacity = 0.2;
            const torus = new THREE.Mesh(geometry, material);
            torus.add(torus3);
            torus.rotation.set(Utils.getRadians(90), 0, 0);

            const geometry2 = new THREE.TorusGeometry(1.4, 0.01, 8, 8);
            const material2 = new THREE.MeshBasicMaterial({ color: "rgb(0,0,0)" });
            const torus2 = new THREE.Mesh(geometry2, material2);
            torus2.rotation.set(Utils.getRadians(90), 0, 0);

            this.mesh.add(torus);
            this.mesh.add(torus2);
            this.tweenHitForward = new TWEEN.Tween({ rotation: mesh.rotation.y }).to({
                rotation: storedRotation.y + Utils.getRadians(720)
            }, 450).onUpdate(function ({ rotation }) {
                mesh.rotation.set(storedRotation.x, rotation, storedRotation.z);
            }).onComplete(() => {
                this.mesh.remove(torus);
                this.mesh.remove(torus2);
            });

            this.tweenDown = new TWEEN.Tween({ x: mesh.position.x, y: mesh.position.y, z: mesh.position.z }).to({
                x: position.x,
                y: position.y,
                z: position.z
            }, 50).onUpdate(function ({ x, y, z }) {
                mesh.position.x = x;
                mesh.position.y = y;
                mesh.position.z = z;
            }).onComplete(() => {
                this.moveLock = 0;
                this.isHitting = false;
            });
            this.tweenUp.chain(this.tweenHitForward);
            this.tweenHitForward.chain(this.tweenDown);
            this.tweenHitForward.easing(TWEEN.Easing.Circular.InOut);
            this.tweenUp.start();
        }
    }
}

// Smooth object movement taken from
// https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
function KeyboardController(keys, repeat) {
    var timers = {};
    var key;
    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    document.onkeydown = function (event) {
        key = (event || window.event).keyCode;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key] = null;
            keys[key]();
            if (repeat !== 0)
                timers[key] = setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    document.onkeyup = function (event) {
        key = (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key] !== null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    window.onblur = function () {
        for (key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }
        }
        timers = {};
    };
}
