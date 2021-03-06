import { DynamicObject } from "./DynamicObject.js";
import { TerrainObject } from "../TerrainObjects/TerrainObject.js";

export class Attachment {
    protected _target : DynamicObject;
    protected _attachedTo? : TerrainObject;
    protected _faceId? : number;
    protected _attachmentPoint : BABYLON.Vector3 = BABYLON.Vector3.Zero();

    constructor(target : DynamicObject){
        this._target = target;
    }
    setFromPick(pick : BABYLON.PickingInfo){
        this._attachedTo = <TerrainObject>pick.pickedMesh!;
        this._faceId = pick.faceId
    }

    get isAttached(){
        return this._attachedTo !== undefined;
    }

    
    get faceId() : number|undefined{
        return this._faceId;
    }
    set faceId(faceId: number|undefined){
        this._faceId = faceId;
    }

    get attachedTo() : TerrainObject|undefined{
        return this._attachedTo;
    }
    set attachedTo(attachedTo: TerrainObject|undefined){
        this._attachedTo = attachedTo;
    }
    
    get attachmentPoint() : BABYLON.Vector3{
        return this._attachmentPoint;
    }
    set attachmentPoint(attachmentPoint: BABYLON.Vector3){
        this._attachmentPoint.copyFrom(attachmentPoint);
    }

    clear(){
        this._attachedTo = undefined;
    }


}