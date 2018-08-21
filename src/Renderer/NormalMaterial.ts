///<reference path="../babylon.d.ts" />

class NormalMaterial extends BABYLON.ShaderMaterial{
    _counter : number = 0;

    constructor(scene: BABYLON.Scene){
        super("customNormal", scene, "./shader/normal", {
            attributes: ["position", "normal"],
            uniforms: ["worldViewProjection", "matID"]
        });

        this.backFaceCulling = true;
        this.onBind = (mesh)=>{
            this._effect!.setFloat("matID", this._counter++);
            // console.log((mesh as MaterialSaver)._materialId!);
        }
    }
}