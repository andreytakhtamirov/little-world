import * as THREE from "three";

export default class Weather {
    constructor(conditions) {
        this.sceneBackground = null;
        this.sceneAmbientLight1 = null;
        this.sceneAmbientLight2 = null;

        switch (conditions) {
            case 1:
                this.sceneBackground = new THREE.Color("rgb(186,212,255)");
                this.sceneAmbientLight1 = new THREE.AmbientLight("rgb(236,222,136)", 0.3);
                this.sceneAmbientLight2 = new THREE.AmbientLight("rgb(232,104,104)", 0.7);
                this.conditions = 'sunny';
                break;
            case 2:
                this.sceneBackground = new THREE.Color("rgb(182,184,187)");
                this.sceneAmbientLight1 = new THREE.AmbientLight("rgb(65,65,65)", 0.3);
                this.sceneAmbientLight2 = new THREE.AmbientLight("rgb(45,45,45)", 0.7);
                this.conditions = 'cloudy';
                break;
            case 3:
                this.sceneBackground = new THREE.Color("rgb(186,212,255)");
                this.sceneAmbientLight1 = new THREE.AmbientLight("rgb(236,222,136)", 0.3);
                this.sceneAmbientLight2 = new THREE.AmbientLight("rgb(232,104,104)", 0.7);
                this.conditions = 'clear';
                break;
            case 4:
                this.sceneBackground = new THREE.Color("rgb(198,209,234)");
                this.sceneAmbientLight1 = new THREE.AmbientLight("rgb(131,131,131)", 0.3);
                this.sceneAmbientLight2 = new THREE.AmbientLight("rgb(39,64,79)", 0.7);
                this.conditions = 'snowy';
                break;
        }
    }
}