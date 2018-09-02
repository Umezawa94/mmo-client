import { ObjectSystem } from "../Systems/ObjectSystem.js";
import { AssetManager } from "../AssetManager.js"

export class SceneObject extends BABYLON.Mesh {
    protected _objectSystem : ObjectSystem;
    constructor(objectSystem : ObjectSystem){
        super(objectSystem.nextName(), objectSystem.scene);
        this._objectSystem = objectSystem;
        this._objectSystem.add(this);
    }

    public buildScene(scene : BABYLON.Scene, assetManager : AssetManager){

    };
}