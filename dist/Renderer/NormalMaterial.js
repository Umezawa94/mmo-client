"use strict";
///<reference path="../babylon.d.ts" />
class NormalMaterial extends BABYLON.ShaderMaterial {
    constructor(scene) {
        super("customNormal", scene, "./shader/normal", {
            attributes: ["position", "normal"],
            uniforms: ["worldViewProjection", "matID"]
        });
        this._counter = 0;
        this.backFaceCulling = true;
        this.onBind = (mesh) => {
            this._effect.setFloat("matID", this._counter++);
            // console.log((mesh as MaterialSaver)._materialId!);
        };
    }
}
//# sourceMappingURL=NormalMaterial.js.map