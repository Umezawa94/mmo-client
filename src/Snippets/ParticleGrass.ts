
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

            bool isBlade(vec2 position){
                float center = 0.5;
                float centerOffset = abs(center - position.x);
                float thickness = 0.03 * (1.0 - position.y);

                return (centerOffset < thickness);
            }
            
            void main(void) {
                vec2 position = vUV;
                if(isBlade(position)){
                    gl_FragColor = vColor;
                }
                
            }
        `;

        // Effect
        var effect = scene.getEngine().createEffectForParticles("myParticle", ["time"]);

        // Particles
        var particleSystem = new BABYLON.ParticleSystem("particles", 400000, scene, effect);
        particleSystem.particleTexture = particleTexture;//new BABYLON.Texture("textures/flare.png", scene);
        particleSystem.minSize = 50;
        particleSystem.maxSize = 100;
        particleSystem.minLifeTime = Infinity;
        particleSystem.maxLifeTime = Infinity;
        particleSystem.minEmitPower = 0.0;
        particleSystem.maxEmitPower = 0.0;
        particleSystem.emitter = terrainObject;
        particleSystem.manualEmitCount = 1000000;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
        particleSystem.color1 = new BABYLON.Color4(0, 0.3, 0, 1);
        particleSystem.color2 = new BABYLON.Color4(0, 0.1, 0, 1);
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

        
    particlePlacement(worldMatrix: BABYLON.Matrix, positionToUpdate: BABYLON.Vector3, particle: BABYLON.Particle){
        let face = this._terrainObject.faceMap.faces[Math.floor(Math.random()*this._terrainObject.faceMap.faces.length)];
        positionToUpdate.copyFrom(face.pos0);
        face.edge0.scaleAndAddToRef(Math.random(), positionToUpdate);
        face.edge1.scaleAndAddToRef(Math.random(), positionToUpdate);

        BABYLON.Vector3.TransformCoordinatesToRef(positionToUpdate, this._terrainObject._worldMatrix, positionToUpdate);
    }