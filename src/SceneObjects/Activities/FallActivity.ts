import { Activity } from "./Activity.js";
import { DynamicObject } from "../DynamicObject.js";
import { VectorTools } from "../../VectorTools.js";
import { TerrainSystem } from "../../Systems/TerrainSystem.js";

export class FallActivity extends Activity{
    protected _terrainSystem : TerrainSystem;

    protected _startPosition: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    protected _direction : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    protected static _rotation : BABYLON.Vector3 = BABYLON.Vector3.Zero();

    protected _newPosition : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    protected _ray : BABYLON.Ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero());
    protected _rayResults : Array<BABYLON.PickingInfo> = [];

    protected _gravity : BABYLON.Vector3 = new BABYLON.Vector3(0, -0.000981, 0); // in cm/ms^2

    // TODO : factor in terminalVelocity

    // protected _terminalVelocity = 0.54; // in cm/ms
    // protected _terminalStartTime = 0; // in ms
    // protected _terminalStartTime = 0; // in ms

    constructor(target: DynamicObject, startTime : number, terrainSystem : TerrainSystem, startPosition: BABYLON.Vector3, direction : BABYLON.Vector3){
        super(target, startTime);
        this._terrainSystem = terrainSystem;
        this.initialize(startTime, startPosition, direction);
    }

    initialize(startTime : number, startPosition: BABYLON.Vector3, direction : BABYLON.Vector3){

        this._startTime = startTime;
        this._startPosition.copyFrom(startPosition);
        this._direction.copyFrom(direction);
    };
    
    onStart(){
        VectorTools.getEulerFromDirection(this._direction, FallActivity._rotation);
        this._target.rotation.copyFrom(FallActivity._rotation);

    }

    update(time : number){
        this._ray.origin.copyFrom(this._target.position);
        this._newPosition.copyFrom(this._startPosition);
        this._direction.scaleAndAddToRef(time, this._newPosition);
        this._gravity.scaleAndAddToRef(time*time, this._newPosition);
        this._newPosition.subtractToRef(this._ray.origin, this._ray.direction);
        this._ray.length = 1;
        // this._ray.direction.length();

        this._terrainSystem.intersectTerrainRay(this._ray, this._rayResults);

        // debugger;
        if(this._rayResults.length == 0 ){
            this._target.position.copyFrom(this._newPosition);
        } else {
            this._target.position.copyFrom(this._rayResults[0].pickedPoint!);
            this._target.attachment.setFromPick(this._rayResults[0]);
            this._target.removeActivity(this.type);
        }

        console.log(this._rayResults);
        
    }
    get type(): string{
        return "fall"
    };

}