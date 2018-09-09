import { Face } from "./TerrainObjects/TerrainObject.js";

export class CustomMeshBuilder{
    static createTriangle(name : string, v0 : BABYLON.Vector3, v1 : BABYLON.Vector3, v2 : BABYLON.Vector3, scene : BABYLON.Scene){
        var triangle = new BABYLON.Mesh(name, scene);

        var positions = [
            v0.x, v0.y, v0.z,
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z];
        var indices = [0, 1, 2];    
        var normals : number[] = [];

        BABYLON.VertexData.ComputeNormals(positions, indices, normals);

        var vertexData = new BABYLON.VertexData();

        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;

        vertexData.applyToMesh(triangle);

        return triangle;
    }
    static copyFace(name : string, face : Face, scene : BABYLON.Scene){

        var triangle = new BABYLON.Mesh(name, scene);
        var srcPos = face.terrainObject.getVerticesData(BABYLON.VertexBuffer.PositionKind)!;
        var srcNorm = face.terrainObject.getVerticesData(BABYLON.VertexBuffer.NormalKind)!;

        let id0 = 3*face.index0;
        let id1 = 3*face.index1;
        let id2 = 3*face.index2;


        var positions = [
            srcPos[id0], srcPos[id0+1], srcPos[id0+2], 
            srcPos[id1], srcPos[id1+1], srcPos[id1+2],
            srcPos[id2], srcPos[id2+1], srcPos[id2+2]
        ];
        var indices = [0, 1, 2];    
        var normals = [
            srcNorm[id0], srcNorm[id0+1], srcNorm[id0+2], 
            srcNorm[id1], srcNorm[id1+1], srcNorm[id1+2],
            srcNorm[id2], srcNorm[id2+1], srcNorm[id2+2]
        ];

        var vertexData = new BABYLON.VertexData();

        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;

        vertexData.applyToMesh(triangle);

        return triangle;
    }
}