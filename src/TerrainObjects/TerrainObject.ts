import { VectorTools } from "../VectorTools";
import { Vector3 } from "babylonjs";

export interface TerrainObject extends BABYLON.Mesh {
    faceMap : FaceMap;
}

export class FaceMap{
    protected _faces! : Face[];
    protected _terrainObject : TerrainObject;

    constructor(terrainObject : TerrainObject){
        this._terrainObject = terrainObject;
        this.buildFaceMap();
    }

    buildFaceMap (){
        this._faces = [];
        var indices = this._terrainObject.getIndices()!;
        let indexLists : Face[][] = []; 
        for (let i = 0; i < indices.length / 3; i++) {
            var index0 = indices[i * 3];
            var index1 = indices[i * 3 + 1];
            var index2 = indices[i * 3 + 2];
            this._faces[i] = new Face(this, i, index0, index1, index2);

            if(indexLists[index0] == undefined) indexLists[index0] = [];
            indexLists[index0].push(this._faces[i]);
            if(indexLists[index1] == undefined) indexLists[index1] = [];
            indexLists[index1].push(this._faces[i]);
            if(indexLists[index2] == undefined) indexLists[index2] = [];
            indexLists[index2].push(this._faces[i]);
        }
        // debugger;
        for (let i = 0; i < indexLists.length; i++) {
            const list = indexLists[i];
            for (let j = 0; j < list.length; j++) {
                list[j].surrounding  = list[j].surrounding.concat(list);
            }
        }
        for (let i = 0; i < this._faces.length; i++) {
            const face = this._faces[i];
            face.calculateEdges();
        }
        console.log(this._faces);
    }

    get terrainObject (){
        return this._terrainObject;
    }

    getProjectedPath(origin: BABYLON.Vector3, dir : BABYLON.Vector3, startFace : Face){

    }
}

class Path{
    protected _faceMap: FaceMap;
    protected _origin: BABYLON.Vector3;
    protected _dir : BABYLON.Vector3;
    protected _startFace : Face;
    protected reachedEnd : boolean = false;

    protected _pathSegments : PathSegment[] = [];

    constructor(faceMap: FaceMap, origin: BABYLON.Vector3, dir : BABYLON.Vector3, startFace : Face){
        this._faceMap = faceMap;
        this._origin = origin;
        this._dir = dir;
        this._startFace = startFace;

        this._pathSegments[0] = this._startFace.getProjectedSegment(origin, dir)!;
        this._pathSegments[0].startLength = 0;
        this._pathSegments[0].startProjectedLength = 0;
        this._pathSegments[0].endLength = BABYLON.Vector3.Distance(origin, this._pathSegments[0].exit.s);
        this._pathSegments[0].endProjectedLength = this._pathSegments[0].exit.t;

    }

    getPointOnPath(t : number, out:BABYLON.Vector3, useProjectedLength? : boolean){
        let lastSegment = this._pathSegments[this._pathSegments.length - 1];
        let lastEndLength = useProjectedLength ? lastSegment.endProjectedLength : lastSegment.endLength;
        while (lastEndLength <= t && !this.reachedEnd){
            this.calculateNextSegment();
            lastSegment = this._pathSegments[this._pathSegments.length - 1];
            lastEndLength = useProjectedLength ? lastSegment.endProjectedLength : lastSegment.endLength;
        }
        if(lastEndLength < t) return null;
        for (let i = this._pathSegments.length - 1; i >= 0 ; i--) {
            const segment = this._pathSegments[i];
            let endLength = useProjectedLength ? segment.endProjectedLength : segment.endLength;
            if (segment.endLength > t){
                let startLength = useProjectedLength ? segment.endProjectedLength : segment.endLength;
                let segmentT = (t-startLength)/(endLength-startLength);
                VectorTools.interpolate(segmentT, segment.origin, segment.exit.s, out);
                return out;
            }
        }
    }
    calculateNextSegment() : PathSegment | null{
        let lastSegment = this._pathSegments[this._pathSegments.length - 1];
        let newSegment = null;
        if(lastSegment.exit.neighbour !== undefined) newSegment = lastSegment.exit.neighbour.getProjectedSegment(lastSegment.exit.s, this._dir);
        if(newSegment === null){
            this.reachedEnd = true;
            return null;
        }
        newSegment.startLength = lastSegment.endLength;
        newSegment.startProjectedLength = lastSegment.startProjectedLength;
        newSegment.endLength = newSegment.startLength + newSegment.actualLength;
        newSegment.endProjectedLength = newSegment.startProjectedLength + newSegment.projectedLength;
        this._pathSegments.push(newSegment);
        return newSegment;
    }


}


