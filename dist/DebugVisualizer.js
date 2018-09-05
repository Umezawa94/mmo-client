export class DebugVisualizer {
    constructor(scene) {
        this.scene = scene;
    }
    visualizeLine(points) {
        //Create lines 
        var lines = BABYLON.MeshBuilder.CreateLines("lines", { points: points }, this.scene);
    }
}
//# sourceMappingURL=DebugVisualizer.js.map