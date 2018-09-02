import { SceneObject } from "./SceneObject.js";
import { Attachment } from "./Attachment.js";
export class DynamicObject extends SceneObject {
    constructor(objectSystem) {
        super(objectSystem);
        this._attachment = new Attachment(this);
        this.actionManager = new BABYLON.ActionManager(this.getScene());
        this._activities = {};
        this.getScene().actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, this._updateActivities.bind(this)));
    }
    _updateActivities() {
        const delta = this.getEngine().getDeltaTime();
        for (const key in this._activities) {
            if (this._activities.hasOwnProperty(key)) {
                const activity = this._activities[key];
                activity.update(this._objectSystem.getTime() - activity.startTime);
            }
        }
    }
    addActivity(activity) {
        let replaces = false;
        if (this._activities[activity.type]) {
            const oldActivity = this._activities[activity.type];
            replaces = activity.onReplace(oldActivity);
            if (!replaces) {
                oldActivity.onEnd();
            }
        }
        this._activities[activity.type] = activity;
        if (!replaces) {
            activity.onStart();
        }
    }
    removeActivity(type) {
        if (!this._activities[type]) {
            return;
        }
        const oldActivity = this._activities[type];
        oldActivity.onEnd();
        delete this._activities[type];
    }
    getActivity(type) {
        return this._activities[type];
    }
    get attachment() {
        return this._attachment;
    }
}
//# sourceMappingURL=DynamicObject.js.map