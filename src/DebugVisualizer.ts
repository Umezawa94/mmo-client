import { Face } from "./TerrainObjects/TerrainObject.js";

export class DebugVisualizer{
    private static scene : BABYLON.Scene;
    static setScene(scene : BABYLON.Scene){
        this.scene = scene;
    }

    static visualizePath(points : BABYLON.Vector3[], color? : BABYLON.Color3){
        let line =  BABYLON.MeshBuilder.CreateLines("debugLine", {points: points}, this.scene); 
        if(color !== undefined) line.color = color;
        setTimeout(()=>{
            this.scene.removeMesh(line);
        },1000);
        return line;
    }
    static visualizeLine(p0 : BABYLON.Vector3, p1 : BABYLON.Vector3, color? : BABYLON.Color3){
        return this.visualizePath([p0, p1], color);
    }
    static visualizePoint(p0 : BABYLON.Vector3, color? : BABYLON.Color3){
        let point = BABYLON.MeshBuilder.CreateSphere("debugPoint", {segments : 1, diameter: 1}, this.scene);
        if(color !== undefined) point.overlayColor = color;
        setTimeout(()=>{
            this.scene.removeMesh(point);
        },1000);
        return point;
    }
    static visualizePoints(points : BABYLON.Vector3[], color? : BABYLON.Color3){
        return points.forEach(p => {
            return this.visualizePoint(p, color)
        });
    }
    static highlightFace(face : Face, color? : BABYLON.Color3){
        return this.visualizePath([
            (<any>face)._pos0,
            (<any>face)._pos1,
            (<any>face)._pos2,
            (<any>face)._pos0,
        ], color);
    }
}