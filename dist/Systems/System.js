/**
 * Superclass for generic systems build upon the scene
 *
 * @class System
 */
export class System {
    constructor(scene) {
        this._scene = scene;
        this.buildScene(scene);
        this.onAfterRenderObserver = scene.onAfterRenderObservable.add(() => {
            this.update(this.scene, this.scene.getEngine().getDeltaTime());
        });
    }
    buildScene(scene) {
    }
    update(scene, delta) {
    }
    get scene() { return this._scene; }
    ;
}
//# sourceMappingURL=System.js.map