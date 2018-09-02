export class AssetManager extends BABYLON.AssetContainer{
    private _assetManager : BABYLON.AssetsManager;

    private _MeshesByFile  :{[key:string]: Promise<{[key:string]:BABYLON.AbstractMesh}>} = {};

    constructor(scene: BABYLON.Scene){
        super(scene);
        this._assetManager = new BABYLON.AssetsManager(scene);
    }


    cloneMesh(file : string, name : string, position? : BABYLON.Vector3, rotation? : BABYLON.Vector3 | BABYLON.Quaternion, scale? : BABYLON.Vector3){
        let sourcePromise = this.getMesh(file, name);
        return sourcePromise.then((source)=>{
            let counter = (<any>source).createdCount++;
            const copy = (source as BABYLON.Mesh).clone(source.name + counter);
            if(position !== undefined) copy.position = position;
            if(rotation instanceof BABYLON.Vector3) copy.rotation = rotation;
            if(rotation instanceof BABYLON.Quaternion) copy.rotationQuaternion = rotation;
            if(scale !== undefined) copy.scaling = scale;


            return copy;
        });
    }
    instanceMesh(file : string, name : string, position? : BABYLON.Vector3, rotation? : BABYLON.Vector3 | BABYLON.Quaternion, scale? : BABYLON.Vector3){
        let sourcePromise = this.getMesh(file, name);
        return sourcePromise.then((source)=>{
            let counter = (<any>source).createdCount++;
            const copy = (source as BABYLON.Mesh).createInstance(source.name + counter);

            if(position !== undefined) copy.position = position;
            if(rotation instanceof BABYLON.Vector3) copy.rotation = rotation;
            if(rotation instanceof BABYLON.Quaternion) copy.rotationQuaternion = rotation;
            if(scale !== undefined) copy.scaling = scale;

            return copy;
        });
    }

    getMeshes(file : string, names : string[]) : Promise<{[key:string]:BABYLON.AbstractMesh}>{
        
        return this.loadMeshes(file).then((meshes)=>{
            let out : {[key:string]:BABYLON.AbstractMesh} = {};
            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                out[name] = meshes[name];
            }
            return out;
        });
    }
    getMesh(file : string, name : string) : Promise<BABYLON.AbstractMesh>{
        return this.loadMeshes(file).then((meshes)=>{
            return meshes[name];
        });
    }

    private loadMeshes(file : string) : Promise<{[key:string]:BABYLON.AbstractMesh}>{
        if(this._MeshesByFile[file] !== undefined) return this._MeshesByFile[file];

        this._MeshesByFile[file] = new Promise( (resolve, reject) => {
                let fileCache : {[key:string]:BABYLON.AbstractMesh} = {};
                console.log("loading file:" + file);
                let task = this._assetManager.addMeshTask(file, null, "assets/", file);
                task.run(this.scene, () => {
                    console.log(task.loadedMeshes)
                    for (let i = 0; i < task.loadedMeshes.length; i++) {
                        const mesh = task.loadedMeshes[i];

                        mesh.isBlocker = true;


                        this.meshes.push(mesh);
                        this.scene.removeMesh(mesh);
                        fileCache[mesh.name] = mesh;
                    }
                    resolve(fileCache)
                },(exception) => {
                    console.error(exception);
                    reject(exception);
                });
        });
        return this._MeshesByFile[file];
    }

}