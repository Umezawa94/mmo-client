import { System } from "./System.js";
import { LensFlareSystem } from "../LensFlare.js";
export class SkySystem extends System {
    constructor(scene, pipeline) {
        super(scene);
        this._time = 1.51;
        this._updateTime = 0;
        this._sunSpeed = 1 / 36000;
        this._pipeline = pipeline;
    }
    buildScene(scene) {
        this._sunLight = new BABYLON.HemisphericLight("sunLight", new BABYLON.Vector3(0, 1, 0), scene);
        // this._sunLightAmbient = new BABYLON.HemisphericLight("sunLightAmbient", new BABYLON.Vector3(0, 1, 0), this._scene);
        // this._sunLightAmbient.specular.set(0,0,0);
        this._nightAmbient = new BABYLON.HemisphericLight("nightAmbient", new BABYLON.Vector3(0, 1, 0), scene);
        this._nightAmbient.specular.set(0, 0, 0);
        this._nightAmbient.diffuse.set(0.4, 0.4, 0.6);
        this._nightAmbient.groundColor.set(0.3, 0.3, 0.5);
        this._skyMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
        var skyMaterial = this._skyMaterial;
        skyMaterial.inclination = 1.45;
        skyMaterial.backFaceCulling = false;
        skyMaterial.luminance = 0.9;
        skyMaterial.turbidity = 1.0;
        // The amount of haze particles following the Mie scattering theory
        skyMaterial.mieDirectionalG = 0.8;
        skyMaterial.mieCoefficient = 0.003; // The mieCoefficient in interval [0, 0.1], affects the property skyMaterial.mieDirectionalG
        skyMaterial.rayleigh = 1.0;
        skyMaterial.alphaMode = 1;
        skyMaterial.alpha = 0.0;
        // skyMaterial.
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 190000.0 * Math.SQRT1_2 * Math.SQRT1_2, scene);
        skybox.material = skyMaterial;
        skybox.infiniteDistance = true;
        var starbox = BABYLON.Mesh.CreateBox("starbox", 200000.0 * Math.SQRT1_2 * Math.SQRT1_2, scene);
        starbox.infiniteDistance = true;
        var starboxMaterial = this._starboxMaterial = new BABYLON.BackgroundMaterial("starbox", scene);
        starboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/nightSky", scene, ["1.png", "5.png", "2.png", "3.png", "6.png", "4.png"]);
        starboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        starboxMaterial.backFaceCulling = false;
        // starboxMaterial.disableLighting = true;
        // starboxMaterial.alphaMode = 1;
        starbox.material = starboxMaterial;
        this._lensFlareSource = new BABYLON.Mesh("lensFlareSource", scene);
        let lensFlareSystem = this._lensFlareSystem = new LensFlareSystem("lensFlareSystem", this._lensFlareSource, scene);
        var flare00 = new BABYLON.LensFlare(0.075, 1, new BABYLON.Color3(10, 10, 10), "assets/Flare.png", lensFlareSystem);
        var flare01 = new BABYLON.LensFlare(0.2, 0.1, new BABYLON.Color3(1, 1, 1), "Assets/lens5.png", lensFlareSystem);
        var flare02 = new BABYLON.LensFlare(0.5, 0.25, new BABYLON.Color3(0.5, 0.5, 1), "assets/lens4.png", lensFlareSystem);
        var flare03 = new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "assets/Flare.png", lensFlareSystem);
        var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "assets/lens5.png", lensFlareSystem);
        var flare05 = new BABYLON.LensFlare(0.3, 0.75, new BABYLON.Color3(1, 1, 1), "assets/lens4.png", lensFlareSystem);
        var flare06 = new BABYLON.LensFlare(0.2, 0.9, new BABYLON.Color3(1, 1, 1), "assets/lens4.png", lensFlareSystem);
    }
    update(scene, delta) {
        this.time += delta * 0.002 * this._sunSpeed;
        this._lensFlareSource.position = this._skyMaterial.sunPosition.scale(1000).add(scene.activeCamera.position);
        if (Math.abs(this.time - this._updateTime) > 0.0002) {
            this.lazyUpdate(scene);
            this._updateTime = this.time;
        }
    }
    lazyUpdate(scene) {
        this._skyMaterial.inclination = this.time;
        let int128 = this.intensity(this.time, 128);
        let int64 = this.intensity(this.time, 64);
        let int32 = this.intensity(this.time, 32);
        this._sunLight.direction = this._skyMaterial.sunPosition;
        // this._sunLight.intensity = intensity(this._skyMaterial.inclination);
        this._sunLight.specular.set(int128, int128, int128);
        this._sunLight.diffuse.set(int128, int64, int32);
        this._sunLight.groundColor.set(0.2 * int128, 0.2 * int64, 0.2 * int32);
        this._lensFlareSystem.color = this._sunLight.diffuse.toColor4(1);
        this._nightAmbient.intensity = 0.4 + 0.2 * Math.cos(this.time * Math.PI);
        // this._starboxMaterial.alpha = 1 - int128;
        this._starboxMaterial.reflectionTexture.level = (1 - int128) * 2;
        this._pipeline.imageProcessing.contrast = 2.5 - int128;
    }
    intensity(time, exp = 128, sunset = 0.51) {
        if (time < sunset)
            return 1 - Math.pow(Math.sin(time * Math.PI / (sunset * 2)), exp);
        if (sunset < time && time < 2 - sunset)
            return 0;
        return 1 - Math.pow(Math.sin((time - 2) * Math.PI / (sunset * 2)), exp);
    }
    get time() {
        return this._time % 2.0;
    }
    set time(value) {
        this._time = value % 2.0;
    }
    get sunSpeed() {
        return this._sunSpeed;
    }
    set sunSpeed(value) {
        this._sunSpeed = value;
    }
}
//# sourceMappingURL=SkySystem.js.map