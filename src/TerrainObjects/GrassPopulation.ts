import { TerrainObject } from "./TerrainObject.js";

export class GrassPopulation{
    protected _terrainObject : TerrainObject;
    protected _scene : BABYLON.Scene;

    constructor(terrainObject : TerrainObject){
        this._terrainObject = terrainObject;
        this._scene = terrainObject.getScene();

        let grass = this._terrainObject.clone("terrainGrass");
        this.grassify(grass, 20);

        this.initParticleSystem();
    }



    grassify(grass : BABYLON.Mesh, quality : number){
        // let grass = BABYLON.MeshBuilder.CreateGround('grass',
        //                         {width: 300, height: 300, subdivisions: 1}, this._terrainObject.getScene());
        
        // let grass = CustomMeshBuilder.createTriangle('grass', face, this._scene);

        // grass.material = new BABYLON.StandardMaterial("grass", this._scene);
        // return grass;




        grass.receiveShadows = true;
        grass.isBlocker = false;
        grass.isPickable = false;
        var grassMaterial = new BABYLON.FurMaterial("grass", this._scene);
        grassMaterial.highLevelFur = true;
        grassMaterial.furLength = 10;
        grassMaterial.furAngle = 0;
        grassMaterial.furColor = new BABYLON.Color3(1, 1, 1);
        // grassMaterial.diffuseTexture = new BABYLON.Texture("assets/fur.jpg", this._scene);
        grassMaterial.diffuseTexture = new BABYLON.GrassProceduralTexture("grassTex", 1024, this._scene);
        grassMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        grassMaterial.furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", this._scene);
        grassMaterial.furSpacing = 100;
        // grassMaterial.furOffset = 20;
        grassMaterial.furDensity = 100;
        grassMaterial.furSpeed = 1000;
        grassMaterial.furGravity = new BABYLON.Vector3(0, 0, 0);

        // var grassTexture = new BABYLON.Texture("./assets/human_female_diffuse.png", this._scene);
        // var grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 4096, this._scene);
        
        grass.material = grassMaterial;
        
        // var quality = 20;
        // grass.position.y = -200;
        // debugger;
        var shells = BABYLON.FurMaterial.FurifyMesh(grass, quality); 

        // shells.push(grass);
        // grass = BABYLON.Mesh.MergeMeshes(shells, false)!;
        return grass;
    }

    initParticleSystem(){
        
        // Custom shader for particles
        BABYLON.Effect.ShadersStore["myParticleFragmentShader"] = `
            #ifdef GL_ES
            precision highp float;
            #endif
            #define M_PI 3.1415926535897932384626433832795

            varying vec2 vUV;
            varying vec4 vColor;
            uniform sampler2D diffuseSampler;
            uniform float time;

            // bool isBlade(vec2 position){
            //     float center = 0.5;
            //     float centerOffset = abs(center - position.x);
            //     float thickness = 0.03 * (1.0 - position.y);

            //     return (centerOffset < thickness);
            // }
            
            void main(void) {
                vec2 position = vUV;
                vec2 center = vec2(0.5,0.5);
                

                gl_FragColor = vColor;
                gl_FragColor.a = max(1. - 2.0 * distance(center, position), 0.);
                
            }
        `;

        // Effect
        var effect = this._scene.getEngine().createEffectForParticles("myParticle", ["time"]);

        // Particles
        var particleSystem = new BABYLON.ParticleSystem("particles", 400, this._scene, effect);
        particleSystem.particleTexture = new BABYLON.Texture("assets/Flare.png", this._scene);
        particleSystem.minSize = 2;
        particleSystem.maxSize = 10;
        particleSystem.minLifeTime = 0.5;
        particleSystem.maxLifeTime = 500;
        particleSystem.minEmitPower = 50;
        particleSystem.maxEmitPower = 100.0;
        particleSystem.emitter = this._terrainObject;
        particleSystem.emitRate = 10;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.direction1 = new BABYLON.Vector3(0.5, -0.1, -0.2);
        particleSystem.direction2 = new BABYLON.Vector3(1, 0.1, 0);
        particleSystem.color1 = new BABYLON.Color4(0.2, 0.3, 0, 1);
        particleSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0, 1);
        particleSystem.colorDead = new BABYLON.Color4(0.3, 0.2, 0, 0);
        // particleSystem.gravity = new BABYLON.Vector3(0, -1.0, 0);
        particleSystem.startPositionFunction = this.particlePlacement.bind(this);
        particleSystem.start();

        var time = 0;
        var order = 0.1;

        effect.onBind = function () {
            effect.setFloat("time", time);

            time += order;

            if (time > 100 || time < 0) {
                order *= -1;
            }
        };

        
    }
    particlePlacement(worldMatrix: BABYLON.Matrix, positionToUpdate: BABYLON.Vector3, particle: BABYLON.Particle){
        let face = this._terrainObject.faceMap.faces[Math.floor(Math.random()*this._terrainObject.faceMap.faces.length)];
        positionToUpdate.copyFrom(face.pos0);
        face.edge0.scaleAndAddToRef(Math.random(), positionToUpdate);
        face.edge1.scaleAndAddToRef(Math.random(), positionToUpdate);

        BABYLON.Vector3.TransformCoordinatesToRef(positionToUpdate, this._terrainObject._worldMatrix, positionToUpdate);
        positionToUpdate.y += Math.random() * 200;
    }
}