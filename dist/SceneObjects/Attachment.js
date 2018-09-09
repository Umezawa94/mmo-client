export class Attachment {
    constructor(target) {
        this._attachmentPoint = BABYLON.Vector3.Zero();
        this._target = target;
    }
    setFromPick(pick) {
        this._attachedTo = pick.pickedMesh;
        this._faceId = pick.faceId;
    }
    get isAttached() {
        return this._attachedTo !== undefined;
    }
    get faceId() {
        return this._faceId;
    }
    set faceId(faceId) {
        this._faceId = faceId;
    }
    get attachedTo() {
        return this._attachedTo;
    }
    set attachedTo(attachedTo) {
        this._attachedTo = attachedTo;
    }
    get attachmentPoint() {
        return this._attachmentPoint;
    }
    set attachmentPoint(attachmentPoint) {
        this._attachmentPoint.copyFrom(attachmentPoint);
    }
    clear() {
        this._attachedTo = undefined;
    }
}
//# sourceMappingURL=Attachment.js.map