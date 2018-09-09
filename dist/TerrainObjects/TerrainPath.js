import { VectorTools } from "../VectorTools.js";
export class TerrainPath {
    constructor(faceMap, origin, dir, startFace) {
        this._origin = BABYLON.Vector3.Zero();
        this.reachedEnd = false;
        this._pathSegments = [];
        this._faceMap = faceMap;
        origin = this._origin.copyFrom(origin);
        this._dir = dir;
        this._startFace = startFace;
        this._pathSegments[0] = this._startFace.getProjectedSegment(origin, dir);
        this._pathSegments[0].startLength = 0;
        this._pathSegments[0].startProjectedLength = 0;
        this._pathSegments[0].endLength = BABYLON.Vector3.Distance(origin, this._pathSegments[0].exit.s);
        this._pathSegments[0].endProjectedLength = this._pathSegments[0].exit.t;
        // DebugVisualizer.visualizeLine(this._pathSegments[0].origin, this._pathSegments[0].exit.s);
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
        // DebugVisualizer.visualizeLine(newSegment.origin, newSegment.exit.s);
        return newSegment;
    }
}
export class PathSegment {
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
//# sourceMappingURL=TerrainPath.js.map