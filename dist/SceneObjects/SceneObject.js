export class SceneObject extends BABYLON.Mesh {
    constructor(objectSystem) {
        super(objectSystem.nextName(), objectSystem.scene);
        this._objectSystem = objectSystem;
        this._objectSystem.add(this);
    }
    buildScene(scene, assetManager) {
    }
    ;
}
//# sourceMappingURL=SceneObject.js.map