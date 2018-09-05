export class VectorTools {
    static vectorProject(u, v, out) {
        let t = BABYLON.Vector3.Dot(u, v) / v.lengthSquared();
        v.scaleToRef(t, out);
    }
    static planeProject(u, normal, out) {
        let ux = u.x;
        let uy = u.y;
        let uz = u.z;
        this.vectorProject(u, normal, out);
        out.scaleInPlace(-1);
        out.x += ux;
        out.y += uy;
        out.z += uz;
    }
    static getEulerFromDirection(dir, out) {
        dir.normalizeToRef(BABYLON.Tmp.Vector3[0]);
        out.y = Math.atan2(dir.x, dir.z);
        out.x = -Math.asin(dir.y);
        out.z = 0;
        return out;
    }
    static MatrixFromThreeVectors(v1, v2, v3) {
        return BABYLON.Matrix.FromValues(v1.x, v1.y, v1.z, 0, v2.x, v2.y, v2.z, 0, v3.x, v2.y, v3.z, 0, 0, 0, 0, 1);
    }
    static interpolate(t, v0, v1, out) {
        out.set(0, 0, 0);
        v0.scaleAndAddToRef(1 - t, out);
        v1.scaleAndAddToRef(t, out);
        return out;
    }
    static baryNormalize(v, out) {
        v.scaleToRef(1 / (v.x + v.y + v.z), out);
        return out;
    }
}
//# sourceMappingURL=VectorTools.js.map