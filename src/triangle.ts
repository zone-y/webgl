
const vs = `
attribute vec4 a_Position;
uniform mat4 u_Trans;
attribute vec4 a_Color;
// varying vec4 v_Pos;
void main(){
    
    gl_Position = u_Trans * a_Position;
    
    // v_Pos = a_Position;
}
`;
const fs = `
precision mediump float;
// varying vec4 v_Pos;
void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
const FSIZE = Float32Array.BYTES_PER_ELEMENT;
const move: {x: number, y: number} = {x: .0, y: .0};
const dlt: {x: number, y: number} = {x: .0, y: .0};
let direct = 1;
let step = 0.01;
export class triangle {

    private _gl: WebGLRenderingContext;
    private _positonAdr: number;
    private _colorAdr: number;
    private _uTrans: WebGLUniformLocation;
    private _transAdr: WebGLUniformLocation;


    constructor(gl: WebGLRenderingContext, canvas: HTMLElement) {
        if(!cuon.initShaders(gl, vs, fs)) {
            console.warn("gl程序初始化失败");
            return;
        }
        this._gl = gl;
        this._positonAdr = gl.getAttribLocation(cuon.getProgram(gl), "a_Position");
        // this._colorAdr = gl.getAttribLocation(cuon.getProgram(gl), "a_Color")
        let n = this.initBuffer(gl);
        if(n < 0) {
            console.warn("缓冲区对象创建失败");
            return;
        }
        this._transAdr = gl.getUniformLocation(cuon.getProgram(gl), 'u_Trans');
        if (!this._transAdr) {
            console.warn("获取uniform地址失败");
            return;
        }
        this.draw();
        window.requestAnimationFrame(() => { this.update(); });
        // document.onkeydown = (ev: KeyboardEvent) => {
        //     let x = 0.0, y = 0.0;
        //     switch(ev.key) {
        //     case "ArrowUp":
        //         y += 0.1;
        //         break;
        //     case "ArrowDown":
        //         y -= 0.1;
        //         break;
        //     case "ArrowLeft":
        //         x -= 0.1;
        //         break;
        //     case "ArrowRight":
        //         x += 0.1;
        //         break;
        //     }
        //     this.draw(gl, n, x, y);
        // }
    }

    private update() {
        window.requestAnimationFrame(() => { this.update(); });
        if (dlt.x >= 2.0 || dlt.x <= -2.0 || dlt.y >= 2.0 || dlt.y <= -2.0) {
            direct *= -1;
            step = Math.random() * 0.05 + 0.01;
        }
        dlt.x += step * direct;
        dlt.y += step * direct;
        this.draw();
    }

    draw() {
        const gl = this._gl;
        const matrix = new Float32Array([
            1. * dlt.x, .0, .0, .0,
            .0, 1. * dlt.y, .0, .0,
            .0, .0, 1., .0,
            .0, .0, .0, 1.
            // move.x += offsetX, move.y += offsetY, .0, 1.,
        ]);
        gl.uniformMatrix4fv(this._transAdr, false, matrix);
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    initBuffer(gl: WebGLRenderingContext): number {
        let vertex = gl.createBuffer();
        if(!vertex) {
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
        let points = new Float32Array([
            0., 0., 1., .0, .0, 
            .5, .0, .0, 1., .0,
            .0, .5, .0, .0, 1.,
            // .5, .5, .3, .4, .5
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this._positonAdr, 2, gl.FLOAT, false, FSIZE * 5, 0);
        gl.enableVertexAttribArray(this._positonAdr);

        // gl.vertexAttribPointer(this._colorAdr, 3, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
        // gl.enableVertexAttribArray(this._colorAdr);
        return points.length;
    }
}