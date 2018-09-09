import { Activity } from "./Activity.js";
import { DynamicObject } from "../DynamicObject.js";
import { VectorTools } from "../../VectorTools.js";
import { PlayerObject } from "../PlayerObject.js";
import { FaceMap } from "../../TerrainObjects/TerrainObject.js";
import { TerrainPath } from "../../TerrainObjects/TerrainPath.js";
import { DebugVisualizer } from "../../DebugVisualizer.js";

export class MoveActivity extends Activity{
    protected _startPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    protected _direction : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    protected static _rotation : BABYLON.Vector3 = BABYLON.Vector3.Zero();

    protected _path! : TerrainPath;
    protected _faceMap! : FaceMap;

    constructor(target: DynamicObject, startTime : number, startPosition: BABYLON.Vector3, direction : BABYLON.Vector3){
        super(target, startTime);
        this.initialize(startTime, startPosition, direction);
}

initialize(startTime : number, startPosition: BABYLON.Vector3, direction : BABYLON.Vector3){

    this._startTime = startTime;
    this._startPosition.copyFrom(startPosition);
    this._direction.copyFrom(direction);
    this._faceMap = this._target.attachment.attachedTo!.faceMap;
    this._path = this._faceMap.getProjectedPath(startPosition.add(this._target.attachment.attachmentPoint), direction, this._target.attachment.faceId!);
};
    
    onStart(){
        VectorTools.getEulerFromDirection(this._direction, MoveActivity._rotation);
        this._target.rotation.copyFrom(MoveActivity._rotation);
    }

    update(time : number){
        let faceId = this._path.getPointOnPath(time, this._target.position, false);
        if(faceId == null){
            this._target.position.copyFrom(this._path.lastSegment.exit.s);
        } else {
            this._target.attachment.faceId = faceId;
            DebugVisualizer.highlightFace(this._faceMap.faces[faceId], BABYLON.Color3.Red());
        }
        this._target.position.subtractInPlace(this._target.attachment.attachmentPoint);
        // this._target.position.copyFrom(this._startPosition);
        // this._direction.scaleAndAddToRef(time, this._target.position);
    }
    
    get type(): string{
        return "move"
    };

    get direction(){
        return this._direction;
    }

}