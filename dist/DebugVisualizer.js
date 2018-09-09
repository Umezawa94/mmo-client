export class DebugVisualizer {
    static setScene(scene) {
        this.scene = scene;
    }
    static visualizePath(points, color) {
        let line = BABYLON.MeshBuilder.CreateLines("debugLine", { points: points }, this.scene);
        if (color !== undefined)
            line.color = color;
        setTimeout(() => {
            this.scene.removeMesh(line);
        }, 1000);
        return line;
    }
    static visualizeLine(p0, p1, color) {
        return this.visualizePath([p0, p1], color);
    }
    static visualizePoint(p0, color) {
        let point = BABYLON.MeshBuilder.CreateSphere("debugPoint", { segments: 1, diameter: 1 }, this.scene);
        if (color !== undefined)
            point.overlayColor = color;
        setTimeout(() => {
            this.scene.removeMesh(point);
        }, 1000);
        return point;
    }
    static visualizePoints(points, color) {
        return points.forEach(p => {
            return this.visualizePoint(p, color);
        });
    }
    static highlightFace(face, color) {
        return this.visualizePath([
            face._pos0,
            face._pos1,
            face._pos2,
            face._pos0,
        ], color);
    }
}
//# sourceMappingURL=DebugVisualizer.js.map