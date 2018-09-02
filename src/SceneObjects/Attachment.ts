import { DynamicObject } from "./DynamicObject";
import { TerrainObject } from "../TerrainObjects/TerrainObject";

export class Attachment {
    protected _target : DynamicObject;
    protected _attachedTo? : TerrainObject;
    constructor(target : DynamicObject){
        this._target = target;
    }
    setFromPick(pick : BABYLON.PickingInfo){
        this._attachedTo = <TerrainObject>pick.pickedMesh!;
    }

    get isAttached(){
        return this._attachedTo !== undefined;
    }


}