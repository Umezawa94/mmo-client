import { System } from "./System.js";
import { DynamicObject } from "../SceneObjects/DynamicObject.js";
export class ObjectSystem extends System {
    constructor(scene, assetManager, terrainSystem) {
        super(scene);
        this._sceneObjects = [];
        this._dynamicObjects = [];
        this._nameCounter = 0;
        this.timeOffset = 0;
        this._terrainSystem = terrainSystem;
        this._assetManager = assetManager;
    }
    buildScene(scene) {
    }
    update(scene, delta) {
        // for (let i = 0; i < this._dynamicObjects.length; i++) {
        //     const dynObject = this._dynamicObjects[i];
        //     dynObject.update(scene, delta);
        // }
    }
    add(object) {
        this._sceneObjects.push(object);
        if (object instanceof DynamicObject) {
            this._dynamicObjects.push(object);
        }
        setTimeout(() => {
            object.buildScene(this.scene, this._assetManager);
        }, 0);
    }
    nextName() {
        return "object" + this._nameCounter++;
    }
    getTime() {
        return performance.now() + this.timeOffset;
    }
    get terrainSystem() {
        return this._terrainSystem;
    }
}
//# sourceMappingURL=ObjectSystem.js.map