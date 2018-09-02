export class Attachment {
    constructor(target) {
        this._target = target;
    }
    setFromPick(pick) {
        this._attachedTo = pick.pickedMesh;
    }
    get isAttached() {
        return this._attachedTo !== undefined;
    }
}
//# sourceMappingURL=Attachment.js.map