const vs = `
    attribute vec4 a_Position;
    uniform mat4 u_ViewMat;
    attribute vec4 a_Color;
    varying vec4 v_Color;

    void main() {
        gl_Position = u_ViewMat * a_Position;
        v_Color = a_Color;
    }
`;
const fs = `
    precision mediump float;
    varying vec4 v_Color;

    void main() {
        gl_FragColor = v_Color;
    }
`;

export class LookAtTriangle {

    private _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        if (!cuon.initShaders(gl, vs, fs)) {
            console.error('shader初始化失败');
            return;
        }
        this._gl = gl;
        if (this.initBuffer(gl) < 0) {
            console.error('buffer初始化失败');
            return;
        }
        const mat4 = new cuon.Matrix4();
        mat4.setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
        const uMat = gl.getUniformLocation(cuon.program, 'u_ViewMat');
        gl.uniformMatrix4fv(uMat, false, mat4.elements);
        this.draw();
    }
    private draw() {
        const gl = this._gl;
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    private initBuffer(gl: WebGLRenderingContext) {
        const buf = gl.createBuffer();
        if (!buf) {
            console.error('创建buffer失败');
            return -1;
        }
        const verteices = new Float32Array([
            0.0, 0.5,   1.0, 0.0, 0.0,
           -0.5,-0.5,   0.0, 1.0, 0.0,
            0.5,-0.5,   0.0, 0.0, 1.0 
        ]);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, verteices, gl.STATIC_DRAW);
        const FSIZE = Float32Array.BYTES_PER_ELEMENT;
        const pos = gl.getAttribLocation(cuon.program, 'a_Position');
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 5 * FSIZE, 0);
        gl.enableVertexAttribArray(pos);
        const clr = gl.getAttribLocation(cuon.program, 'a_Color');
        gl.vertexAttribPointer(clr, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
        gl.enableVertexAttribArray(clr);
        return 3;
    }
}