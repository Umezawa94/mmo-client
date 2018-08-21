///<reference path="babylon.d.ts" />
///<reference path="babylonjs.materials.d.ts" />
///<reference path="babylonjs.proceduralTextures.d.ts" />

class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene!: BABYLON.Scene;
    private _camera!: BABYLON.ArcRotateCamera;
    private _light!: BABYLON.SpotLight;
    private _shadowGenerator!: BABYLON.ShadowGenerator;

    private _grassMaterial! : BABYLON.FurMaterial;

    private _skyMaterial! : BABYLON.SkyMaterial;
    private _starboxMaterial! : BABYLON.StandardMaterial;
    private _sunLight! : BABYLON.HemisphericLight;
    private _sunLightAmbient! : BABYLON.HemisphericLight;
    private _nightAmbient! : BABYLON.HemisphericLight;
    private _sunSpeed : number = 1/600;
    
    private _pipeline! : BABYLON.DefaultRenderingPipeline;

    private _lensFlareSource! : BABYLON.AbstractMesh;
    private _lensFlareSystem! : BABYLON.LensFlareSystem;


    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : void {
        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.gravity = new BABYLON.Vector3(0, -981, 0);
        // let defaultMat = new BABYLON.CellMaterial("defaultMat", this._scene);
        // defaultMat.computeHighLevel = true;
        // this._scene.defaultMaterial = defaultMat;
        this._scene.clearColor.set(0,0,0,1);


        this._camera = new BABYLON.ArcRotateCamera("Camera", 4.7, 0.8, 300, new BABYLON.Vector3(0,200,0), this._scene);
        this._camera.lowerRadiusLimit = 1;
        this._camera.minZ = 50;
        this._camera.maxZ = 100000;

        // Target the camera to scene origin.
        // this._camera.setTarget(BABYLON.Vector3.Zero());

        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, false);

        // // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.SpotLight('light1', new BABYLON.Vector3(-300,200,50),  new BABYLON.Vector3(30,-20,-5), Math.PI/1, 100, this._scene);
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
        var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-200, 70, -400), new BABYLON.Vector3(2, -4, 4), Math.PI * 2, 300, this._scene);
        light.intensity = 3;
        light.setDirectionToTarget( new BABYLON.Vector3(300,300,0));

        // 	// Light
        // var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._scene);
        // light1.intensity = 0.0;

        this._sunLight = new BABYLON.HemisphericLight("sunLight", new BABYLON.Vector3(0,1,0), this._scene);
        
        // this._sunLightAmbient = new BABYLON.HemisphericLight("sunLightAmbient", new BABYLON.Vector3(0, 1, 0), this._scene);
        // this._sunLightAmbient.specular.set(0,0,0);
        
        this._nightAmbient = new BABYLON.HemisphericLight("nightAmbient", new BABYLON.Vector3(0, 1, 0), this._scene);
        this._nightAmbient.specular.set(0,0,0);
        this._nightAmbient.diffuse.set(0.4, 0.4, 0.6);
        this._nightAmbient.groundColor.set(0.3, 0.3, 0.5);

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
                                {segments: 16, diameter: 200}, this._scene);
        sphere.receiveShadows = true;
        sphere.position.y = 300
        sphere.position.x = 300

        BABYLON.SceneLoader.ImportMesh("PoPori_F_face00_skel", "./assets/", "MorphTest.babylon", this._scene, (meshes) => {
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
        
        BABYLON.SceneLoader.ImportMesh("f_an03", "./assets/", "ManuelBastion.babylon", this._scene, (meshes) => {
            const mesh = meshes[0] as BABYLON.Mesh;
            // this._shadowGenerator.addShadowCaster(mesh);
            // shadowGenerator.addShadowCaster(mesh);
            // mesh.receiveShadows = true;
            mesh.scaling.x = mesh.scaling.y = mesh.scaling.z = 100;
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

            for (let i = 1; i < 20; i+=2) {
                const element = (mesh as BABYLON.Mesh).clone(mesh.name + i!, mesh.parent!)!;
                element.position.set(Math.sin(Math.PI / 1.618033988749895 * i) * i *100, 0, Math.cos(Math.PI / 1.618033988749895 * i)* i *100)
                
            }
        });

        // Create a built-in "ground" shape.
        let ground = BABYLON.MeshBuilder.CreateGround('ground',
        {width: 6000, height: 6000, subdivisions: 500}, this._scene);
        ground.receiveShadows = true; 
        ground.isBlocker = true; 
        ground.checkCollisions = true;
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", this._scene);
        groundMaterial.diffuseTexture = new BABYLON.GrassProceduralTexture("grassTex", 1024, this._scene);
        groundMaterial.specularColor.set(0,0,0);
        ground.material = groundMaterial;

        let grass = BABYLON.MeshBuilder.CreateGround('grass',
                                {width: 6000, height: 6000, subdivisions: 500}, this._scene);
        grass.receiveShadows = true;
        grass.isBlocker = true; 
        var grassMaterial = this._grassMaterial = new BABYLON.FurMaterial("grass", this._scene);
        grassMaterial.highLevelFur = true;
        grassMaterial.furLength = 100;
        grassMaterial.furAngle = 0;
        grassMaterial.furColor = new BABYLON.Color3(1, 1, 1);
        // grassMaterial.diffuseTexture = new BABYLON.Texture("assets/fur.jpg", this._scene);
        grassMaterial.diffuseTexture = groundMaterial.diffuseTexture;
        grassMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        grassMaterial.furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", this._scene);
        grassMaterial.furSpacing = 50;
        grassMaterial.furOffset = 20;
        grassMaterial.furDensity = 50;
        grassMaterial.furSpeed = 1000;
        grassMaterial.furGravity = new BABYLON.Vector3(0, 0, 0);
        // var grassTexture = new BABYLON.Texture("./assets/human_female_diffuse.png", this._scene);
        // var grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 4096, this._scene);
        
        grass.material = grassMaterial;
        
        var quality = 20;
        
        var shells = BABYLON.FurMaterial.FurifyMesh(grass, quality); 


        ground = BABYLON.MeshBuilder.CreateGround('ground1',
                                {width: 100, height: 100, subdivisions: 2}, this._scene);
        ground.position.set(200, 100, 100);
        ground.receiveShadows = true;  

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

        this._skyMaterial = new BABYLON.SkyMaterial("skyMaterial", this._scene);
        var skyMaterial = this._skyMaterial;
        skyMaterial.inclination = 1.45;
        skyMaterial.backFaceCulling = false;
        skyMaterial.luminance = 0.9;
        skyMaterial.turbidity = 0.4;
        // The amount of haze particles following the Mie scattering theory
        skyMaterial.mieDirectionalG = 0.8;
        
        skyMaterial.mieCoefficient = 0.02; // The mieCoefficient in interval [0, 0.1], affects the property skyMaterial.mieDirectionalG
        skyMaterial.rayleigh = 1.0;
        skyMaterial.alphaMode = 1;
        skyMaterial.alpha = 0.0;
        // skyMaterial.

        var skybox = BABYLON.Mesh.CreateBox("skyBox", 190000.0*Math.SQRT1_2*Math.SQRT1_2, this._scene);
        skybox.material = skyMaterial;
        skybox.infiniteDistance = true;

        var starbox = BABYLON.Mesh.CreateBox("starbox", 200000.0*Math.SQRT1_2*Math.SQRT1_2, this._scene);
        starbox.infiniteDistance = true;
        var starboxMaterial = this._starboxMaterial = new BABYLON.StandardMaterial("starbox", this._scene);
        starboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/nightSky", this._scene, ["1.png", "5.png", "2.png", "3.png", "6.png", "4.png"]);
        starboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        starboxMaterial.backFaceCulling = false;
        starboxMaterial.disableLighting = true;
        starboxMaterial.alphaMode = 1;
        starbox.material = starboxMaterial;
		

        let pipeline = this._pipeline = new BABYLON.DefaultRenderingPipeline(
            "default", // The name of the pipeline
            true, // Do you want HDR textures ?
            this._scene, // The scene instance
            [this._camera] // The list of cameras to be attached to
        );
        pipeline.bloomEnabled = true;
        pipeline.bloomKernel = 1024;
        pipeline.bloomWeight = 2;
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

        this._lensFlareSource = new BABYLON.Mesh("lensFlareSource", this._scene);
        let lensFlareSystem = this._lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", this._lensFlareSource, this._scene);
        var flare00 = new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "Assets/lens5.png", lensFlareSystem);
        var flare01 = new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1), "assets/lens4.png", lensFlareSystem);
        var flare02 = new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "assets/lens4.png", lensFlareSystem);
        var flare03 = new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "assets/Flare.png", lensFlareSystem);
        var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "assets/lens5.png", lensFlareSystem);
        var flare05 = new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "assets/lens4.png", lensFlareSystem);

        

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
            let delta = this._engine.getDeltaTime();


            function intensity(time:number, exp:number = 128, sunset:number = 0.51){
                time %= 2;
                if(time < sunset) return 1-Math.pow(Math.sin(time*Math.PI/(sunset*2)),exp);
                if(sunset < time  && time < 2-sunset) return 0;
                return 1-Math.pow(Math.sin((time-2)*Math.PI/(sunset*2)),exp);
            }

            this._skyMaterial.inclination += delta * 0.002 * this._sunSpeed; 

            let int128 = intensity(this._skyMaterial.inclination, 128);
            let int64 = intensity(this._skyMaterial.inclination,64);
            let int32 = intensity(this._skyMaterial.inclination,32);

            this._sunLight.direction = this._skyMaterial.sunPosition;
            // this._sunLight.intensity = intensity(this._skyMaterial.inclination);
            this._sunLight.specular.set(int128, int128, int128)
            this._sunLight.diffuse.set(int128, int64, int32)
            this._sunLight.groundColor.set(0.2 * int128, 0.2 * int64, 0.2 * int32);

            this._lensFlareSource.position = this._skyMaterial.sunPosition.scale(1000).add(this._camera.position);

            // this._grassMaterial.furGravity.set(0.2 + 0.2 * Math.sin(this._skyMaterial.inclination * 100), 0, 0);

            // this._sunLightAmbient.direction = this._skyMaterial.sunPosition.negate();
            // this._sunLightAmbient.direction.y *= -1;
            // // this._sunLightAmbient.intensity = 0.5 * intensity(this._skyMaterial.inclination);
            // this._sunLightAmbient.diffuse.set(intensity(this._skyMaterial.inclination, 128), intensity(this._skyMaterial.inclination,32), intensity(this._skyMaterial.inclination,4))

            this._nightAmbient.intensity = 0.4+0.2 * Math.cos(this._skyMaterial.inclination * Math.PI);
            
            this._starboxMaterial.alpha = 1 - int128;
            this._pipeline.imageProcessing.contrast = 2.5 - int128;

            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new Game('renderCanvas');
    (window as any).game = game;

    // Create the scene.
    game.createScene();

    // Start render loop.
    game.doRender();
});