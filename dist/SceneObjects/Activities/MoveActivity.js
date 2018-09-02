import { Activity } from "./Activity.js";
import { VectorTools } from "../../VectorTools.js";
export class MoveActivity extends Activity {
    constructor(target, startTime, startPosition, direction) {
        super(target, startTime);
        this._startPosition = BABYLON.Vector3.Zero();
        this._direction = BABYLON.Vector3.Zero();
        this.initialize(startTime, startPosition, direction);
    }
    initialize(startTime, startPosition, direction) {
        this._startTime = startTime;
        this._startPosition.copyFrom(startPosition);
        this._direction.copyFrom(direction);
    }
    ;
    onStart() {
        VectorTools.getEulerFromDirection(this._direction, MoveActivity._rotation);
        this._target.rotation.copyFrom(MoveActivity._rotation);
    }
    update(time) {
        this._target.position.copyFrom(this._startPosition);
        this._direction.scaleAndAddToRef(time, this._target.position);
    }
    get type() {
        return "move";
    }
    ;
}
MoveActivity._rotation = BABYLON.Vector3.Zero();
//# sourceMappingURL=MoveActivity.js.map