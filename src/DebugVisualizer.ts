export class DebugVisualizer{
    private scene : BABYLON.Scene;
    constructor(scene : BABYLON.Scene){
        this.scene = scene;
    }

    visualizeLine(points : BABYLON.Vector3[]){
        
        //Create lines 
        var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: points}, this.scene); 
    }
}