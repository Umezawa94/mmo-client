import { System } from "./System.js";
import { SceneObject } from "../SceneObjects/SceneObject.js";
import { DynamicObject } from "../SceneObjects/DynamicObject.js";
import { AssetManager } from "../AssetManager.js";
import { TerrainSystem } from "./TerrainSystem.js";

export class ObjectSystem extends System {

    private _sceneObjects : SceneObject[] = [];
    private _dynamicObjects : DynamicObject[] = [];
    private _assetManager : AssetManager;
    protected _terrainSystem : TerrainSystem;
    
    private _nameCounter : number = 0;
    protected timeOffset : number = 0;
    
    constructor(scene : BABYLON.Scene, assetManager: AssetManager, terrainSystem : TerrainSystem){
        super(scene);
        this._terrainSystem = terrainSystem;
        this._assetManager = assetManager;
    }

    protected buildScene(scene : BABYLON.Scene) : void{

    }
    protected update(scene : BABYLON.Scene, delta : number) : void{
        // for (let i = 0; i < this._dynamicObjects.length; i++) {
        //     const dynObject = this._dynamicObjects[i];
        //     dynObject.update(scene, delta);
        // }
    }

    public add(object : SceneObject){
        this._sceneObjects.push(object);

        if(object instanceof DynamicObject){
            this._dynamicObjects.push(object);
        }

        setTimeout(()=>{
            object.buildScene(this.scene, this._assetManager);
        },0);
        

    }

    public nextName(){
        return "object"+ this._nameCounter++;
    }

    public getTime() : number{
        return performance.now() + this.timeOffset;
    }

    get terrainSystem(){
        return this._terrainSystem;
    }
}