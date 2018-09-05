
export class VectorTools{
    static vectorProject(u: BABYLON.Vector3, v: BABYLON.Vector3, out: BABYLON.Vector3){
        let t = BABYLON.Vector3.Dot(u,v) / v.lengthSquared();
        v.scaleToRef(t, out);
    }
    static planeProject(u: BABYLON.Vector3, normal: BABYLON.Vector3, out: BABYLON.Vector3){
        let ux = u.x;
        let uy = u.y;
        let uz = u.z;
        this.vectorProject(u, normal, out);
        out.scaleInPlace(-1);
        out.x += ux;
        out.y += uy;
        out.z += uz;
    }

    static getEulerFromDirection(dir : BABYLON.Vector3, out: BABYLON.Vector3){
        dir.normalizeToRef(BABYLON.Tmp.Vector3[0]);

        out.y = Math.atan2(dir.x, dir.z);
        out.x = -Math.asin(dir.y);
        out.z = 0;

        return out;
    }

    static MatrixFromThreeVectors(v1 : BABYLON.Vector3, v2 : BABYLON.Vector3, v3 : BABYLON.Vector3) : BABYLON.Matrix {
        return BABYLON.Matrix.FromValues(
            v1.x, v1.y, v1.z, 0,
            v2.x, v2.y, v2.z, 0,
            v3.x, v2.y, v3.z, 0,
               0,    0,    0, 1
        );
    }

    static interpolate(t:number, v0: BABYLON.Vector3, v1: BABYLON.Vector3, out: BABYLON.Vector3) : BABYLON.Vector3{
        out.set(0,0,0);
        v0.scaleAndAddToRef(1-t, out);
        v1.scaleAndAddToRef(t, out);
        return out;
    }

    
    static baryNormalize(v : BABYLON.Vector3, out : BABYLON.Vector3) : BABYLON.Vector3{
        v.scaleToRef(1/(v.x + v.y + v.z), out);
        return out;
    }
}