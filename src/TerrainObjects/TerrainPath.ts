import { VectorTools } from "../VectorTools.js";
import { DebugVisualizer } from "../DebugVisualizer.js";
import { FaceMap, Face } from "./TerrainObject.js";
export class TerrainPath {
    protected _faceMap: FaceMap;
    protected _origin: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    protected _dir: BABYLON.Vector3;
    protected _startFace: Face;
    protected reachedEnd: boolean = false;
    protected _pathSegments: PathSegment[] = [];
    constructor(faceMap: FaceMap, origin: BABYLON.Vector3, dir: BABYLON.Vector3, startFace: Face) {
        this._faceMap = faceMap;
        origin = this._origin.copyFrom(origin);
        this._dir = dir;
        this._startFace = startFace;
        this._pathSegments[0] = this._startFace.getProjectedSegment(origin, dir)!;
        this._pathSegments[0].startLength = 0;
        this._pathSegments[0].startProjectedLength = 0;
        this._pathSegments[0].endLength = BABYLON.Vector3.Distance(origin, this._pathSegments[0].exit.s);
        this._pathSegments[0].endProjectedLength = this._pathSegments[0].exit.t;

        // DebugVisualizer.visualizeLine(this._pathSegments[0].origin, this._pathSegments[0].exit.s);

    }
    get lastSegment() {
        return this._pathSegments[this._pathSegments.length - 1];
    }
    getPointOnPath(t: number, out: BABYLON.Vector3, useProjectedLength?: boolean) {
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
    calculateNextSegment(): PathSegment | null {
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



export interface FaceIntersection{
    side: number;
    t: number;
    s: BABYLON.Vector3;
    neighbour?: Face;
}


export class PathSegment{
    public origin : BABYLON.Vector3;
    public entry : FaceIntersection;
    public exit: FaceIntersection;

    public faceId: number;

    public startLength! : number;
    public endLength! : number;
    public startProjectedLength! : number;
    public endProjectedLength! : number;

    constructor(entry : FaceIntersection, exit : FaceIntersection, origin : BABYLON.Vector3, faceId: number){
        this.entry = entry;
        this.exit = exit;
        this.origin = origin;
        this.faceId = faceId;
    } 
    get projectedLength(){
        return this.exit.t;
    }
    get actualLength(){
        return BABYLON.Vector3.Distance(this.exit.s, this.origin);
    }
}