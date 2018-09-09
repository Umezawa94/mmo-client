export class InputManager {
    constructor(scene) {
        this._keymap = {};
        this._actionManager = scene.actionManager = new BABYLON.ActionManager(scene);
        this._actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
            this._keymap[evt.sourceEvent.code] = true;
            // console.log(this._keymap);            
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
    registerKeyDownAction(code, callback) {
        this._actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
            if (code == evt.sourceEvent.code) {
                callback(evt);
            }
        }));
    }
    registerKeyUpAction(code, callback) {
        this._actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
            if (code == evt.sourceEvent.code) {
                callback(evt);
            }
        }));
    }
}
//# sourceMappingURL=InputManager.js.map