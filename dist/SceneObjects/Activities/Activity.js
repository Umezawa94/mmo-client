export class Activity {
    constructor(target, startTime) {
        this._target = target;
        this._startTime = startTime;
    }
    get startTime() {
        return this._startTime;
    }
    /**
     * Called when Activity starts
     *
     * @memberof Activity
     */
    onStart() {
    }
    /**
     * Called when replacing an Activity of the same type
     * When returning true, will onStart and onEnd wont be called
     *
     * @memberof Activity
     */
    onReplace(replaces) {
        return false;
    }
    /**
     * Called every frame while Activity is active
     *
     * @param {number} time time that passed since the start of the Activity
     * @memberof Activity
     */
    update(time) {
    }
    /**
     * Called when Activity is removed
     *
     * @memberof Activity
     */
    onEnd() {
    }
    get type() {
        return "generic";
    }
    ;
}
//# sourceMappingURL=Activity.js.map