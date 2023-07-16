/**
 * 多纹理绘制
 */

import { loadFile, shaders, tick } from "./Loader.js";

let gl: WebGLRenderingContext;
let canvas: HTMLCanvasElement;

export class MultiTextures {
    
    constructor(_gl: WebGLRenderingContext, _cvs?: HTMLCanvasElement) {
        gl = _gl;
        canvas = _cvs;
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        const img = new _Image();
        img.src = './assets/DrawTexture/forest.png';
        img.x = - canvas.width / 2;
        img.y = - canvas.height / 2;
        img.index = 0;

        const img2 = new _Image();
        img2.src = './assets/DrawTexture/alien.png';
        img2.x = -80;
        img2.y = -100;
        img2.index = 1;
        img2.scaleX = img2.scaleY = 0.5;

        tick(() => {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            img.draw();
            img2.draw();
        })
    }
}

class _Image {
    private _program: any;
    private _img: HTMLImageElement;

    private _sx: number;
    private _sy: number;

    constructor() {
        this._sx = 1.0;
        this._sy = 1.0;
        this._img = new Image();
        this._img.onload = () => {
            this.onLoad();
        }
    }

    get width() { return Math.min(this._img.width * 2 / canvas.width, 2.0) * this._sx }
    get height() { return Math.min(this._img.height * 2 / canvas.height, 2.0) * this._sy }

    private _nx: number; // 归一化x坐标
    private _ny: number; // 归一化y坐标
    private _idx: number;

    set scaleX(v: number) { this._sx = v }
    set scaleY(v: number) { this._sy = v }

    set x(v: number) {
        this._nx = v * 2 / canvas.width;
    }
    get x() { return this._nx }

    set y(v: number) {
        this._ny = v * 2 / canvas.height;
    }
    get y() { return this._ny }

    set index(v: number) { this._idx = -v * 0.1; }
    get z() { return this._idx }

    set src(v: string) {
        this._img.src = v;
    }

    private _vertbuffer: WebGLBuffer;
    private _idxbuffer: WebGLBuffer;
    private initVertBuffers() {
        const buffer = this._vertbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const {x, y, z, width, height} = this;
        const vertices = new Float32Array([
            x, y, z, 0.0, 0.0,
            x+width, y, z, 1.0, 0.0,
            x+width, y+height, z, 1.0, 1.0,
            x, y+height, z, 0.0, 1.0
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // this.setAttrib('a_Position', 3, 0);
        // this.setAttrib('a_TexCoord', 2, 3);

        const iBuffer = this._idxbuffer = gl.createBuffer();
        const indices = new Uint8Array([
            0, 1, 2, 0, 2, 3
        ]);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    private setAttrib(name: string, size: number, offset: number) {
        const fsize = Float32Array.BYTES_PER_ELEMENT;
        const attrib = gl.getAttribLocation(this._program, name);
        if (attrib < 0) {
            console.warn('attrib not found: ', name);
        } else {
            gl.vertexAttribPointer(attrib, size, gl.FLOAT, false, 5 * fsize, offset * fsize);
            gl.enableVertexAttribArray(attrib);
        }
    }

    private _texture: WebGLTexture;
    private initTexture() {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        const tex = this._texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._img);
        const sampler = gl.getUniformLocation(this._program, 'u_Sampler');
        gl.useProgram(this._program);
        gl.uniform1i(sampler, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    draw() {
        if (!this._program) {
            // console.warn('program undefined.', this);
            return;
        }
        gl.useProgram(this._program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertbuffer);
        this.setAttrib('a_Position', 3, 0);
        this.setAttrib('a_TexCoord', 2, 3);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._idxbuffer);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
    }

    private onLoad() {
        const tasks = [];
        ['mt.vert', 'mt.frag'].forEach(f => {
            tasks.push(loadFile(f, 'MultiTexture'));
        });
        Promise.all(tasks)
        .then(() => {
            this._program = initProgram(shaders['mt.vert'], shaders['mt.frag']);
            if (this._program) {
                this.initVertBuffers();
                this.initTexture();
            }
            // this.draw();
        });
    }
}

function initProgram(vs: string, fs: string) {
    const vsr = initShader(gl.VERTEX_SHADER, vs);
    const fsr = initShader(gl.FRAGMENT_SHADER, fs);
    if (!vsr || !fsr) {
        return;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vsr);
    gl.attachShader(prog, fsr);
    gl.linkProgram(prog);

    const success = gl.getProgramParameter(prog, gl.LINK_STATUS);
    if (!success) {
        const log = gl.getProgramInfoLog(prog);
        console.error('Fail to link program: ', log);
        return;
    }
    return prog;
}

function initShader(type: number, source: string) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        const log = gl.getShaderInfoLog(shader);
        console.error('Fail to compile shader: ', log);
        return;
    }
    return shader;
}