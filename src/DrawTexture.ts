import { tick } from "./Loader.js";

const vs = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    uniform vec2 u_Trans;
    varying vec2 v_TexCoord;

    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord + u_Trans;
    }
`;

const fs = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    uniform sampler2D u_Sampler2;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord) * 2.0;
    }
`;

export class Textures {

    private _gl: WebGLRenderingContext;
    private _aPosition: number;
    private _aTexCoord: number;
    private _loadCnt = 2;

    constructor(gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        if (!cuon.initShaders(gl, vs, fs)) {
            console.error('shader初始化失败');
            return;
        }
        this._gl = gl;
        this._aPosition = gl.getAttribLocation(cuon.program, 'a_Position');
        this._aTexCoord = gl.getAttribLocation(cuon.program, 'a_TexCoord');
        if (this.initBuffer() < 0) {
            console.error('buffer初始化失败');
            return;
        }
        gl.clearColor(.8, .7, .2, .8);
        const urls = ['./assets/sky.jpg', './assets/circle.gif'];
        const samplers = ['u_Sampler', 'u_Sampler2'];
        urls.forEach((u, i) => {
            this.loadImage(u, samplers[i]);
        })
    }

    private loadImage(src: string, sampler: string) {
        const img = new Image();
        img.onload = () => {
            this._loadCnt--;
            this.initTexture(img, sampler);
            if (this._loadCnt <= 0) {
                tick(this.update.bind(this));
                this.draw();
            }
        }
        img.src = src;
    }

    private _elapse: number;
    private _transArr = [0.5, 0, 0.5, 0.5, 0, 0.5, 0, 0];
    private _index: number = 0;
    private update(dlt: number) {
        if (this._elapse === undefined) {
            this._elapse = dlt;
        } else if (this._elapse >= 1000) {
            this._elapse -= 1000;
            this.draw();
            this._index += 2;
            if (this._index >= this._transArr.length) {
                this._index = 0;
            }
        } else {
            this._elapse += dlt;
        }
    }

    private draw() {
        const gl = this._gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(gl.getUniformLocation(cuon.program, 'u_Trans'), this._transArr[this._index], this._transArr[this._index + 1]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    private initTexture(img: HTMLImageElement, samplerVar: string) {
        const gl = this._gl;
        const samper = gl.getUniformLocation(cuon.program, samplerVar);
        if (samper) {
            const texture = gl.createTexture();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            if (samplerVar == 'u_Sampler') {
                gl.activeTexture(gl.TEXTURE0);
            } else {
                gl.activeTexture(gl.TEXTURE1);
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            if (samplerVar == 'u_Sampler') {
                gl.uniform1i(samper, 0);
            } else {
                gl.uniform1i(samper, 1);
            }
            
        }
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
            0.0, 0.0,    0.0, 0.0,
            0.0, 0.5,    0.0, 0.5,
            0.5, 0.5,    0.5, 0.5,
            0.5, 0.0,    0.5, 0.0
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const stride = 4 * Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(this._aPosition, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(this._aPosition);

        gl.vertexAttribPointer(this._aTexCoord, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(this._aTexCoord);
        return n;
    }
}