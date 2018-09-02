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
}
export class Face {
    constructor(faceMap, faceId, index0, index1, index2) {
        this.surrounding = [];
        this._faceMap = faceMap;
        this._terrainObject = faceMap.terrainObject;
        this._faceId = faceId,
            this._index0 = index0;
        this._index1 = index1;
        this._index2 = index2;
        this._terrainObject.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    }
    calculateEdges() {
        for (let i = 0; i < this.surrounding.length; i++) {
            const face = this.surrounding[i];
            if (face == this)
                continue;
            if (this._neighbour0 !== face && face.containsEdge(this._index0, this._index1)) {
                if (this._neighbour0 !== undefined)
                    console.warn("Multiple neighbours on edge");
                this._neighbour0 = face;
            }
            if (this._neighbour1 !== face && face.containsEdge(this._index1, this._index2)) {
                if (this._neighbour1 !== undefined)
                    console.warn("Multiple neighbours on edge");
                this._neighbour1 = face;
            }
            if (this._neighbour2 !== face && face.containsEdge(this._index2, this._index0)) {
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
//# sourceMappingURL=TerrainObject.js.map