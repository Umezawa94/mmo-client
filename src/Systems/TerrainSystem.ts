import { System } from "./System.js";
import { TerrainObject, FaceMap } from "../TerrainObjects/TerrainObject.js";
import { Ray } from "../Ray.js";

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



        let grass = BABYLON.MeshBuilder.CreateGround('grass',
                                {width: 100, height: 100, subdivisions: 1}, this._scene);
        grass.receiveShadows = true;
        grass.isBlocker = false;
        grass.isPickable = false;
        var grassMaterial = new BABYLON.FurMaterial("grass", this._scene);
        grassMaterial.highLevelFur = true;
        grassMaterial.furLength = 5;
        grassMaterial.furAngle = 0;
        grassMaterial.furColor = new BABYLON.Color3(1, 1, 1);
        // grassMaterial.diffuseTexture = new BABYLON.Texture("assets/fur.jpg", this._scene);
        grassMaterial.diffuseTexture = groundMaterial.diffuseTexture;
        grassMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        grassMaterial.furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", this._scene);
        grassMaterial.furSpacing = 50;
        grassMaterial.furOffset = 20;
        grassMaterial.furDensity = 5;
        grassMaterial.furSpeed = 1000;
        grassMaterial.furGravity = new BABYLON.Vector3(0, 0, 0);
        // var grassTexture = new BABYLON.Texture("./assets/human_female_diffuse.png", this._scene);
        // var grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 4096, this._scene);
        
        grass.material = grassMaterial;
        
        var quality = 20;
        grass.position.y = -200;
        var shells = BABYLON.FurMaterial.FurifyMesh(grass, quality); 
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