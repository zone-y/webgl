import { MyBase } from "./MyBase.js";
let gl: WebGLRenderingContext;
let canvas: HTMLCanvasElement;
const eye: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0};
const zoom: {left: number, right: number, bottom: number, top: number} = {left: -1, right: 1, bottom: -1, top: 1};
/**
 * 镜头控制练习项目
 */
export class ProjCamera extends MyBase {

    private a_position: number;
    private a_color: number;
    private u_viewMat: WebGLUniformLocation;
    private u_projMat: WebGLUniformLocation;
    private _viewMat: cuon.Matrix4;
    private _projMat: cuon.Matrix4;

    protected onLoad(vs: string, fs: string): void {
        if (cuon.initShaders(gl, vs,fs)) {
            const prog = cuon.getProgram(gl);
            this.a_position = gl.getAttribLocation(prog, 'a_position');
            this.a_color = gl.getAttribLocation(prog, 'a_color');
            this.u_viewMat = gl.getUniformLocation(prog, 'u_viewMat');
            this._viewMat = new cuon.Matrix4();
            
            const u_projMat = this.u_projMat = gl.getUniformLocation(prog, 'u_projMat');
            const projMat = this._projMat = new cuon.Matrix4();
            projMat.setOrtho(-1, 1, -1, 1, 0, -1);
            gl.uniformMatrix4fv(u_projMat, false, projMat.elements);
            this.initBuffer();
            this.drawRectangle();
        }
    }

    private drawRectangle() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        const FSIZE = Float32Array.BYTES_PER_ELEMENT;
        
        /**
         * 以下代码验证了在同一帧画面中不同的多边形可以分别使用不同的<模型-视图-投影>矩阵，
         * 每一次的draw*()函数调用，均是将本次绘制的所有多边形，添加到画布上的一个新图层，
         * 并根据draw*()函数的调用顺序，决定这些图层的原始上下层级关系，但大概率需要开启
         * 深度测试以确保最终的层级关系符合预期
         */
        this._viewMat.setLookAt(eye.x, eye.y, eye.z, eye.x, 0, -1, 0, 1, 0);
        gl.uniformMatrix4fv(this.u_viewMat, false, this._viewMat.elements);
        this._projMat.setOrtho(zoom.left, zoom.right, zoom.bottom, zoom.top, 0, -1);
        gl.uniformMatrix4fv(this.u_projMat, false, this._projMat.elements);

        gl.vertexAttribPointer(this.a_position, 2, gl.FLOAT, false, FSIZE * 5, 0);
        gl.vertexAttribPointer(this.a_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
        gl.enableVertexAttribArray(this.a_position);
        gl.enableVertexAttribArray(this.a_color);
        gl.drawArrays(gl.TRIANGLES, 0, 3);


        this._viewMat.setLookAt(eye.x - 0.5, eye.y, eye.z, eye.x, 0, -1, 0, 1, 0);
        gl.uniformMatrix4fv(this.u_viewMat, false, this._viewMat.elements);
        this._projMat.setOrtho(zoom.left + 0.5, zoom.right, zoom.bottom + 0.5, zoom.top, 0, -1);
        gl.uniformMatrix4fv(this.u_projMat, false, this._projMat.elements);

        gl.vertexAttribPointer(this.a_position, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 15);
        gl.vertexAttribPointer(this.a_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 17);
        gl.enableVertexAttribArray(this.a_position);
        gl.enableVertexAttribArray(this.a_color);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    /**
     * 镜头放大--正交投影
     * 由于透视投影中，可视空间原本就是近大远小的效果，因此只要将视点靠近即可，不需要修改可视空间的大小，或者说近裁剪面的大小
     * 而在正交投影中，想要达到类似近大远小的效果，则需要调整近裁剪面的尺寸，尺寸越小，画面放大，尺寸越大，画面缩小
     * 
     * 缩小近裁剪面尺寸
     */
    private zoomIn() {
        const step = 0.01 / 2;
        if (zoom.left + step >= zoom.right - step) {

        } else {
            zoom.left += step;
            zoom.right -= step;
        }
        if (zoom.bottom + step >= zoom.top - step) {

        } else {
            zoom.bottom += step;
            zoom.top -= step;
        }
        this._projMat.setOrtho(zoom.left, zoom.right, zoom.bottom, zoom.top, 0, -1);
        gl.uniformMatrix4fv(this.u_projMat, false, this._projMat.elements);
    }
    /**
     * 放大近裁剪面尺寸
     */
    private zoomOut() {
        const step = 0.01 / 2;
        if (zoom.left + step >= zoom.right - step) {

        } else {
        }
        zoom.left -= step;
        zoom.right += step;
        if (zoom.bottom + step >= zoom.top - step) {

        } else {
        }
        zoom.bottom -= step;
        zoom.top += step;
        this._projMat.setOrtho(zoom.left, zoom.right, zoom.bottom, zoom.top, 0, -1);
        gl.uniformMatrix4fv(this.u_projMat, false, this._projMat.elements);
    }

    private initBuffer() {
        const vertices = new Float32Array([
            0.5, 0.5, 1.0, 0.0, 0.0, 
            0.5, 0.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 0.0, 0.0, 1.0,
           -0.5,-0.5, 1.0, 0.0, 0.0,
           -0.5, 0.0, 0.0, 1.0, 0.0,
           -1.0, 0.0, 0.0, 0.0, 1.0,
        ]);
        const buff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }

    constructor(_gl: WebGLRenderingContext, _cvs?: HTMLCanvasElement) {
        super('pc.vert', 'pc.frag', 'ProjCamera');
        gl = _gl;
        canvas = _cvs;
        document.onkeydown = (e: KeyboardEvent)=> {
            this.onKeyDown(e)
        }
        gl.clearColor(.0, .0, .0, 1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    private onKeyDown(e: KeyboardEvent) {
        switch (e.key) {
        case 'ArrowLeft':
            eye.x -= 0.05;
            break;
        case 'ArrowRight':
            eye.x += 0.05;
            break;
        case 'ArrowUp':
            this.zoomIn();
            break;
        case 'ArrowDown':
            this.zoomOut();
            break;
        default:
            return;
        }
        this._viewMat.setLookAt(eye.x, eye.y, eye.z, eye.x, 0, -1, 0, 1, 0);
        this.drawRectangle();
    }
}