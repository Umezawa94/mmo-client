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
}
//# sourceMappingURL=VectorTools.js.map