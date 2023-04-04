const vs = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;

    void main() {
        gl_Position = a_Position;
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

export class Textures {

    private _gl: WebGLRenderingContext;
    private _aPos: number;
    private _aColor: number;

    constructor(gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        if (!cuon.initShaders(gl, vs, fs)) {
            console.error('shader初始化失败');
            return;
        }
        this._gl = gl;
        if (this.initBuffer() < 0) {
            console.error('buffer初始化失败');
            return;
        }
        this._aPos = gl.getAttribLocation(cuon.program, 'a_Position');
        this._aColor = gl.getAttribLocation(cuon.program, 'a_Color');
        this.draw();
    }

    private draw() {
        const gl = this._gl;
        // gl.attr
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    private initBuffer(): number {
        const n = 4, gl = this._gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error('buffer创建失败');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const vertices = new Float32Array([
            .0, .0, 1., .0, .0,
            .5, .0, .0, 1., .0,
            .5, .5, 1., .0, .0,
            .0, .5, .0, .0, 1.
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(this._aPos, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(this._aPos);

        gl.vertexAttribPointer(this._aColor, 3, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(this._aColor);
        return n;
    }
}