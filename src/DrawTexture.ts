const vs = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;

    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;

const fs = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
`;

export class Textures {

    private _gl: WebGLRenderingContext;
    private _aPosition: number;
    private _aTexCoord: number;

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
        // this.draw();
        this.loadImage();
    }

    private loadImage() {
        const img = new Image();
        img.onload = () => {
            this.initTexture(img);
            this.draw();
        }
        img.src = './cocos.png';
    }

    private draw() {
        const gl = this._gl;
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    private initTexture(img: HTMLImageElement) {
        const gl = this._gl;
        const samper = gl.getUniformLocation(cuon.program, 'u_Sampler');
        if (samper) {
            const texture = gl.createTexture();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            gl.uniform1i(samper, 0);
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
            .0, .0, .0, .0,
            .5, .0, 1., .0,
            .5, .5, 1., 1.,
            .0, .5, .0, 1.
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