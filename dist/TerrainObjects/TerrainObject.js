import { VectorTools } from "../VectorTools.js";
export class FaceMap {
    constructor(terrainObject) {
        this._terrainObject = terrainObject;
        this.buildFaceMap();
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
        // debugger;
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
        return new Path(this, origin, dir, this._faces[startFaceId]);
    }
}
export class Path {
    constructor(faceMap, origin, dir, startFace) {
        this.reachedEnd = false;
        this._pathSegments = [];
        this.visualiser = []; //TODO: Remove
        this._faceMap = faceMap;
        this._origin = origin;
        this._dir = dir;
        this._startFace = startFace;
        this._pathSegments[0] = this._startFace.getProjectedSegment(origin, dir);
        this._pathSegments[0].startLength = 0;
        this._pathSegments[0].startProjectedLength = 0;
        this._pathSegments[0].endLength = BABYLON.Vector3.Distance(origin, this._pathSegments[0].exit.s);
        this._pathSegments[0].endProjectedLength = this._pathSegments[0].exit.t;
        this.getPointOnPath(10000, BABYLON.Tmp.Vector3[0]);
        let points = [];
        for (let i = 0; i < this._pathSegments.length; i++) {
            const seg = this._pathSegments[i];
            points.push(seg.entry.s);
            points.push(seg.exit.s);
        }
        window.game.debugVisualizer.visualizeLine(points);
    }
    get lastSegment() {
        return this._pathSegments[this._pathSegments.length - 1];
    }
    getPointOnPath(t, out, useProjectedLength) {
        let lastSegment = this.lastSegment;
        let lastEndLength = useProjectedLength ? lastSegment.endProjectedLength : lastSegment.endLength;
        while (lastEndLength <= t && !this.reachedEnd) {
            this.calculateNextSegment();
            lastSegment = this._pathSegments[this._pathSegments.length - 1];
            lastEndLength = useProjectedLength ? lastSegment.endProjectedLength : lastSegment.endLength;
        }
        if (lastEndLength < t)
            return null;
        for (let i = this._pathSegments.length - 1; i >= 0; i--) {
            const segment = this._pathSegments[i];
            let startLength = useProjectedLength ? segment.startProjectedLength : segment.startLength;
            if (startLength < t) {
                let endLength = useProjectedLength ? segment.endProjectedLength : segment.endLength;
                let segmentT = (t - startLength) / (endLength - startLength);
                VectorTools.interpolate(segmentT, segment.origin, segment.exit.s, out);
                return segment.faceId;
            }
        }
    }
    calculateNextSegment() {
        let lastSegment = this._pathSegments[this._pathSegments.length - 1];
        let newSegment = null;
        if (lastSegment.exit.neighbour !== undefined)
            newSegment = lastSegment.exit.neighbour.getProjectedSegment(lastSegment.exit.s, this._dir);
        if (newSegment === null) {
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
export class Face {
    constructor(faceMap, faceId, index0, index1, index2) {
        this._toBaryMatrix = new BABYLON.Matrix();
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
        this._toCartMatrix = VectorTools.MatrixFromThreeVectors(this._pos0, this._pos1, this._pos2);
        while (this._toCartMatrix.determinant() == 0) {
            this._toCartMatrix.addToSelf(Face.offsetMatrix);
            debugger;
        }
        this._toCartMatrix.invertToRef(this._toBaryMatrix);
        this._terrainObject.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    }
    toCarthesian(v, out) {
        if (out === undefined)
            return BABYLON.Vector3.TransformCoordinates(v, this._toCartMatrix);
        BABYLON.Vector3.TransformCoordinatesToRef(v, this._toCartMatrix, out);
        return out;
    }
    toBarycentric(v, out) {
        if (out === undefined)
            return BABYLON.Vector3.TransformCoordinates(v, this._toBaryMatrix);
        BABYLON.Vector3.TransformCoordinatesToRef(v, this._toBaryMatrix, out);
        return out;
    }
    getProjectedSegment(origin, dir) {
        let x = BABYLON.Tmp.Vector3[0];
        let d = BABYLON.Tmp.Vector3[1];
        origin.addToRef(dir, d);
        this.toBarycentric(origin, x);
        this.toBarycentric(d, d);
        x.scaleInPlace(1 / (x.x + x.y + x.z));
        d.scaleInPlace(1 / (d.x + d.y + d.z));
        d.subtractInPlace(x);
        // this._s0.copyFrom(this._s1.copyFrom(this._s2.copyFrom(x)));
        // console.log(x);
        let possibleHits = [];
        let t0 = -x.x / d.x;
        if (Number.isFinite(t0)) {
            this._s0.set(0, x.y + t0 * d.y, x.z + t0 * d.z);
            VectorTools.baryNormalize(this._s0, this._s0);
            VectorTools.baryNormalize(this._s0, this._s0);
            if (this._s0.y >= -0.01 && this._s0.z >= -0.01)
                possibleHits.push({
                    side: 0,
                    t: t0,
                    s: this._s0,
                    neighbour: this._neighbour0
                });
        }
        let t1 = -x.y / d.y;
        if (Number.isFinite(t1)) {
            this._s1.set(x.x + t1 * d.x, 0, x.z + t1 * d.z);
            VectorTools.baryNormalize(this._s1, this._s1);
            VectorTools.baryNormalize(this._s1, this._s1);
            if (this._s1.x >= -0.01 && this._s1.z >= -0.01)
                possibleHits.push({
                    side: 1,
                    t: t1,
                    s: this._s1,
                    neighbour: this._neighbour1
                });
        }
        let t2 = -x.z / d.z;
        if (Number.isFinite(t2)) {
            this._s2.set(x.x + t2 * d.x, x.y + t2 * d.y, 0);
            VectorTools.baryNormalize(this._s2, this._s2);
            VectorTools.baryNormalize(this._s2, this._s2);
            if (this._s2.x >= -0.01 && this._s2.y >= -0.01)
                possibleHits.push({
                    side: 2,
                    t: t2,
                    s: this._s2,
                    neighbour: this._neighbour2
                });
        }
        possibleHits.sort((a, b) => { return a.t - b.t; });
        if (possibleHits.length == 3) { //for corner hits
            for (let i = 0; i < possibleHits.length - 1; i++) {
                if (possibleHits[i + 1].t - possibleHits[i].t <= 0.01) {
                    possibleHits.splice(i, 1);
                    break;
                }
                ;
            }
        }
        if (possibleHits.length == 2) {
            console.log(possibleHits[0].s.x + possibleHits[0].s.y + possibleHits[0].s.z, possibleHits[1].s.x + possibleHits[1].s.y + possibleHits[1].s.z);
            this.toCarthesian(possibleHits[0].s, possibleHits[0].s);
            this.toCarthesian(possibleHits[1].s, possibleHits[1].s);
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
}
Face.offsetMatrix = BABYLON.Matrix.FromValues(1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0);
class PathSegment {
    constructor(entry, exit, origin, faceId) {
        this.entry = entry;
        this.exit = exit;
        this.origin = origin;
        this.faceId = faceId;
    }
    get projectedLength() {
        return this.exit.t;
    }
    get actualLength() {
        return BABYLON.Vector3.Distance(this.exit.s, this.origin);
    }
}
//# sourceMappingURL=TerrainObject.js.map