class triangle {
    constructor() {
        this.vs = `
        attribute vec4 a_Position;\n
        void main(){
            gl_Position = a_Position;
            gl_PointSize = 5.0;
        }
        `;
        this.fs = `
        void main(){
            gl_FragColor = vec4(0.8, 0.3, 0.5, 0.8);
        }
        `;
    }
    private vs: string;
    private fs: string;
    private _gl: WebGLRenderingContext;
    private _positonAdr: number;
    init(gl: WebGLRenderingContext, canvas: HTMLElement): void {
        if(!cuon.initShaders(gl, this.vs, this.fs)) {
            console.warn("gl程序初始化失败");
            return;
        }
        this._gl = gl;
        this._positonAdr = gl.getAttribLocation(cuon.getProgram(gl), "a_Position");
        let n = this.initBuffer(gl);
        if(n < 0) {
            console.warn("缓冲区对象创建失败");
            return;
        }
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, n);
    }

    initBuffer(gl: WebGLRenderingContext): number {
        let vertex = gl.createBuffer();
        if(!vertex) {
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
        let points = new Float32Array([
            -.5, .0, .5, .0, .0, .5
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
        gl.vertexAttribPointer(this._positonAdr, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._positonAdr);
        return 3;
    }
}