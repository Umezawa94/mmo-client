import { TerrainPath, PathSegment } from "./TerrainPath.js";
export class FaceMap {
    constructor(terrainObject) {
        this._localMatrix = new BABYLON.Matrix();
        this._terrainObject = terrainObject;
        terrainObject.onAfterWorldMatrixUpdateObservable.add(this._updateWorldMatrix.bind(this));
        this._updateWorldMatrix();
        this.buildFaceMap();
    }
    _updateWorldMatrix() {
        this._terrainObject.getWorldMatrix().invertToRef(this._localMatrix);
    }
    buildFaceMap() {
        this._faces = [];
        var indices = this._terrainObject.getIndices();
        let indexLists = [];
        for (let i = 0; i < indices.length / 3; i++) {
            var index0 = indices[i * 3];
            var index1 = indices[i * 3 + 1];
            var index2 = indices[i * 3 + 2];
            this._faces[i] = new Face(this, i, index0, index1, index2);
            if (indexLists[index0] == undefined)
                indexLists[index0] = [];
            indexLists[index0].push(this._faces[i]);
            if (indexLists[index1] == undefined)
                indexLists[index1] = [];
            indexLists[index1].push(this._faces[i]);
            if (indexLists[index2] == undefined)
                indexLists[index2] = [];
            indexLists[index2].push(this._faces[i]);
        }
        for (let i = 0; i < indexLists.length; i++) {
            const list = indexLists[i];
            for (let j = 0; j < list.length; j++) {
                list[j].surrounding = list[j].surrounding.concat(list);
            }
        }
        for (let i = 0; i < this._faces.length; i++) {
            const face = this._faces[i];
            face.calculateEdges();
        }
        console.log(this._faces);
    }
    get terrainObject() {
        return this._terrainObject;
    }
    getProjectedPath(origin, dir, startFaceId) {
        return new TerrainPath(this, origin, dir, this._faces[startFaceId]);
    }
    get faces() {
        return this._faces;
    }
    get worldMatrix() {
        return this.terrainObject.getWorldMatrix();
    }
    get localMatrix() {
        return this._localMatrix;
    }
}
export class Face {
    constructor(faceMap, faceId, index0, index1, index2) {
        this._toLocalMatrix = new BABYLON.Matrix();
        this._s0 = BABYLON.Vector3.Zero();
        this._s1 = BABYLON.Vector3.Zero();
        this._s2 = BABYLON.Vector3.Zero();
        this.surrounding = [];
        this._faceMap = faceMap;
        this._terrainObject = faceMap.terrainObject;
        this._faceId = faceId;
        this._index0 = index0;
        this._index1 = index1;
        this._index2 = index2;
        var positions = this._terrainObject.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        this._pos0 = new BABYLON.Vector3(positions[3 * index0], positions[3 * index0 + 1], positions[3 * index0 + 2]);
        this._pos1 = new BABYLON.Vector3(positions[3 * index1], positions[3 * index1 + 1], positions[3 * index1 + 2]);
        this._pos2 = new BABYLON.Vector3(positions[3 * index2], positions[3 * index2 + 1], positions[3 * index2 + 2]);
        this._edge0 = this._pos1.subtract(this._pos0);
        this._edge1 = this._pos2.subtract(this._pos0);
        this._normal = BABYLON.Vector3.Cross(this._edge0, this._edge1).normalize();
        this._inclination = Math.acos(this._normal.y);
        this._toCartMatrix = BABYLON.Matrix.FromValues(this._edge0.x, this._edge0.y, this._edge0.z, 0, this._edge1.x, this._edge1.y, this._edge1.z, 0, this._normal.x, this._normal.y, this._normal.z, 0, this._pos0.x, this._pos0.y, this._pos0.z, 1);
        this._toCartMatrix.invertToRef(this._toLocalMatrix);
    }
    getProjectedSegment(origin, dir) {
        let x = BABYLON.Tmp.Vector3[0];
        let d = BABYLON.Tmp.Vector3[1];
        // DebugVisualizer.highlightFace(this);
        BABYLON.Vector3.TransformCoordinatesToRef(origin, this._toLocalMatrix, x);
        BABYLON.Vector3.TransformNormalToRef(dir, this._toLocalMatrix, d);
        x.z = d.z = 0;
        let possibleHits = [];
        let t0 = (1 - x.x - x.y) / (d.y + d.x);
        if (Number.isFinite(t0)) {
            this._s0.set(x.x + t0 * d.x, x.y + t0 * d.y, 0);
            if (this._s0.x >= -Face._tolerance && this._s0.y >= -Face._tolerance)
                possibleHits.push({
                    side: 0,
                    t: t0,
                    s: this._s0,
                    neighbour: this._neighbour0
                });
        }
        let t1 = -x.x / d.x;
        if (Number.isFinite(t1)) {
            this._s1.set(0, x.y + t1 * d.y, 0);
            if (this._s1.y >= -Face._tolerance && this._s1.y <= 1 + Face._tolerance)
                possibleHits.push({
                    side: 1,
                    t: t1,
                    s: this._s1,
                    neighbour: this._neighbour1
                });
        }
        let t2 = -x.y / d.y;
        if (Number.isFinite(t2)) {
            this._s2.set(x.x + t2 * d.x, 0, 0);
            if (this._s2.x >= -Face._tolerance && this._s2.x <= 1 + Face._tolerance)
                possibleHits.push({
                    side: 2,
                    t: t2,
                    s: this._s2,
                    neighbour: this._neighbour2
                });
        }
        possibleHits.sort((a, b) => { return a.t - b.t; });
        if (possibleHits.length == 3) { //for corner hits
            if (possibleHits[1].t - possibleHits[0].t > possibleHits[2].t - possibleHits[1].t) {
                possibleHits.splice(2, 1);
            }
            else {
                possibleHits.splice(0, 1);
            }
        }
        if (possibleHits.length == 2) {
            BABYLON.Vector3.TransformCoordinatesToRef(possibleHits[0].s, this._toCartMatrix, possibleHits[0].s);
            BABYLON.Vector3.TransformCoordinatesToRef(possibleHits[1].s, this._toCartMatrix, possibleHits[1].s);
            return new PathSegment(possibleHits[0], possibleHits[1], origin, this._faceId);
        }
        debugger;
        return null;
        //TODO
    }
    calculateEdges() {
        for (let i = 0; i < this.surrounding.length; i++) {
            const face = this.surrounding[i];
            if (face == this)
                continue;
            if (this._neighbour0 !== face && face.containsEdge(this._index1, this._index2)) {
                if (this._neighbour0 !== undefined)
                    console.warn("Multiple neighbours on edge");
                this._neighbour0 = face;
            }
            if (this._neighbour1 !== face && face.containsEdge(this._index2, this._index0)) {
                if (this._neighbour1 !== undefined)
                    console.warn("Multiple neighbours on edge");
                this._neighbour1 = face;
            }
            if (this._neighbour2 !== face && face.containsEdge(this._index0, this._index1)) {
                if (this._neighbour2 !== undefined)
                    console.warn("Multiple neighbours on edge");
                this._neighbour2 = face;
            }
        }
    }
    containsEdge(i0, i1) {
        return this.containsVector(i0) && this.containsVector(i1);
    }
    containsVector(i) {
        return this._index0 == i || this._index1 == i || this._index2 == i;
    }
    get pos0() {
        return this._pos0;
    }
    ;
    get pos1() {
        return this._pos1;
    }
    ;
    get pos2() {
        return this._pos2;
    }
    ;
    get index0() {
        return this._index0;
    }
    ;
    get index1() {
        return this._index1;
    }
    ;
    get index2() {
        return this._index2;
    }
    ;
    get edge0() {
        return this._edge0;
    }
    ;
    get edge1() {
        return this._edge1;
    }
    ;
    get normal() {
        return this._normal;
    }
    ;
    get faceId() {
        return this._faceId;
    }
    ;
    get terrainObject() {
        return this._terrainObject;
    }
    get faceMap() {
        return this._faceMap;
    }
}
Face._tolerance = 0.02;
Face.offsetMatrix = BABYLON.Matrix.FromValues(1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0);
//# sourceMappingURL=TerrainObject.js.map