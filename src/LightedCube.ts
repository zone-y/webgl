import { loadFile, shaders } from "./Loader.js";

const dir = 'LightedCube';
const files = ['lc.vert', 'lc.frag'];
export class LightedCube {
    private _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        this._gl = gl;
        const tasks = [];
        files.forEach(f => {
            tasks.push(loadFile(f, dir));
        });
        Promise.all(tasks)
        .then(() => {
            this.init();
            this.draw();
        })
        .catch(e => {
            console.error(e);
        })
    }
    private _vertNums: number;
    private draw() {
        if (!this._inited) {
            console.warn('初始化未完成');
            return;
        }
        const gl = this._gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, this._vertNums, gl.UNSIGNED_BYTE, 0);
    }

    private _inited: boolean;
    private init() {
        const gl = this._gl;
        if (!cuon.initShaders(gl, shaders['lc.vert'], shaders['lc.frag'])) {
            return;
        }
        if (this.initVertBuffers() < 0) {
            return;
        }
        const u_Mat = gl.getUniformLocation(cuon.program, 'u_MvpMat');
        if (!u_Mat) {
            return;
        }
        const mat = new cuon.Matrix4();
        mat.setPerspective(30, 1, 1, 100);
        mat.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
        gl.uniformMatrix4fv(u_Mat, false, mat.elements);

        const u_AColor = gl.getUniformLocation(cuon.program, 'u_AmbientLight');
        gl.uniform3f(u_AColor, 0.2, 0.2, 0.2);

        const u_LColor = gl.getUniformLocation(cuon.program, 'u_LightColor');
        gl.uniform3f(u_LColor, 1.0, 1.0, 1.0); // 白光

        const u_LDirect = gl.getUniformLocation(cuon.program, 'u_LightDirect');
        const v3 = new cuon.Vector3([0.5, 3.0, 4.0]);
        gl.uniform3fv(u_LDirect, v3.normalize().elements); // 归一化的入射光方向
        gl.enable(gl.DEPTH_TEST);
        this._inited = true;
    }

    private initVertBuffers() {
        const vertices = new Float32Array([
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
           -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
           -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
        ]);
        if (!this.initBuffer('a_Position', vertices, 3)) {
            return -1;
        }

        const colors = new Float32Array([
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0      // v4-v7-v6-v5 back
        ]);
        if (!this.initBuffer('a_Color', colors, 3)) {
            return -1;
        }

        const normals = new Float32Array([
            0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
            0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
           -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
            0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
            0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
        ]);
        if (!this.initBuffer('a_Normal', normals, 3)) {
            return -1;
        }

        const indices = new Uint8Array([
            0, 1, 2,   0, 2, 3,    // front
            4, 5, 6,   4, 6, 7,    // right
            8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // down
            20,21,22,  20,22,23     // back
        ]);
        const gl = this._gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        return this._vertNums = indices.length;
    }

    private initBuffer(attrib: string, data: Float32Array, num: number) {
        const gl = this._gl;
        const buffer = gl.createBuffer();
        if (!buffer) return false;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        const loca = gl.getAttribLocation(cuon.program, attrib);
        if (loca < 0) {
            return false;
        }
        gl.vertexAttribPointer(loca, num, gl.FLOAT, false, num * data.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(loca);
        return  true;
    }
}