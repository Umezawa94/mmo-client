
/**
 * Superclass for generic systems build upon the scene
 *
 * @class System
 */
export class System {
    protected _scene : BABYLON.Scene;
    protected onAfterRenderObserver : BABYLON.Nullable<BABYLON.Observer<BABYLON.Scene>>

    constructor(scene : BABYLON.Scene){
        this._scene = scene;
        this.buildScene(scene);
        this.onAfterRenderObserver = scene.onAfterRenderObservable.add(()=>{
            this.update(this.scene, this.scene.getEngine().getDeltaTime());
        });
    }
    protected buildScene(scene : BABYLON.Scene) : void{

    }
    protected update(scene : BABYLON.Scene, delta : number) : void{

    }
    public get scene() {return this._scene};
}