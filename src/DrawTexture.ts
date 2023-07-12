import { loadFile, shaders, tick } from "./Loader.js";

const dir = 'DrawTexture';
const files = ['dt.vert', 'dt.frag'];

export class Textures {

    private _gl: WebGLRenderingContext;
    private _loadCnt = 1;

    constructor(gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        const tasks = [];
        files.forEach(f => {
            tasks.push(loadFile(f, dir));
        });
        Promise.all(tasks)
        .then(() => {
            this.init();
            const urls = ['./assets/cocos.png'];
            const samplers = ['u_Sampler'];
            urls.forEach((u, i) => {
                this.loadImage(u, samplers[i]);
            })
        })
        .catch(e => {
            console.error(e);
        })
        this._gl = gl;
    }

    private init() {
        const gl = this._gl;
        if (!cuon.initShaders(gl, shaders['dt.vert'], shaders['dt.frag'])) {
            console.error('shader初始化失败');
            return;
        }
        if (this.initBuffer() < 0) {
            console.error(' buffer 初始化失败');
            return;
        }
        gl.enable(gl.DEPTH_TEST);
    }

    private loadImage(src: string, sampler: string) {
        const img = new Image();
        img.onload = () => {
            this._loadCnt--;
            this.initTexture(img, sampler);
            if (this._loadCnt <= 0) {
                // tick(this.update.bind(this));
                this.draw();
            }
        }
        img.src = src;
    }

    private _elapse: number;
    private _transArr = [0.0, 0, 0.5, 0.5, 0, 0.5, 0, 0];
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
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
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
            0.0, 0.5,    0.0, 1.0,
            0.28, 0.5,    1.0, 1.0,
            0.28, 0.0,    1.0, 0.0
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const stride = 4 * Float32Array.BYTES_PER_ELEMENT;

        const a_pos = gl.getAttribLocation(cuon.program, 'a_Position');
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(a_pos);
        
        const a_texcoord = gl.getAttribLocation(cuon.program, 'a_TexCoord');
        gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(a_texcoord);
        return n;
    }
}