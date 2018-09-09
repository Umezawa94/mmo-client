export class Ray extends BABYLON.Ray {
    constructor() {
        super(...arguments);
        this.ignoreBackside = false;
        this._localOrigin = BABYLON.Vector3.Zero();
        this._localDirection = BABYLON.Vector3.Zero();
        this._p = BABYLON.Vector3.Zero();
        this._t = BABYLON.Vector3.Zero();
        this._q = BABYLON.Vector3.Zero();
        this._minDistance = 0;
    }
    intersectsTerrainObjects(terrainObjects, results) {
        if (results) {
            results.length = 0;
        }
        else {
            results = [];
        }
        for (var i = 0; i < terrainObjects.length; i++) {
            var pickInfo = this.intersectsFaceMap(terrainObjects[i].faceMap);
            if (pickInfo.hit) {
                results.push(pickInfo);
            }
        }
        results.sort((a, b) => {
            return a.distance - b.distance;
        });
        if (results[0])
            console.log(results[0].faceId);
        return results;
    }
    intersectsFaceMap(faceMap) {
        let localOrigin = this._localOrigin;
        let localDirection = this._localDirection;
        let localMatrix = faceMap.localMatrix;
        BABYLON.Vector3.TransformCoordinatesToRef(this.origin, localMatrix, localOrigin);
        BABYLON.Vector3.TransformNormalToRef(this.direction, localMatrix, localDirection);
        let pick = new BABYLON.PickingInfo();
        let minT = Infinity;
        let picked = null;
        let faces = faceMap.faces;
        for (let i = 0; i < faces.length; i++) {
            const face = faces[i];
            let intersect = this._intersectsFace(face, localOrigin, localDirection);
            if (intersect && intersect.distance < minT) {
                picked = intersect;
            }
        }
        if (picked) {
            let worldMatrix = faceMap.worldMatrix;
            var pickedPoint = this.origin.clone();
            this.direction.scaleAndAddToRef(picked.distance, pickedPoint);
            // var worldDirection = Vector3.TransformNormal(direction, worldMatrix);
            pick.hit = true;
            pick.distance = BABYLON.Vector3.Distance(this.origin, pickedPoint);
            pick.pickedPoint = pickedPoint;
            pick.pickedMesh = faceMap.terrainObject;
            pick.bu = picked.bu || 0;
            pick.bv = picked.bv || 0;
            pick.faceId = picked.faceId;
            pick.subMeshId = picked.subMeshId;
        }
        return pick;
    }
    _intersectsFace(face, localOrigin, localDirection) {
        let pvec = this._p;
        let tvec = this._t;
        let qvec = this._q;
        if (this.ignoreBackside) {
            let angle = BABYLON.Vector3.Dot(face.normal, localDirection);
            if (angle < 0)
                return null;
        }
        BABYLON.Vector3.CrossToRef(localDirection, face.edge1, pvec);
        var det = BABYLON.Vector3.Dot(face.edge0, pvec);
        var invdet = 1 / det;
        localOrigin.subtractToRef(face.pos0, tvec);
        var bu = BABYLON.Vector3.Dot(tvec, pvec) * invdet;
        if (bu < 0 || bu > 1.0) {
            return null;
        }
        BABYLON.Vector3.CrossToRef(tvec, face.edge0, qvec);
        var bv = BABYLON.Vector3.Dot(localDirection, qvec) * invdet;
        if (bv < 0 || bu + bv > 1.0) {
            return null;
        }
        //check if the distance is longer than the predefined length.
        var distance = BABYLON.Vector3.Dot(face.edge1, qvec) * invdet;
        if (distance > this.length || distance < this._minDistance) {
            return null;
        }
        console.log("distance:" + distance);
        // debugger;
        let intersectionInfo = new BABYLON.IntersectionInfo(bu, bv, distance);
        intersectionInfo.faceId = face.faceId;
        return intersectionInfo;
    }
}
//# sourceMappingURL=Ray.js.map