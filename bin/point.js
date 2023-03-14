const vs = `
    attribute vec4 a_Pos;
    uniform float u_Size;
    void main() {
        gl_Position = a_Pos;
        gl_PointSize = u_Size;
    }
`;
const fs = `
    precision mediump float;
    uniform vec4 u_Color;
    void main() {
        gl_FragColor = u_Color;
    }
`;
export class Point {
    constructor(gl, cvs) {
        this._gl = gl;
        this._size = 0.0;
        this._status = '';
        this.init();
        cvs.onmousedown = () => {
            this.mouseDown();
        };
        cvs.onmouseup = () => {
            this.mouseUp();
        };
        window.requestAnimationFrame(() => { this.update(); });
    }
    mouseDown() {
        this._status = 'down';
    }
    mouseUp() {
        this._status = 'up';
    }
    update() {
        window.requestAnimationFrame(() => {
            this.update();
        });
        if (this._status == 'down') {
            this._size += 0.1;
            this.draw();
        }
        else if (this._status == 'up' && this._size > 0) {
            this._size -= 0.1;
            this.draw();
        }
    }
    init() {
        const gl = this._gl;
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (cuon.initShaders(gl, vs, fs)) {
            this._posAdr = gl.getAttribLocation(cuon.getProgram(gl), 'a_Pos');
            this._clrAdr = gl.getUniformLocation(cuon.getProgram(gl), 'u_Color');
            this._sizeAdr = gl.getUniformLocation(cuon.getProgram(gl), 'u_Size');
        }
    }
    draw() {
        const gl = this._gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.vertexAttrib4f(this._posAdr, .5, .5, .0, 1.0);
        gl.uniform4f(this._clrAdr, 1., .0, .0, 1.);
        gl.uniform1f(this._sizeAdr, this._size);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
