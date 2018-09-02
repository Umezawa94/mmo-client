export class AssetManager extends BABYLON.AssetContainer {
    constructor(scene) {
        super(scene);
        this._MeshesByFile = {};
        this._assetManager = new BABYLON.AssetsManager(scene);
    }
    cloneMesh(file, name, position, rotation, scale) {
        let sourcePromise = this.getMesh(file, name);
        return sourcePromise.then((source) => {
            let counter = source.createdCount++;
            const copy = source.clone(source.name + counter);
            if (position !== undefined)
                copy.position = position;
            if (rotation instanceof BABYLON.Vector3)
                copy.rotation = rotation;
            if (rotation instanceof BABYLON.Quaternion)
                copy.rotationQuaternion = rotation;
            if (scale !== undefined)
                copy.scaling = scale;
            return copy;
        });
    }
    instanceMesh(file, name, position, rotation, scale) {
        let sourcePromise = this.getMesh(file, name);
        return sourcePromise.then((source) => {
            let counter = source.createdCount++;
            const copy = source.createInstance(source.name + counter);
            if (position !== undefined)
                copy.position = position;
            if (rotation instanceof BABYLON.Vector3)
                copy.rotation = rotation;
            if (rotation instanceof BABYLON.Quaternion)
                copy.rotationQuaternion = rotation;
            if (scale !== undefined)
                copy.scaling = scale;
            return copy;
        });
    }
    getMeshes(file, names) {
        return this.loadMeshes(file).then((meshes) => {
            let out = {};
            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                out[name] = meshes[name];
            }
            return out;
        });
    }
    getMesh(file, name) {
        return this.loadMeshes(file).then((meshes) => {
            return meshes[name];
        });
    }
    loadMeshes(file) {
        if (this._MeshesByFile[file] !== undefined)
            return this._MeshesByFile[file];
        this._MeshesByFile[file] = new Promise((resolve, reject) => {
            let fileCache = {};
            console.log("loading file:" + file);
            let task = this._assetManager.addMeshTask(file, null, "assets/", file);
            task.run(this.scene, () => {
                console.log(task.loadedMeshes);
                for (let i = 0; i < task.loadedMeshes.length; i++) {
                    const mesh = task.loadedMeshes[i];
                    mesh.isBlocker = true;
                    this.meshes.push(mesh);
                    this.scene.removeMesh(mesh);
                    fileCache[mesh.name] = mesh;
                }
                resolve(fileCache);
            }, (exception) => {
                console.error(exception);
                reject(exception);
            });
        });
        return this._MeshesByFile[file];
    }
}
//# sourceMappingURL=AssetManager.js.map