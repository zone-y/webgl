const shaders = {};
function loadFile(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.open('GET', `./assets/HelloCube/${file}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                shaders[file] = xhr.response;
                resolve(xhr.response);
            }
        }
        xhr.onerror = reject;
        xhr.send();
    })
}

export class HelloCube {
    private _gl: WebGLRenderingContext;
    private _inited: boolean;
    constructor(gl: WebGLRenderingContext, cvs: HTMLCanvasElement) {
        this._gl = gl;
        this._inited = false;
        const files = ['hc.vert', 'hc.frag'];
        const tasks = [];
        files.forEach(f => {tasks.push(loadFile(f))});
        Promise.all(tasks)
        .then(() => {
            this.init();
            this.draw();
        })
    }

    private draw() {
        if (!this._inited) {
            return;
        }
        const gl = this._gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
    }

    private init() {
        const gl = this._gl;
        if (!cuon.initShaders(gl, shaders['hc.vert'], shaders['hc.frag'])) {
            console.error('shader初始化失败');
            return;
        }
        this._gl = gl;
        if (this.initBuffer(gl) < 0) {
            console.error('buffer初始化失败');
            return;
        }
        const mat = new cuon.Matrix4();
        mat.setPerspective(30, 1, 1, 100);
        mat.lookAt(3,3,7,0,0,0,0,1,0);
        const u_Mat = gl.getUniformLocation(cuon.program, 'u_MvpMat');
        if (!u_Mat) {
            console.error('获取 u_MvpMat 地址失败');
            return;
        }
        gl.uniformMatrix4fv(u_Mat, false, mat.elements);
        this._inited = true;
    }

    private initBuffer(gl: WebGLRenderingContext): number {
        const vertices = new Float32Array([
            1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
           -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
           -1.0,-1.0, 1.0, 1.0, 0.0, 0.0,
            1.0,-1.0, 1.0, 1.0, 1.0, 0.0,
            1.0,-1.0,-1.0, 0.0, 1.0, 0.0,
            1.0, 1.0,-1.0, 0.0, 1.0, 1.0,
           -1.0, 1.0,-1.0, 0.0, 0.0, 1.0,
           -1.0,-1.0,-1.0, 0.0, 0.0, 0.0
        ]);
        const white = new Float32Array([
            1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
           -1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
           -1.0,-1.0, 1.0, 1.0, 1.0, 1.0,
            1.0,-1.0, 1.0, 1.0, 1.0, 1.0,
            1.0,-1.0,-1.0, 1.0, 1.0, 1.0,
            1.0, 1.0,-1.0, 1.0, 1.0, 1.0,
           -1.0, 1.0,-1.0, 1.0, 1.0, 1.0,
           -1.0,-1.0,-1.0, 1.0, 1.0, 1.0
        ]);
        const indices = new Uint8Array([
            0,1,2,0,2,3,
            0,3,4,0,4,5,
            0,5,6,0,6,1,
            1,6,7,1,7,2,
            7,4,3,7,3,2,
            4,7,6,4,6,5
        ]);
        const buffer = gl.createBuffer();
        const iBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const FSIZE = vertices.BYTES_PER_ELEMENT;
        const a_Pos = gl.getAttribLocation(cuon.program, 'a_Pos');
        gl.vertexAttribPointer(a_Pos, 3, gl.FLOAT, false, 6 * FSIZE, 0);
        gl.enableVertexAttribArray(a_Pos);

        const a_Color = gl.getAttribLocation(cuon.program, 'a_Color');
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
        gl.enableVertexAttribArray(a_Color);

        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        return indices.length;
    }
}