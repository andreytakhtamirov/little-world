import * as THREE from "three";
import Utils from "../utils";
import * as TWEEN from "@tweenjs/tween.js";
import * as Constants from "../worldProperties/constants";

export default class Player {
    constructor(obj, camera) {
        this.mesh = obj;
        this.closestTree = null;

        this.defaultMovement = 2;
        this.minMovement = 0.9;
        this.movement = this.defaultMovement;
        this.isHitting = null;
        this.hitBox = 3.4;
        this.moveLock = 0;
        this.tweenUp = null;
        this.tweenTurn = null;
        this.tweenMove = null;
        this.tweenDown = null;

        this.kJump = 0.05;
        this.kWalk = 1.90;

        this.durationUp = 1;
        this.durationTurn = 40;
        this.durationMove = 280;
        this.durationDown = 1;

        this.jumpHeight = this.movement * this.kJump;

        let player = this;
        KeyboardController({
            // W - 87, A - 65, S - 83, D - 68
            68: function() {
                player.moveRight(camera);
            }
        }, 100);
    }

    get position() {
        return this.mesh.position;
    }

    cancelKeyEvents() {
        document.onkeydown = null;
        document.onkeyup = null;
    }

    moveRight(camera) {
        let mesh = this.mesh;

        if (this.position.x + (this.defaultMovement * this.kWalk) > Constants.World.Width / 2 - 1) {
            if (this.position.x + (this.minMovement * this.kWalk) < Constants.World.Width / 2) {
                this.movement = this.minMovement;
            } else {
                this.movement = 0;
            }
        }
        if (!this.moveLock) {
            this.moveLock = 1;
            let position = { x: mesh.position.x, y: mesh.position.y };
            this.tweenUp = new TWEEN.Tween(position).to({
                x: mesh.position.x,
                y: mesh.position.y + this.jumpHeight
            }, this.durationUp).onUpdate(function ({ x, y }) {
                mesh.position.x = x;
                mesh.position.y = y;
            });
            this.tweenTurn = new TWEEN.Tween({ rotation: mesh.rotation.y }).to({
                rotation: Utils.getRadians(90)
            }, this.durationTurn).onUpdate(function ({ rotation }) {
                mesh.rotation.set(0, rotation, 0);
            });

            let move = this.movement * this.kWalk;
            this.tweenMove = new TWEEN.Tween({ x: mesh.position.x, y: mesh.position.y + this.jumpHeight}).to({
                x: position.x + move,
                y: position.y
            }, this.durationMove).onUpdate(function ({ x, y }) {
                camera.position.x += Math.abs(mesh.position.x - x);
                camera.rotation.z -= Utils.getRadians(Math.abs(mesh.position.x - x) * 0.05);
                mesh.position.x = x;
                mesh.position.y = y;
            });
            this.tweenDown = new TWEEN.Tween({ x: mesh.position.x + move, y: mesh.position.y }).to({
                x: position.x + move,
                y: position.y
            }, this.durationDown).onUpdate(function ({ x, y }) {
                mesh.position.x = x;
                mesh.position.y = y;
            }).onComplete(function () {
                this.moveLock = 0;
            });

            if (mesh.rotation.y === Utils.getRadians(90)) {
                this.tweenTurn.duration(0);
            }
            this.tweenUp.chain(this.tweenTurn);
            this.tweenTurn.chain(this.tweenMove);
            this.tweenMove.chain(this.tweenDown);
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