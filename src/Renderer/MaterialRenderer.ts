///<reference path="../babylon.d.ts" />


interface MaterialSaver{
    _savedMaterial?: BABYLON.Material;
    _materialId? : number;
    material?: BABYLON.Material;
}

interface CountingMaterial{
    _counter? : number;
}

class MaterialRenderer {
    _material : BABYLON.Material;
    _renderTarget : BABYLON.RenderTargetTexture;
    _scene : BABYLON.Scene;

    constructor(material: BABYLON.Material){
        this._material = material;
        this._scene = material.getScene();
        this._renderTarget = new BABYLON.RenderTargetTexture("depth", 1024, this._scene, true, true, BABYLON.Engine.TEXTURETYPE_FLOAT);
        this._renderTarget.renderList = null;
        this._renderTarget.onBeforeRender = () => {
            if ((this._material as CountingMaterial)._counter !== undefined) (this._material as CountingMaterial)._counter = 2;
            let renderList = this._renderTarget.renderList ? this._renderTarget.renderList : this._renderTarget.getScene()!.getActiveMeshes().data;
            let renderListLength = this._renderTarget.renderList ? this._renderTarget.renderList : this._renderTarget.getScene()!.getActiveMeshes().length;


            for (var index = 0; index < renderListLength; index++) {
                let mesh = renderList[index] as MaterialSaver;
                // if (mesh.material && (mesh.material as BABYLON.MultiMaterial).subMaterials){
                //     debugger;
                //     let subMeshes = (mesh as BABYLON.AbstractMesh).subMeshes;
                //     let subMaterials = (mesh.material as BABYLON.MultiMaterial).subMaterials;
                //     for (let i = 0; i < subMeshes.length; i++) {
                //         const subMesh = subMeshes[i];
                        
                //         (subMesh as MaterialSaver)._savedMaterial = subMaterials[subMesh.materialIndex]!;
                //         (subMesh as MaterialSaver)._materialId = index;
                //         subMaterials[subMesh.materialIndex] = this._material;
                //     }
                // } else {
                    if(!(mesh instanceof BABYLON.InstancedMesh)){
                        mesh._savedMaterial = mesh.material;
                        mesh._materialId = index;
                        mesh.material = this._material;
                    } else {
                        let par = (mesh as BABYLON.InstancedMesh).sourceMesh as MaterialSaver;
                        if(par._savedMaterial === undefined)
                        {
                            par._savedMaterial = par.material;
                            par._materialId = index;
                            par.material = this._material;
                        }
                    }
                // }
            }
        }
    
        this._renderTarget.onAfterRender = () =>{
            let renderList = this._renderTarget.renderList ? this._renderTarget.renderList : this._renderTarget.getScene()!.getActiveMeshes().data;
            let renderListLength = this._renderTarget.renderList ? this._renderTarget.renderList.length : this._renderTarget.getScene()!.getActiveMeshes().length;
            // Restoring previoux material
            for (var index = 0; index < renderListLength; index++) {
                let mesh = renderList[index] as MaterialSaver;

                // if (mesh.material && mesh.material !== this._material && (mesh.material as BABYLON.MultiMaterial).subMaterials){
                //     let subMeshes = (mesh as BABYLON.AbstractMesh).subMeshes;
                //     let subMaterials = (mesh.material as BABYLON.MultiMaterial).subMaterials;
                //     for (let i = 0; i < subMeshes.length; i++) {
                //         const subMesh = subMeshes[i];
                //         subMaterials[subMesh.materialIndex] = (subMesh as MaterialSaver)._savedMaterial!;
                //     }
                // } else {
                    if(!(mesh instanceof BABYLON.InstancedMesh)){
                        mesh.material = mesh._savedMaterial!;
                        mesh._savedMaterial = undefined;
                        mesh._materialId = undefined;
                    } else {
                        let par = (mesh as BABYLON.InstancedMesh).sourceMesh as MaterialSaver;
                        if(par._savedMaterial === undefined)
                        {
                            par.material = par._savedMaterial!;
                            par._savedMaterial = undefined;
                            par._materialId = undefined;
                        }
                    }
                // }
            }
        }
        this._scene.customRenderTargets.push(this._renderTarget);
    }

    getTexture(): BABYLON.RenderTargetTexture {
        return this._renderTarget;
    }

}