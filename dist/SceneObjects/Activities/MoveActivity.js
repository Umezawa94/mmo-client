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
        let faceMap = this._target.attachment.attachedTo.faceMap;
        this._path = faceMap.getProjectedPath(startPosition, direction, this._target.attachment.faceId);
    }
    ;
    onStart() {
        VectorTools.getEulerFromDirection(this._direction, MoveActivity._rotation);
        this._target.rotation.copyFrom(MoveActivity._rotation);
    }
    update(time) {
        let faceId = this._path.getPointOnPath(time, this._target.position, false);
        if (faceId == null) {
            this._target.position.copyFrom(this._path.lastSegment.exit.s);
        }
        // this._target.position.copyFrom(this._startPosition);
        // this._direction.scaleAndAddToRef(time, this._target.position);
    }
    get type() {
        return "move";
    }
    ;
}
MoveActivity._rotation = BABYLON.Vector3.Zero();
//# sourceMappingURL=MoveActivity.js.map