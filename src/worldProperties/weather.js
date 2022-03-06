import * as THREE from "three";
import * as Colours from "../worldProperties/colours"

export default class Weather {
    constructor(conditions) {
        this.sceneBackground = null;
        this.ambientLights = [];
        this.sunColour = null
        let colours;

        switch (conditions) {
            case 1:
                colours = Colours.Weather.Sunny;
                this.sceneBackground = new THREE.Color(colours[0]);
                this.sunColour = new THREE.Color(colours[1]);
                this.ambientLights.push(new THREE.AmbientLight(colours[2], 0));
                this.ambientLights.push(new THREE.AmbientLight(colours[3], 0.3));
                this.ambientLights.push(new THREE.AmbientLight(colours[4], 0.2));
                this.conditions = 'sunny';
                break;
            case 2:
                colours = Colours.Weather.Cloudy;
                this.sceneBackground = new THREE.Color(colours[0]);
                this.sunColour = new THREE.Color(colours[1]);
                this.ambientLights.push(new THREE.AmbientLight(colours[2], 0.3));
                this.ambientLights.push(new THREE.AmbientLight(colours[3], 0.3));
                this.ambientLights.push(new THREE.AmbientLight(colours[4], 0.7));
                this.conditions = 'cloudy';
                break;
            case 3:
                colours = Colours.Weather.Clear;
                this.sceneBackground = new THREE.Color(colours[0]);
                this.sunColour = new THREE.Color(colours[1]);
                this.ambientLights.push(new THREE.AmbientLight(colours[2], 0));
                this.ambientLights.push(new THREE.AmbientLight(colours[3], 0.3));
                this.ambientLights.push(new THREE.AmbientLight(colours[4], 0.7));
                this.conditions = 'clear';
                break;
            case 4:
                colours = Colours.Weather.Snowy;
                this.sceneBackground = new THREE.Color(colours[0]);
                this.sunColour = new THREE.Color(colours[1]);
                this.ambientLights.push(new THREE.AmbientLight(colours[2], 0.2));
                this.ambientLights.push(new THREE.AmbientLight(colours[3], 0.1));
                this.ambientLights.push(new THREE.AmbientLight(colours[4], 0.1));
                this.conditions = 'snowy';
                break;
            case 5:
                colours = Colours.Weather.Snowy_clear;
                this.sceneBackground = new THREE.Color(colours[0]);
                this.sunColour = new THREE.Color(colours[1]);
                this.ambientLights.push(new THREE.AmbientLight(colours[2], 0.2));
                this.ambientLights.push(new THREE.AmbientLight(colours[3], 0.1));
                this.ambientLights.push(new THREE.AmbientLight(colours[4], 0.4));
                this.conditions = 'snowy_clear';
                break;
            default:
                colours = Colours.Weather.Sunny;
                this.sceneBackground = new THREE.Color(colours[0]);
                this.sunColour = new THREE.Color(colours[1]);
                this.ambientLights.push(new THREE.AmbientLight(colours[2], 0));
                this.ambientLights.push(new THREE.AmbientLight(colours[3], 0.3));
                this.ambientLights.push(new THREE.AmbientLight(colours[4], 0.7));
                this.conditions = 'sunny';
                break;
        }
    }
}