export class Face{
    protected _terrainObject : TerrainObject;
    protected _faceMap : FaceMap;
    protected _faceId : number;
    protected _index0 : number;
    protected _index1 : number;
    protected _index2 : number;
    protected _pos0 : BABYLON.Vector3;
    protected _pos1 : BABYLON.Vector3;
    protected _pos2 : BABYLON.Vector3;
    protected _edge0 : BABYLON.Vector3;
    protected _edge1 : BABYLON.Vector3;
    protected _normal : BABYLON.Vector3;
    protected _inclination : number;
    
    protected _toBaryMatrix : BABYLON.Matrix = new BABYLON.Matrix();
    protected _toCartMatrix : BABYLON.Matrix;

    protected _s0 = BABYLON.Vector3.Zero();
    protected _s1 = BABYLON.Vector3.Zero();
    protected _s2 = BABYLON.Vector3.Zero();

    protected _neighbour0? : Face;
    protected _neighbour1? : Face;
    protected _neighbour2? : Face;

    public surrounding : Face[] = [];

    constructor(faceMap : FaceMap, faceId : number, index0 : number, index1 : number, index2 : number){
        this._faceMap = faceMap;
        this._terrainObject = faceMap.terrainObject;
        this._faceId = faceId;
        this._index0 = index0;
        this._index1 = index1;
        this._index2 = index2;
        var positions = this._terrainObject.getVerticesData(BABYLON.VertexBuffer.PositionKind)!;
        this._pos0 = new BABYLON.Vector3(positions[3 * index0], positions[3 * index0 + 1], positions[3 * index0 + 2]);
        this._pos1 = new BABYLON.Vector3(positions[3 * index1], positions[3 * index1 + 1], positions[3 * index1 + 2]);
        this._pos2 = new BABYLON.Vector3(positions[3 * index2], positions[3 * index2 + 1], positions[3 * index2 + 2]);
        this._edge0 = this._pos1.subtract(this._pos0);
        this._edge1 = this._pos2.subtract(this._pos0);
        this._normal = BABYLON.Vector3.Cross(this._edge0, this._edge1).normalize();
        this._inclination = Math.acos(this._normal.y);

        this._toCartMatrix = VectorTools.MatrixFromThreeVectors(this._pos0, this._pos1, this._pos2);
        this._toCartMatrix.invertToRef(this._toBaryMatrix); //TODO: Catch case: one vec is null vector


        this._terrainObject.getVerticesData(BABYLON.VertexBuffer.PositionKind)

    }

    toCarthesian(v : BABYLON.Vector3, out? : BABYLON.Vector3){
        if(out === undefined) return BABYLON.Vector3.TransformCoordinates(v, this._toCartMatrix);
        BABYLON.Vector3.TransformCoordinatesToRef(v, this._toCartMatrix, out);
        return out;
    }

    toBarycentric(v : BABYLON.Vector3, out : BABYLON.Vector3){
        if(out === undefined) return BABYLON.Vector3.TransformCoordinates(v, this._toBaryMatrix);
        BABYLON.Vector3.TransformCoordinatesToRef(v, this._toBaryMatrix, out);
        return out;
    }

