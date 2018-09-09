import { CharacterObject } from "./CharacterObject.js";
import { AssetManager } from "../AssetManager.js"
import { InputManager } from "../InputManager.js"
import { ObjectSystem } from "../Systems/ObjectSystem.js";
import { VectorTools } from "../VectorTools.js";
import { MoveActivity } from "./Activities/MoveActivity.js";
import { FallActivity } from "./Activities/FallActivity.js";
import { Vector3 } from "babylonjs";

export class PlayerObject extends CharacterObject{
    private _inputManager : InputManager;
    _camera : BABYLON.ArcRotateCamera;

    private _dir : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private _vecRight : BABYLON.Vector3 = BABYLON.Vector3.Zero();
    protected _dirOld : BABYLON.Vector3 = BABYLON.Vector3.Zero();

    protected _gravityEnabled : boolean = true;
    protected _isFalling : boolean = true;

    constructor(objectSystem : ObjectSystem, inputManager : InputManager, camera : BABYLON.ArcRotateCamera){
        super(objectSystem);
        this._inputManager = inputManager;
        this._camera = camera;
        this.getScene().actionManager!.registerAction(new BABYLON.ExecuteCodeAction( BABYLON.ActionManager.OnEveryFrameTrigger, this.update.bind(this)));
        inputManager.registerKeyDownAction("Space", this.jump.bind(this));
    }

    public buildScene(scene : BABYLON.Scene, assetManager : AssetManager){
        this.ellipsoid = new BABYLON.Vector3(100,200,100);
        this.attachment.attachmentPoint.set(0,-100,0);

        assetManager.cloneMesh("ManuelBastion.babylon", "f_an03").then((mesh)=>{
            mesh.parent = this;
            mesh.position = new BABYLON.Vector3(0,-100,0);
            mesh.scaling = new BABYLON.Vector3(100,100,100);
            mesh.rotation.y = Math.PI
        });
        let cameraMesh = new BABYLON.Mesh(this.name + "camera", this.getScene(), this);
        cameraMesh.position.y = 50;
        this._camera.setTarget(cameraMesh);


        
        // let ellipsoidMesh = BABYLON.MeshBuilder.CreateSphere(this.name+"ellipsoid",{
        //     segments: 8,
        //     diameterX: this.ellipsoid.x,
        //     diameterY: this.ellipsoid.y,
        //     diameterZ: this.ellipsoid.z
        // },scene);
        // ellipsoidMesh.material = new BABYLON.StandardMaterial(this.name+"ellipsoidMat", scene);
        // ellipsoidMesh.material.wireframe = true;
        // (<BABYLON.StandardMaterial>ellipsoidMesh.material).disableLighting = true;
        // (<BABYLON.StandardMaterial>ellipsoidMesh.material).emissiveColor.set(1,0,0);
        // ellipsoidMesh.parent = this;

    };

    public update(evt: BABYLON.ActionEvent) : void{
        const input = this._inputManager;
        let delta = this.getEngine().getDeltaTime();
        if(this._gravityEnabled && !this._attachment.isAttached){
            if(!this.getActivity("fall")){
                this.addActivity(new FallActivity(this, this._objectSystem.getTime(), this._objectSystem.terrainSystem, this.position, BABYLON.Vector3.Zero()))
            }
        }

        this._dir.set(0,0,0);

        let front = this._camera.getForwardRay().direction;
        let up = this._camera.upVector;
        
        VectorTools.planeProject(front, up, front);
        front.normalize();
        const right = this._vecRight;
        BABYLON.Vector3.CrossToRef(up, front, right);


        if(input.isKeyDown('KeyW')){
            this._dir.addInPlace(front);
        }
        if(input.isKeyDown('KeyS')){
            this._dir.subtractInPlace(front);
        }
        if(input.isKeyDown('KeyA')){
            this._dir.subtractInPlace(right);
        }
        if(input.isKeyDown('KeyD')){
            this._dir.addInPlace(right);
        }
        this._dir.normalize();
        this._dir.scale(20 * delta / 1000);

        // this.position.addInPlace(this._dir);


        if(this._attachment.isAttached && !this._dirOld.equals(this._dir)){
            this._dirOld.copyFrom(this._dir);
            if(this._dir.length() == 0){
                this.removeActivity("move")
            } else {
                this.addActivity(new MoveActivity(this, this._objectSystem.getTime(), this.position, this._dir))
            }

        }



    }

    public jump(){

        if(!this.attachment.isAttached) return;
        let dir = new BABYLON.Vector3(0,1,0);
        let move = this.getActivity("move") as MoveActivity;
        if(move){
            dir.addInPlace(move.direction);
            this.removeActivity("move");
        }
        this.attachment.clear();
        this._dirOld.set(0,0,0);
        this.addActivity(new FallActivity(this, this._objectSystem.getTime(), this._objectSystem.terrainSystem, this.position, dir))
    }
}