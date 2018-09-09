import { System } from "./System.js";
import { TerrainObject, FaceMap, Face } from "../TerrainObjects/TerrainObject.js";
import { Ray } from "../Ray.js";
import { CustomMeshBuilder } from "../CustomMeshBuilder.js";
import { Mesh } from "babylonjs";
import { GrassPopulation } from "../TerrainObjects/GrassPopulation.js";

export class TerrainSystem extends System{

    protected _terrainObjects! : TerrainObject[];

    constructor(scene : BABYLON.Scene){
        super(scene);
    }
    protected buildScene(scene : BABYLON.Scene) : void{
        this._terrainObjects = [];
        // Create a built-in "ground" shape.
        let ground = <TerrainObject>BABYLON.MeshBuilder.CreateGround('ground',
        {width: 6000, height: 6000, subdivisions: 20, updatable: true}, this._scene);
        ground.receiveShadows = true; 
        ground.isBlocker = true; 
        ground.checkCollisions = true;
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", this._scene);
        groundMaterial.diffuseTexture = new BABYLON.GrassProceduralTexture("grassTex", 1024, this._scene);
        groundMaterial.specularColor.set(0,0,0);
        groundMaterial.wireframe = false;
        ground.material = groundMaterial;

        var positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind)!;
        for (let i = 0; i  < positions.length; i += 3) {
            let x = positions[i+0];
            let z = positions[i+2];
            positions[i+1] = -200 * Math.cos(x/700 + Math.sin(z / 1000 ));
        }
        console.log(positions);
        ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

        this.addTerrain(ground);

        new GrassPopulation(ground);

        // let grass = this.createGrass(20);

        // // grass.addLODLevel(200, this.createGrass(10))
        // // grass.addLODLevel(400, this.createGrass(0))
        // for (let i = 1; i < grass.length; i++) {
        //     const layer = grass[i];
        //     if (i % 2 == 0) layer.addLODLevel(1000, <any>null); 
        //     layer.addLODLevel(2000, <any>null); 
        // }
        
        // for (let i = 0; i < ground.faceMap.faces.length; i++) {
        //     const face = ground.faceMap.faces[i];

        //     let parent = grass[0].createInstance("grassInst"+0);
        //     for (let j = 1; j < grass.length; j++) {
        //         const layer = grass[j];
        //         let inst = layer.createInstance("grassInst"+ i +"_"+j );
        //         inst.parent = parent;
        //     }

        //     parent.position = face.pos0;
        //     parent.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
        //     // parent.scaling.set(100,1,100);
        //     // debugger;
            
        // }
    }
    protected update(scene : BABYLON.Scene, delta : number) : void{

    }

    addTerrain(terrainObject : TerrainObject){
        this._terrainObjects.push(terrainObject);
        terrainObject.faceMap = new FaceMap(terrainObject);
    }

    getTerrainObjects(){
        return this._terrainObjects;
    }

    intersectTerrainRay(ray : Ray, results : Array<BABYLON.PickingInfo>){
        return ray.intersectsTerrainObjects(this._terrainObjects, results);
    }





}