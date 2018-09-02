export class InputManager {
    constructor(scene) {
        this._keymap = {};
        this._actionManager = scene.actionManager = new BABYLON.ActionManager(scene);
        this._actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
            this._keymap[evt.sourceEvent.code] = true;
        }));
        this._actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
            delete this._keymap[evt.sourceEvent.code];
        }));
        scene.getEngine().onCanvasBlurObservable.add(() => {
            this._keymap = {};
        });
        window.addEventListener('blur', () => {
            this._keymap = {};
        });
    }
    isKeyDown(code) {
        return this._keymap[code] === true;
    }
}
//# sourceMappingURL=InputManager.js.map