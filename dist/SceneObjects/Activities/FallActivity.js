import { Activity } from "./Activity.js";
import { VectorTools } from "../../VectorTools.js";
export class FallActivity extends Activity {
    // TODO : factor in terminalVelocity
    // protected _terminalVelocity = 0.54; // in cm/ms
    // protected _terminalStartTime = 0; // in ms
    // protected _terminalStartTime = 0; // in ms
    constructor(target, startTime, terrainSystem, startPosition, direction) {
        super(target, startTime);
        this._startPosition = BABYLON.Vector3.Zero();
        this._direction = BABYLON.Vector3.Zero();
        this._newPosition = BABYLON.Vector3.Zero();
        this._ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero());
        this._rayResults = [];
        this._gravity = new BABYLON.Vector3(0, -0.000981, 0); // in cm/ms^2
        this._terrainSystem = terrainSystem;
        this.initialize(startTime, startPosition, direction);
    }
    initialize(startTime, startPosition, direction) {
        this._startTime = startTime;
        this._startPosition.copyFrom(startPosition);
        this._direction.copyFrom(direction);
    }
    ;
    onStart() {
        VectorTools.getEulerFromDirection(this._direction, FallActivity._rotation);
        this._target.rotation.copyFrom(FallActivity._rotation);
    }
    update(time) {
        this._ray.origin.copyFrom(this._target.position);
        this._newPosition.copyFrom(this._startPosition);
        this._direction.scaleAndAddToRef(time, this._newPosition);
        this._gravity.scaleAndAddToRef(time * time, this._newPosition);
        this._newPosition.subtractToRef(this._ray.origin, this._ray.direction);
        this._ray.length = 1;
        // this._ray.direction.length();
        this._terrainSystem.intersectTerrainRay(this._ray, this._rayResults);
        // debugger;
        if (this._rayResults.length == 0) {
            this._target.position.copyFrom(this._newPosition);
        }
        else {
            this._target.position.copyFrom(this._rayResults[0].pickedPoint);
            this._target.attachment.setFromPick(this._rayResults[0]);
            this._target.removeActivity(this.type);
        }
        console.log(this._rayResults);
    }
    get type() {
        return "fall";
    }
    ;
}
FallActivity._rotation = BABYLON.Vector3.Zero();
//# sourceMappingURL=FallActivity.js.map