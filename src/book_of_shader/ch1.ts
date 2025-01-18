import { tick } from "../Loader.js";
import { MyBase } from "../MyBase.js";
let gl: WebGLRenderingContext;
export class ch1_bos extends MyBase {

    private _uTime: WebGLUniformLocation;
    private _elapes: number;

    protected onLoad(vs: string, fs: string): void {
        if (cuon.initShaders(gl, vs, fs)) {
            // const viewMat = new cuon.Matrix4();
            // viewMat.setLookAt(0.5, 0.5, 0, 0.5, 0.5, -1, 0, 1, 0);
            const projMat = new cuon.Matrix4();
            projMat.setOrtho(0, 1, 0, 1, 0, -1);
            const mvp = projMat;//.multiply(viewMat);
            const u_mvp_mat = gl.getUniformLocation(cuon.getProgram(gl), 'u_mvp_matrix');
            gl.uniformMatrix4fv(u_mvp_mat, false, mvp.elements);
            const vertices = new Float32Array([
                1., .0, .0, .0, 1., 1., .0, 1.
            ]);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            const a_pos = gl.getAttribLocation(cuon.getProgram(gl), 'a_position');
            if (a_pos != null) {
                gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 2 * vertices.BYTES_PER_ELEMENT, 0);
                gl.enableVertexAttribArray(a_pos);
                tick(this.update.bind(this));
            }
            this._uTime = gl.getUniformLocation(cuon.getProgram(gl), 'u_time');
        }
    }

    private update(dlt: number) {
        this._elapes += 0.008;
        if (this._elapes > Math.PI) {
            this._elapes -= Math.PI;
        }
        gl.uniform1f(this._uTime, this._elapes);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    constructor(_gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        super('bos_c1.vert', 'bos_c1.frag', 'BOS_CH1');
        this._elapes = 0;
        gl = _gl;
        gl.clearColor(.0, .0, .0, 1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}