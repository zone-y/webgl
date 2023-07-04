const vs = `
    attribute vec4 a_Position;
    uniform mat4 u_ViewMat;
    uniform mat4 u_ProjMat;
    attribute vec4 a_Color;
    varying vec4 v_Color;

    void main() {
        gl_Position = u_ProjMat * u_ViewMat * a_Position;
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
        const matProj = new cuon.Matrix4();
        // mat4.setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
        // mat4.setOrtho(-1, 1, -1, 1, 0, 0.5);
        matProj.setPerspective(30, 1, 1, 100);
        const uMatV = gl.getUniformLocation(cuon.program, 'u_ProjMat');
        gl.uniformMatrix4fv(uMatV, false, matProj.elements);

        const matView = new cuon.Matrix4();
        matView.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
        const uMatP = gl.getUniformLocation(cuon.program, 'u_ViewMat');
        gl.uniformMatrix4fv(uMatP, false, matView.elements);
        gl.enable(gl.DEPTH_TEST);
        this.draw();
    }
    private draw() {
        const gl = this._gl;
        gl.clearColor(.0, .0, .0, 1.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 9);
    }
    private initBuffer(gl: WebGLRenderingContext) {
        const buf = gl.createBuffer();
        if (!buf) {
            console.error('创建buffer失败');
            return -1;
        }
        const verteices = new Float32Array([

            0.75, 1.0, 0.0,   0.4, 0.4, 1.0,
            0.25,-1.0, 0.0,   0.4, 0.4, 1.0,
            1.25,-1.0, 0.0,   1.0, 0.4, 0.4,

            0.75, 1.0, -4.0,   0.4, 1.0, 0.4,
            0.25,-1.0, -4.0,   0.4, 1.0, 0.4,
            1.25,-1.0, -4.0,   1.0, 0.4, 0.4,
            
            0.75, 1.0, -2.0,   1.0, 0.4, 0.4,
            0.25,-1.0, -2.0,   1.0, 1.0, 0.4,
            1.25,-1.0, -2.0,   1.0, 1.0, 0.4,

            
        ]);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, verteices, gl.STATIC_DRAW);
        const FSIZE = Float32Array.BYTES_PER_ELEMENT;
        const pos = gl.getAttribLocation(cuon.program, 'a_Position');
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 6 * FSIZE, 0);
        gl.enableVertexAttribArray(pos);
        const clr = gl.getAttribLocation(cuon.program, 'a_Color');
        gl.vertexAttribPointer(clr, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
        gl.enableVertexAttribArray(clr);
        return 9;
    }
}