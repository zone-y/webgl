const vs = `
    attribute vec4 a_Pos;
    attribute float a_Size;
    void main() {
        gl_Position = a_Pos;
        gl_PointSize = a_Size;
    }
`;
const fs = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

export class MultiPoint1 {
    private _gl: WebGLRenderingContext;
    private _posAdr: number;
    private _sizeAdr: number;
    private _size: number;

    constructor(gl: WebGLRenderingContext, cvs: HTMLCanvasElement) {
        this._gl = gl;
        this._size = 0.0;
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (cuon.initShaders(gl, vs, fs)) {
            this._posAdr = gl.getAttribLocation(cuon.program, 'a_Pos');
            this._sizeAdr = gl.getAttribLocation(cuon.program, 'a_Size');
            const rect = cvs.getBoundingClientRect();
            cvs.onmousedown = (e: MouseEvent) => { 
                const x = (e.clientX - rect.left - cvs.width / 2) / cvs.width / 2;
                const y = (cvs.height / 2 - (e.clientY - rect.top)) / cvs.height / 2;
                this.mouseDown(x, y);
            }
    
            cvs.onmouseup = () => {
                this.mouseUp();
            }
    
            window.requestAnimationFrame(() => {
                this.update();
            })
        }
    }

    private _status = '';

    private mouseDown(x: number, y: number) {
        this._status = 'down';
        this._gl.vertexAttrib3f(this._posAdr, x, y, 0.0);
    }

    private mouseUp() {
        this._status = 'up';
    }

    private update() {
        window.requestAnimationFrame(() => {
            this.update();
        });
        if (this._status === 'down') {
            this._size += 0.3;
            this.draw();
        } else if (this._status === 'up' && this._size > 0) {
            this._size -= 0.3;
            this.draw();
        }
    }

    private draw() {
        const gl = this._gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.vertexAttrib1f(this._sizeAdr, this._size);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

const vs2 = `
    attribute vec4 a_Pos;
    void main() {
        gl_Position = a_Pos;
        gl_PointSize = 10.0;
    }
`;
const fs2 = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;
export class MultiPoint2 {
    private _gl: WebGLRenderingContext;
    private _posAdr: number;

    constructor(gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        this._gl = gl;
        gl.clearColor(.8, .7, .2, .8);
        if (!cuon.initShaders(gl, vs2, fs2)) {
            console.error('shader 初始化失败');
            return;
        }
        this._posAdr = gl.getAttribLocation(cuon.program, 'a_Pos');
        const n = this.initBuffer();
        if (n < 0) {
            return;
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }

    private initBuffer() {
        const verts = new Float32Array(
            [-.5, -.5, .5, -.5, .5, .5, -.5, .5]
        );
        const n = 3;
        const gl = this._gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error('创建buffer失败');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this._posAdr, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._posAdr);
        return n;
    }
}