import { MyBase } from "./MyBase.js";
let gl: WebGLRenderingContext;
let canvas: HTMLCanvasElement;
/**
 * 彩色三角形
 * 使用单一缓冲区对象向多个变量分配数据
 */
export class ColorfulTriangle extends MyBase{
    protected onLoad(vs: string, fs: string): void {
        if (cuon.initShaders(gl, vs, fs)) {
            this._aPos = gl.getAttribLocation(cuon.getProgram(gl), 'a_Position');
            this._aColor = gl.getAttribLocation(cuon.getProgram(gl), 'a_Color');
            this.initBuffer();
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.POINTS, 0, 3);
        }
    }

    private initBuffer() {
        const vertices = new Float32Array([
            .0, .5, 1., .0, .0,
            -.5, -.5, .0, 1., .0,
            .5, -.5, .0, .0, 1.
        ])
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const FSIZE = vertices.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(this._aPos, 2, gl.FLOAT, false, FSIZE * 5, 0);
        gl.enableVertexAttribArray(this._aPos);

        gl.vertexAttribPointer(this._aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
        gl.enableVertexAttribArray(this._aColor);
    }

    private _aPos: number = 0;
    private _aColor: number = 0;

    constructor(_gl: WebGLRenderingContext, _cvs?: HTMLCanvasElement) {
        super('ct.vert', 'ct.frag', 'ColorfulTriangle');
        gl = _gl;
        canvas = _cvs;
        gl.clearColor(1.0, 1.0, .2, .7);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}