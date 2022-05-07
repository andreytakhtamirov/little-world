import * as THREE from "three";
import Utils from "../utils";
import * as TWEEN from "@tweenjs/tween.js";
import * as Constants from "../worldProperties/constants";

export default class Player {
    constructor(obj, camera) {
        if (obj == null) {
            let material = new THREE.MeshStandardMaterial({ color: new THREE.Color("rgb(108,80,80)") });
            let geometry = new THREE.BoxGeometry(2, 2, 2);
            this.mesh = new THREE.Mesh(geometry, material);
        }

        let cube = null;
        cube = obj;
        this.mesh = cube;
        this.closestTree = null;

        this.defaultMovement = 2;
        this.minMovement = 0.9;
        this.movement = this.defaultMovement;
        this.isHitting = null;
        this.hitBox = 3.4;
        let moveLock = 0;
        let tweenUp;
        let tweenTurn;
        let tweenMove;
        let tweenDown;

        let kJump = 0.05;
        let kWalk = 1.90;

        let durationUp = 1;
        let durationTurn = 40;
        let durationMove = 280;
        let durationDown = 1;

        let jumpHeight = this.getMovement * kJump;

        let player = this;
        KeyboardController({
            // D
            68: function () {
                if (player != null && player.getPosition.x + (player.defaultMovement * kWalk) > Constants.World.Width / 2 - 1) {
                    if (player.getPosition.x + (player.minMovement * kWalk) < Constants.World.Width / 2) {
                        player.getMovement = player.minMovement;
                    } else {
                        player.getMovement = 0;
                    }
                } else if (player != null) {
                    player.getMovement = player.defaultMovement;
                }
                if (!moveLock) {
                    moveLock = 1;
                    let position = { x: cube.position.x, y: cube.position.y };
                    tweenUp = new TWEEN.Tween(position).to({
                        x: cube.position.x,
                        y: cube.position.y + jumpHeight
                    }, durationUp).onUpdate(function ({ x, y }) {
                        cube.position.x = x;
                        cube.position.y = y;
                    });
                    tweenTurn = new TWEEN.Tween({ rotation: cube.rotation.y }).to({
                        rotation: Utils.getRadians(90)
                    }, durationTurn).onUpdate(function ({ rotation }) {
                        cube.rotation.set(0, rotation, 0);
                    });

                    let move = player.getMovement * kWalk;
                    tweenMove = new TWEEN.Tween({ x: cube.position.x, y: cube.position.y + jumpHeight }).to({
                        x: position.x + move,
                        y: position.y
                    }, durationMove).onUpdate(function ({ x, y }) {
                        camera.position.x += Math.abs(cube.position.x - x);
                        camera.rotation.z -= Utils.getRadians(Math.abs(cube.position.x - x) * 0.05);
                        cube.position.x = x;
                        cube.position.y = y;
                    });
                    tweenDown = new TWEEN.Tween({ x: cube.position.x + move, y: cube.position.y }).to({
                        x: position.x + move,
                        y: position.y
                    }, durationDown).onUpdate(function ({ x, y }) {
                        cube.position.x = x;
                        cube.position.y = y;
                    }).onComplete(function () {
                        moveLock = 0;
                    });

                    if (cube.rotation.y === Utils.getRadians(90)) {
                        tweenTurn.duration(0);
                    }
                    tweenUp.chain(tweenTurn);
                    tweenTurn.chain(tweenMove);
                    tweenMove.chain(tweenDown);
                    tweenUp.start();
                }
            },
            // A
            65: function () {
                if (player != null && player.getPosition.x - (player.defaultMovement * kWalk) < -Constants.World.Width / 2 + 1) {
                    if (player.getPosition.x - (player.minMovement * kWalk) > -Constants.World.Width / 2) {
                        player.getMovement = player.minMovement;
                    } else {
                        player.getMovement = 0;
                    }
                } else if (player != null) {
                    player.getMovement = player.defaultMovement;
                }
                if (!moveLock) {
                    moveLock = 2;
                    let position = { x: cube.position.x, y: cube.position.y };
                    tweenUp = new TWEEN.Tween(position).to({
                        x: cube.position.x,
                        y: cube.position.y + jumpHeight
                    }, durationUp).onUpdate(function ({ x, y }) {
                        cube.position.x = x;
                        cube.position.y = y;
                    });
                    tweenTurn = new TWEEN.Tween({ rotation: cube.rotation.y }).to({
                        rotation: Utils.getRadians(270)
                    }, durationTurn).onUpdate(function ({ rotation }) {
                        cube.rotation.set(0, rotation, 0);
                    });
                    let move = player.getMovement * kWalk;
                    tweenMove = new TWEEN.Tween({ x: cube.position.x, y: cube.position.y + jumpHeight }).to({
                        x: position.x - move,
                        y: position.y
                    }, durationMove).onUpdate(function ({ x, y }) {
                        camera.position.x -= Math.abs(cube.position.x - x);
                        camera.rotation.z += Utils.getRadians(Math.abs(cube.position.x - x) * 0.05);
                        cube.position.x = x;
                        cube.position.y = y;
                    });
                    tweenDown = new TWEEN.Tween({ x: cube.position.x - move, y: cube.position.y }).to({
                        x: position.x - move,
                        y: position.y
                    }, durationDown).onUpdate(function ({ x, y }) {
                        cube.position.x = x;
                        cube.position.y = y;
                    }).onComplete(function () {
                        moveLock = 0;
                    });

                    if (cube.rotation.y === Utils.getRadians(270)) {
                        tweenTurn.duration(0);
                    }
                    tweenUp.chain(tweenTurn);
                    tweenTurn.chain(tweenMove);
                    tweenMove.chain(tweenDown);
                    tweenUp.start();
                }
            },
            // S
            83: function () {
                if (player != null && player.getPosition.z + (player.defaultMovement * kWalk) > Constants.World.Depth / 2 - 1) {
                    if (player.getPosition.z + (player.minMovement * kWalk) < Constants.World.Depth / 2) {
                        player.getMovement = player.minMovement;
                    } else {
                        player.getMovement = 0;
                    }
                } else if (player != null) {
                    player.getMovement = player.defaultMovement;
                }
                if (!moveLock) {
                    moveLock = 3;
                    let position = { z: cube.position.z, y: cube.position.y };
                    tweenUp = new TWEEN.Tween(position).to({
                        z: cube.position.z,
                        y: cube.position.y + jumpHeight
                    }, durationUp).onUpdate(function ({ z, y }) {
                        cube.position.z = z;
                        cube.position.y = y;
                    });
                    tweenTurn = new TWEEN.Tween({ rotation: cube.rotation.y }).to({
                        rotation: Utils.getRadians(0)
                    }, durationTurn).onUpdate(function ({ rotation }) {
                        cube.rotation.set(0, rotation, 0);
                    });
                    let move = player.getMovement * kWalk;
                    tweenMove = new TWEEN.Tween({ z: cube.position.z, y: cube.position.y + jumpHeight }).to({
                        z: position.z + move,
                        y: position.y
                    }, durationMove).onUpdate(function ({ z, y }) {
                        camera.position.z += Math.abs((cube.position.z - z) * 0.9);
                        camera.position.y -= Math.abs((cube.position.z - z) * 0.3);
                        camera.rotation.x += Utils.getRadians(Math.abs(cube.position.z - z) * 0.45);
                        cube.position.z = z;
                        cube.position.y = y;
                    });
                    tweenDown = new TWEEN.Tween({ z: cube.position.z + move, y: cube.position.y }).to({
                        z: position.z + move,
                        y: position.y
                    }, durationDown).onUpdate(function ({ z, y }) {
                        cube.position.z = z;
                        cube.position.y = y;
                    }).onComplete(function () {
                        moveLock = 0;
                    });

                    if (cube.rotation.y === Utils.getRadians(0)) {
                        tweenTurn.duration(0);
                    }
                    tweenUp.chain(tweenTurn);
                    tweenTurn.chain(tweenMove);
                    tweenMove.chain(tweenDown);
                    tweenUp.start();
                }
            },
            // W
            87: function () {
                if (player != null && player.getPosition.z - (player.defaultMovement * kWalk) < -Constants.World.Depth / 2 + 1) {
                    if (player.getPosition.z - (player.minMovement * kWalk) > -Constants.World.Depth / 2) {
                        player.getMovement = player.minMovement;
                    } else {
                        player.getMovement = 0;
                    }
                } else if (player != null) {
                    player.getMovement = player.defaultMovement;
                }
                if (!moveLock) {
                    moveLock = 4;
                    let position = { z: cube.position.z, y: cube.position.y };
                    tweenUp = new TWEEN.Tween(position).to({
                        z: cube.position.z,
                        y: cube.position.y + jumpHeight
                    }, durationUp).onUpdate(function ({ z, y }) {
                        cube.position.z = z;
                        cube.position.y = y;
                    });
                    tweenTurn = new TWEEN.Tween({ rotation: cube.rotation.y }).to({
                        rotation: Utils.getRadians(180)
                    }, durationTurn).onUpdate(function ({ rotation }) {
                        cube.rotation.set(0, rotation, 0);
                    });
                    let move = player.getMovement * kWalk;
                    tweenMove = new TWEEN.Tween({ z: cube.position.z, y: cube.position.y + jumpHeight }).to({
                        z: position.z - move,
                        y: position.y
                    }, durationMove).onUpdate(function ({ z, y }) {
                        camera.position.z -= Math.abs((cube.position.z - z) * 0.9);
                        camera.position.y += Math.abs((cube.position.z - z) * 0.3);
                        camera.rotation.x -= Utils.getRadians(Math.abs(cube.position.z - z) * 0.45);
                        cube.position.z = z;
                        cube.position.y = y;
                    });
                    tweenDown = new TWEEN.Tween({ z: cube.position.z - move, y: cube.position.y }).to({
                        z: position.z - move,
                        y: position.y
                    }, durationDown).onUpdate(function ({ z, y }) {
                        cube.position.z = z;
                        cube.position.y = y;
                    }).onComplete(function () {
                        moveLock = 0;
                    });

                    if (cube.rotation.y === Utils.getRadians(180)) {
                        tweenTurn.duration(0);
                    }
                    tweenUp.chain(tweenTurn);
                    tweenTurn.chain(tweenMove);
                    tweenMove.chain(tweenDown);
                    tweenUp.start();
                }
            },
            32: function () {
                if (!moveLock) {
                    moveLock = 5;
                    player.isHitting = true;
                    let jump = 1;
                    let position = { x: cube.position.x, y: cube.position.y, z: cube.position.z };
                    let storedRotation = { x: cube.rotation.x, y: cube.rotation.y, z: cube.rotation.z };
                    tweenUp = new TWEEN.Tween(position).to({
                        x: cube.position.x,
                        y: cube.position.y + jump,
                        z: cube.position.z
                    }, 50).onUpdate(function ({ x, y, z }) {
                        cube.position.x = x;
                        cube.position.y = y;
                        cube.position.z = z;
                    });
                    let tweenHitForward;

                    const geometry3 = new THREE.TorusGeometry(player.hitBox, 0.01, 4, 10);
                    const material3 = new THREE.MeshBasicMaterial({ color: "rgb(255,213,0)" });
                    const torus3 = new THREE.Mesh(geometry3, material3);

                    const geometry = new THREE.TorusGeometry(player.hitBox, 0.4, 4, 20);
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

                    player.mesh.add(torus);
                    player.mesh.add(torus2);
                    tweenHitForward = new TWEEN.Tween({ rotation: cube.rotation.y }).to({
                        rotation: storedRotation.y + Utils.getRadians(720)
                    }, 450).onUpdate(function ({ rotation }) {
                        cube.rotation.set(storedRotation.x, rotation, storedRotation.z);
                    }).onComplete(function () {
                        player.mesh.remove(torus);
                        player.mesh.remove(torus2);
                    });

                    tweenDown = new TWEEN.Tween({ x: cube.position.x, y: cube.position.y, z: cube.position.z }).to({
                        x: position.x,
                        y: position.y,
                        z: position.z
                    }, 50).onUpdate(function ({ x, y, z }) {
                        cube.position.x = x;
                        cube.position.y = y;
                        cube.position.z = z;
                    }).onComplete(function () {
                        moveLock = 0;
                        player.isHitting = false;
                    });
                    tweenUp.chain(tweenHitForward);
                    tweenHitForward.chain(tweenDown);
                    tweenHitForward.easing(TWEEN.Easing.Circular.InOut);
                    tweenUp.start();
                }
            }
        }, 50);
    }

    set getMovement(newMovement) {
        this.movement = newMovement;
    }

    get getMovement() {
        return this.movement;
    }

    get getPosition() {
        return this.mesh.position;
    }

    cancelKeyEvents() {
        document.onkeydown = null;
        document.onkeyup = null;
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