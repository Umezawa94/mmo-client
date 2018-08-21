export class LensFlareSystem extends BABYLON.LensFlareSystem {
    constructor() {
        super(...arguments);
        this.color = new BABYLON.Color4(1, 1, 1, 1);
        this.intensityModifier = 1;
    }
}
//# sourceMappingURL=LensFlare.js.map