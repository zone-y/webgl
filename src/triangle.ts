
const vs = `
attribute vec4 a_Position;
uniform mat4 u_TransScale;
uniform mat4 u_TransMove;
uniform mat4 u_TransRotation;
attribute vec4 a_Color;
// varying vec4 v_Pos;
void main(){
    
    gl_Position = u_TransScale * u_TransMove * u_TransRotation * a_Position;
    
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
let directMove = 1;
let directScale = 1;
let step = 0.01;
let rotaion = 0;
export class triangle {

    private _gl: WebGLRenderingContext;
    private _positonAdr: number;
    private _colorAdr: number;
    private _uTrans: WebGLUniformLocation;
    private _uTransMove: WebGLUniformLocation;
    private _uTransScale: WebGLUniformLocation;
    private _uTransRotation: WebGLUniformLocation;

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
        this._uTransMove = gl.getUniformLocation(cuon.getProgram(gl), 'u_TransMove');
        this._uTransScale = gl.getUniformLocation(cuon.getProgram(gl), 'u_TransScale');
        this._uTransRotation = gl.getUniformLocation(cuon.getProgram(gl), 'u_TransRotation');
        if (!this._uTransMove || !this._uTransScale || !this._uTransRotation) {
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
        const p2 = Math.PI * 2;
        if (rotaion > p2) {
            rotaion -= p2;
        } else {
            rotaion += 0.1;
        }
        if (move.x > 1.0 || move.x < 0.0) {
            directMove *= -1;
        }
        move.x += step * directMove;
        if (dlt.x > 1.0 || dlt.x < 0.0 || dlt.y > 1.0 || dlt.y < 0.0) {
            directScale *= -1;
            // step = Math.random() * 0.05 + 0.01;
        }
        dlt.x += step * directScale;
        dlt.y += step * directScale;
        this.draw();
    }

    draw() {
        const gl = this._gl;
        
        // const matrix = this.getMoveMat();
        gl.uniformMatrix4fv(this._uTransMove, false, this.getMoveMat());
        gl.uniformMatrix4fv(this._uTransScale, false, this.getScaleMat());
        gl.uniformMatrix4fv(this._uTransRotation, false, this.getRotationMat());
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /**获取平移矩阵 */
    private getMoveMat(): Float32Array {
        return new Float32Array([
            1., 0., 0., 0.,
            0., 1., 0., 0.,
            0., 0., 1., 0.,
            move.x, move.y, 0., 1.
        ])
    }

    /**获取缩放矩阵 */
    private getScaleMat(): Float32Array {
        return new Float32Array([
            dlt.x, .0, .0, .0,
            .0, dlt.y, .0, .0,
            .0, .0, 1., .0,
            .0, .0, .0, 1.,
        ])
    }
    /**获取旋转矩阵 */
    private getRotationMat(): Float32Array {
        const cr = Math.cos(rotaion);
        const sr = Math.sin(rotaion);
        return new Float32Array([
            cr, sr, .0, .0,
            -sr, cr, .0, .0,
            .0, .0, 1., .0,
            .0, .0, .0, 1.,
        ]);
    }

    initBuffer(gl: WebGLRenderingContext): number {
        let vertex = gl.createBuffer();
        if(!vertex) {
            return -1;
        }
        const r = 0.5;
        const rotation = Math.PI/6;
        const y = r*Math.sin(rotation);
        const x = r*Math.cos(rotation);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
        let points = new Float32Array([
            0., 0.5, 1., .0, .0, 
            -x, -y, .0, 1., .0,
            x, -y, .0, .0, 1.,
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