    getProjectedSegment(origin: BABYLON.Vector3, dir : BABYLON.Vector3) : PathSegment | null {
        let x = BABYLON.Tmp.Vector3[0];
        let d = BABYLON.Tmp.Vector3[1];
        this.toBarycentric(origin, x);
        this.toBarycentric(dir, d);
        x.scale(1/ (x.x + x.y + x.z));
        d.scale(1/ (d.x + d.y + d.z));

        this._s0.copyFrom(this._s1.copyFrom(this._s2.copyFrom(x)));

        let possibleHits : FaceIntersection[]  = [];
        let t0 = - x.x / d.x;
        if(Number.isFinite(t0)){
            d.scaleAndAddToRef(t0, this._s0);
            if(this._s0.x >= 0 && this._s0.y >= 0 && this._s0.z >= 0)
            possibleHits.push({
                side: 0,
                t: t0,
                s: this._s0,
                neighbour: this._neighbour0
            })
        }
        let t1 = - x.y / d.y;
        if(Number.isFinite(t1)){
            d.scaleAndAddToRef(t1, this._s1);
            if(this._s1.x >= 0 && this._s1.y >= 0 && this._s1.z >= 0)
            possibleHits.push({
                side: 1,
                t: t1,
                s: this._s1,
                neighbour: this._neighbour1
            })
        }
        let t2 = - x.z / d.z;
        if(Number.isFinite(t2)){
            d.scaleAndAddToRef(t2, this._s2);
            if(this._s2.x >= 0 && this._s2.y >= 0 && this._s2.z >= 0)
            possibleHits.push({
                side: 2,
                t: t2,
                s: this._s2,
                neighbour: this._neighbour2
            })
        }

        possibleHits.sort((a,b) => {return a.t - b.t});

        if(possibleHits.length == 2){
            this.toCarthesian(possibleHits[0].s, possibleHits[0].s);
            this.toCarthesian(possibleHits[1].s, possibleHits[1].s);
            return new PathSegment(possibleHits[0], possibleHits[1], origin);
        }
        return null;
        //TODO

    }

    calculateEdges(){
        for (let i = 0; i < this.surrounding.length; i++) {
            const face = this.surrounding[i];
            if(face == this) continue;
            if(this._neighbour0 !== face && face.containsEdge(this._index1, this._index2)){
                if (this._neighbour0 !== undefined) console.warn("Multiple neighbours on edge");
                this._neighbour0 = face;
            }
            if(this._neighbour1 !== face && face.containsEdge(this._index2, this._index0)){
                if (this._neighbour1 !== undefined) console.warn("Multiple neighbours on edge");
                this._neighbour1 = face;
            }
            if(this._neighbour2 !== face && face.containsEdge(this._index0, this._index1)){
                if (this._neighbour2 !== undefined) console.warn("Multiple neighbours on edge");
                this._neighbour2 = face;
            }
        }
    }

    containsEdge(i0 : number, i1 : number){
        return this.containsVector(i0) && this.containsVector(i1);
    }
    containsVector(i : number){
        return this._index0 == i || this._index1 == i || this._index2 == i;
    }
    
}

interface FaceIntersection{
    side: number;
    t: number;
    s: BABYLON.Vector3;
    neighbour?: Face;
}

class PathSegment{
    public origin : BABYLON.Vector3;
    public entry : FaceIntersection;
    public exit: FaceIntersection;

    public startLength! : number;
    public endLength! : number;
    public startProjectedLength! : number;
    public endProjectedLength! : number;

    constructor(entry : FaceIntersection, exit : FaceIntersection, origin : BABYLON.Vector3){
        this.entry = entry;
        this.exit = exit;
        this.origin = origin;
    } 
    get projectedLength(){
        return this.exit.t;
    }
    get actualLength(){
        return BABYLON.Vector3.Distance(this.exit.s, this.origin);
    }
}