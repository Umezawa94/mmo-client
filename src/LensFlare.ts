// import { Matrix, Material, Engine } from "babylonjs";

export class LensFlareSystem extends BABYLON.LensFlareSystem {
    public color : BABYLON.Color4 = new BABYLON.Color4(1,1,1,1);
    public intensityModifier : number = 1;

    public render(): boolean {

        if (!(<any>this)._effect.isReady() || !(<any>this)._scene.activeCamera)
            return false;

        var engine = (<any>this)._scene.getEngine();
        var viewport = (<any>this)._scene.activeCamera.viewport;
        var globalViewport = viewport.toGlobal(engine.getRenderWidth(true), engine.getRenderHeight(true));

        // Position
        if (!this.computeEffectivePosition(globalViewport)) {
            return false;
        }

        // Visibility
        if (!this._isVisible()) {
            return false;
        }

        // Intensity
        var awayX;
        var awayY;

        let positionX = (<any>this)._positionX;
        let positionY = (<any>this)._positionY;

        if (positionX < this.borderLimit + globalViewport.x) {
            awayX = this.borderLimit + globalViewport.x - positionX;
        } else if (positionX > globalViewport.x + globalViewport.width - this.borderLimit) {
            awayX = positionX - globalViewport.x - globalViewport.width + this.borderLimit;
        } else {
            awayX = 0;
        }

        if (positionY < this.borderLimit + globalViewport.y) {
            awayY = this.borderLimit + globalViewport.y - positionY;
        } else if (positionY > globalViewport.y + globalViewport.height - this.borderLimit) {
            awayY = positionY - globalViewport.y - globalViewport.height + this.borderLimit;
        } else {
            awayY = 0;
        }

        var away = (awayX > awayY) ? awayX : awayY;

        away -= this.viewportBorder;

        if (away > this.borderLimit) {
            away = this.borderLimit;
        }

        var intensity = (1.0 - (away / this.borderLimit)) * this.intensityModifier;
        if (intensity < 0) {
            return false;
        }

        if (intensity > 1.0) {
            intensity = 1.0;
        }

        if (this.viewportBorder > 0) {
            globalViewport.x += this.viewportBorder;
            globalViewport.y += this.viewportBorder;
            globalViewport.width -= this.viewportBorder * 2;
            globalViewport.height -= this.viewportBorder * 2;
            positionX -= this.viewportBorder;
            positionY -= this.viewportBorder;
        }

        // Position
        var centerX = globalViewport.x + globalViewport.width / 2;
        var centerY = globalViewport.y + globalViewport.height / 2;
        var distX = centerX - positionX;
        var distY = centerY - positionY;

        // Effects
        engine.enableEffect((<any>this)._effect);
        engine.setState(false);
        engine.setDepthBuffer(false);

        // VBOs
        engine.bindBuffers((<any>this)._vertexBuffers, (<any>this)._indexBuffer, (<any>this)._effect);

        // Flares
        for (var index = 0; index < this.lensFlares.length; index++) {
            var flare = this.lensFlares[index];

            engine.setAlphaMode(flare.alphaMode);

            var x = centerX - (distX * flare.position);
            var y = centerY - (distY * flare.position);

            var cw = flare.size;
            var ch = flare.size * engine.getAspectRatio((<any>this)._scene.activeCamera, true);
            var cx = 2 * (x / (globalViewport.width + globalViewport.x * 2)) - 1.0;
            var cy = 1.0 - 2 * (y / (globalViewport.height + globalViewport.y * 2));

            var viewportMatrix = BABYLON.Matrix.FromValues(
                cw / 2, 0, 0, 0,
                0, ch / 2, 0, 0,
                0, 0, 1, 0,
                cx, cy, 0, 1);

            (<any>this)._effect.setMatrix("viewportMatrix", viewportMatrix);

            // Texture
            (<any>this)._effect.setTexture("textureSampler", flare.texture);

            // Color
            (<any>this)._effect.setFloat4("color", flare.color.r * intensity * this.color.r, flare.color.g * intensity * this.color.g, flare.color.b * intensity * this.color.b, 1.0 * this.color.a);

            // Draw order
            engine.drawElementsType(BABYLON.Material.TriangleFillMode, 0, 6);
        }

        engine.setDepthBuffer(true);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);
        return true;
}
}