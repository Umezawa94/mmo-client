///<reference path="babylon.d.ts" />
///<reference path="babylonjs.materials.d.ts" />
///<reference path="babylonjs.proceduralTextures.d.ts" />

import { LensFlareSystem } from "./LensFlare.js";
import { SkySystem } from "./Systems/SkySystem.js";
import { ObjectSystem } from "./Systems/ObjectSystem.js";
import { AssetManager } from "./AssetManager.js";
import { InputManager } from "./InputManager.js";
import { PlayerObject } from "./SceneObjects/PlayerObject.js";
import { TerrainSystem } from "./Systems/TerrainSystem.js";

export default class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene!: BABYLON.Scene;
    private _inputManager! : InputManager;


    private _camera!: BABYLON.ArcRotateCamera;
    private _light!: BABYLON.SpotLight;
    private _shadowGenerator!: BABYLON.ShadowGenerator;

    private _grassMaterial! : BABYLON.FurMaterial;
    
    private _pipeline! : BABYLON.DefaultRenderingPipeline;
    
    private _skySystem! : SkySystem;

    private _assetManager! : AssetManager;
    private _terrainSystem! : TerrainSystem;
    private _objectSystem! : ObjectSystem;

    private _player! : PlayerObject;

    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : void {
        // Create a basic BJS Scene object.
        let scene = this._scene = new BABYLON.Scene(this._engine);
        scene.gravity = new BABYLON.Vector3(0, -981, 0);
        // let defaultMat = new BABYLON.CellMaterial("defaultMat", this._scene);
        // defaultMat.computeHighLevel = true;
        // this._scene.defaultMaterial = defaultMat;
        scene.clearColor.set(0,0,0,1);

        this._inputManager = new InputManager(scene);


        this._camera = new BABYLON.ArcRotateCamera("Camera", 4.7, 0.8, 300, new BABYLON.Vector3(0,200,0), scene);
        this._camera.lowerRadiusLimit = 1;
        this._camera.minZ = 50;
        this._camera.maxZ = 100000;
        this._camera.inertia = 0;
        this._camera.angularSensibilityX = 100;
        this._camera.angularSensibilityY = 200;
        this._camera.wheelPrecision = 0.1;


        // Target the camera to scene origin.
        // this._camera.setTarget(BABYLON.Vector3.Zero());

        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, false);

        // // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.SpotLight('light1', new BABYLON.Vector3(-300,200,50),  new BABYLON.Vector3(30,-20,-5), Math.PI/1, 100, scene);
        this._light.setDirectionToTarget( new BABYLON.Vector3(0,160,0));
        this._light.shadowMinZ = 10;
        this._light.shadowMaxZ = 1000;
        // // this._shadowGenerator = new BABYLON.ShadowGenerator(512, this._light);
		
        // // var shadowGenerator = this._shadowGenerator;
        // // shadowGenerator.bias = 0.001;
        // // shadowGenerator.normalBias = 0.02;
        // // shadowGenerator.useContactHardeningShadow = true;
        // // shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
        // // shadowGenerator.setDarkness(0.5);

        // // light1
        var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-200, 70, -400), new BABYLON.Vector3(2, -4, 4), Math.PI * 2, 300, scene);
        light.intensity = 3;
        light.setDirectionToTarget( new BABYLON.Vector3(300,300,0));

        // 	// Light
        // var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._scene);
        // light1.intensity = 0.0;



        // light1.intensity = 0.0;




        // Shadows
        // var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        // shadowGenerator.bias = 0.001;
        // shadowGenerator.normalBias = 0.02;
        // light.shadowMaxZ = 1000;
        // light.shadowMinZ = 100;
        // shadowGenerator.useContactHardeningShadow = true;
        // shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
        // shadowGenerator.setDarkness(0.5);

        // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
                                {segments: 16, diameter: 200}, scene);
        sphere.receiveShadows = true;
        sphere.position.y = 300
        sphere.position.x = 300

        BABYLON.SceneLoader.ImportMesh("PoPori_F_face00_skel", "./assets/", "MorphTest.babylon", scene, (meshes) => {
            const mesh = meshes[0] as BABYLON.Mesh;
            // this._shadowGenerator.addShadowCaster(mesh);
            // shadowGenerator.addShadowCaster(mesh);
            // mesh.receiveShadows = true;
            mesh.scaling.x = mesh.scaling.y = mesh.scaling.z = 5;
            // this.cellify(meshes[0]);
            mesh.setEnabled(false);
            mesh.isBlocker = true;
            // mesh.simplify([
            //     { quality: 0.7, distance: 2000, optimizeMesh:true },
            //     { quality: 0.5, distance: 5000, optimizeMesh:true },
            //     { quality: 0.1, distance: 7000, optimizeMesh:true }
            // ], true,undefined, (mesh)=>{
            //     console.log("done");
            // });

            for (let i = 0; i < 20; i+=2) {
                const element = (mesh as BABYLON.Mesh).clone(mesh.name + i!, mesh.parent!)!;
                element.position.set(Math.sin(Math.PI / 1.618033988749895 * i) * i *100, 0, Math.cos(Math.PI / 1.618033988749895 * i)* i *100)
                
                element.ellipsoid.set(100,200,100);
            }
        });
        
        this._assetManager = new AssetManager(this._scene);

        
        let scale= new BABYLON.Vector3(100, 100, 100);
        for (let i = 1; i < 20; i+=2) {
            let pos= new BABYLON.Vector3(Math.sin(Math.PI / 1.618033988749895 * i) * i *100, 0, Math.cos(Math.PI / 1.618033988749895 * i)* i *100);
            this._assetManager.cloneMesh("ManuelBastion.babylon", "f_an03", pos, undefined, scale).then((mesh)=>{

            });
        }
        // BABYLON.SceneLoader.ImportMesh("f_an03", "./assets/", "ManuelBastion.babylon", this._scene, (meshes) => {
        //     const mesh = meshes[0] as BABYLON.Mesh;
        //     // this._shadowGenerator.addShadowCaster(mesh);
        //     // shadowGenerator.addShadowCaster(mesh);
        //     // mesh.receiveShadows = true;

        // });



        let plane = BABYLON.MeshBuilder.CreateGround('ground1',
                                {width: 100, height: 100, subdivisions: 2}, this._scene);
        plane.position.set(200, 100, 100);
        plane.receiveShadows = true;  

        // var depthRenderer = this._scene.enableDepthRenderer();
        // let edgeWidth = 0.6;
        // var normalRenderer = new MaterialRenderer(new NormalMaterial(this._scene));
        // var postProcess1 = new BABYLON.PostProcess("Outline1", "./shader/Outline1", ["uvOffset", "visibleEdgeColor", "minDepth","maxDepth", "materialThreshold", "depthThreshold", "normalThreshold"], ["tNormal", "tDepth"], 1, this._camera);
        // postProcess1.onApply = (effect)=>{
        //     effect.setTexture("tNormal", normalRenderer.getTexture());
        //     effect.setTexture("tDepth", depthRenderer.getDepthMap());
            
        //     effect.setFloat4("uvOffset", edgeWidth/postProcess1.width, 0, -edgeWidth/postProcess1.width, edgeWidth/postProcess1.height);
        //     effect.setFloat3("visibleEdgeColor", 0, 0, 0);
        //     effect.setFloat("materialThreshold", Infinity);
        //     effect.setFloat("depthThreshold", 0.01);
        //     effect.setFloat("normalThreshold", 0.8);
        //     effect.setFloat("minDepth", 0.);
        //     effect.setFloat("maxDepth", 0.2);

        // }

		

        let pipeline = this._pipeline = new BABYLON.DefaultRenderingPipeline(
            "default", // The name of the pipeline
            true, // Do you want HDR textures ?
            this._scene, // The scene instance
            [this._camera] // The list of cameras to be attached to
        );
        pipeline.bloomEnabled = true;
        pipeline.bloomKernel = 256;
        pipeline.bloomWeight = 1;
        pipeline.bloomThreshold = 0.65;
        pipeline.imageProcessing.contrast = 1.5;
        pipeline.imageProcessing.exposure = 1.03;
        pipeline.fxaaEnabled = true;
        pipeline.sharpenEnabled = true;
        pipeline.sharpen.edgeAmount = 0.4;

        pipeline.depthOfFieldEnabled = true;
        pipeline.depthOfField.focusDistance = 2000;
        pipeline.depthOfField.fStop = 1.4;
        pipeline.depthOfField.focalLength = 30;

        this._skySystem = new SkySystem(scene, pipeline)
        

        this._terrainSystem = new TerrainSystem(this._scene);

        this._objectSystem = new ObjectSystem(this._scene, this._assetManager, this._terrainSystem);

        let player = this._player = new PlayerObject(this._objectSystem, this._inputManager, this._camera);
        player.position.set(0,100,0);


    }


    cellify (mesh : BABYLON.AbstractMesh){
        let materials = (mesh.material as BABYLON.MultiMaterial).subMaterials;
        for (let i = 0; i < materials.length; i++) {
            materials[i] = this.replaceCellMat(materials[i] as BABYLON.StandardMaterial);
            
        }
    }
    replaceCellMat (mat : BABYLON.StandardMaterial) : BABYLON.CellMaterial{
        let cell = new BABYLON.CellMaterial(mat.name + "cell", mat.getScene());
        cell.diffuseTexture = mat.diffuseTexture!;
        cell.diffuseColor = mat.diffuseColor;
        cell.computeHighLevel = true;
        return cell;    
    }

    doRender() : void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {

            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

// window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new Game('renderCanvas');
    (window as any).game = game;

    // Create the scene.
    game.createScene();

    // Start render loop.
    game.doRender();
// });

export const foo = 1;