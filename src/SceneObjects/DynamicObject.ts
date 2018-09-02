import { SceneObject } from "./SceneObject.js";
import { ObjectSystem } from "../Systems/ObjectSystem.js";
import { Activity } from "./Activities/Activity.js";
import { Attachment } from "./Attachment.js";

export class DynamicObject extends SceneObject{
    protected _activities : {[key:string]: Activity};

    protected _attachment : Attachment = new Attachment(this);

   
    constructor(objectSystem : ObjectSystem){
        super(objectSystem);
        this.actionManager = new BABYLON.ActionManager(this.getScene());
        this._activities = {};
        this.getScene().actionManager!.registerAction(new BABYLON.ExecuteCodeAction( BABYLON.ActionManager.OnEveryFrameTrigger, this._updateActivities.bind(this)));
    }
    protected _updateActivities(){
        const delta = this.getEngine().getDeltaTime();

        for (const key in this._activities) {
            if (this._activities.hasOwnProperty(key)) {
                const activity = this._activities[key];
                
                activity.update(this._objectSystem.getTime() - activity.startTime);
            }
        }
    }
    
    public addActivity(activity : Activity){
        let replaces = false;
        if(this._activities[activity.type]){
            const oldActivity = this._activities[activity.type];
            replaces = activity.onReplace(oldActivity);
            if(!replaces){
                oldActivity.onEnd();
            }
        }
        this._activities[activity.type] = activity;
        if(!replaces){
            activity.onStart();
        }
    }

    public removeActivity(type : string){
        if(!this._activities[type]){
            return;
        }
        const oldActivity = this._activities[type];
        oldActivity.onEnd();
        delete this._activities[type];
    }

    public getActivity(type : string) : Activity{
        return this._activities[type];
    }
    get attachment() : Attachment{
        return this._attachment;
    }
}