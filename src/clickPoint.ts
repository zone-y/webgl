class clickPoint {
    constructor(){
        this._points = [];
        this._positonAdr = 0;
        this._colorAdr = 0;
    }

    private _gl: WebGLRenderingContext;
    private _positonAdr: number | WebGLUniformLocation;
    private _colorAdr: WebGLUniformLocation;
    private _points: Point[];

    init(gl: WebGLRenderingContext, canvas: HTMLElement){
        gl.clearColor(1.0, 1.0, .2, .7);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(cuon.initShaders(gl, shader.v_shader, shader.f_shader)){
            // this._positonAdr = gl.getAttribLocation(cuon.getProgram(gl), "a_Position");
            this._positonAdr = gl.getUniformLocation(cuon.getProgram(gl), "u_Position");
            this._colorAdr = gl.getUniformLocation(cuon.getProgram(gl), "u_FragColor");
            this._gl = gl;
        }
        canvas.onclick = (e)=>{this.onClick(e);};
    }

    onClick(e: MouseEvent): void {
        this._points.push({
            x: (e.clientX - 150 - 8) / 150,
            y: (150 - e.clientY + 8) / 150
        });
        this.draw();
    }

    draw():void {
        let gl = this._gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._points.forEach(p=>{
            // gl.vertexAttrib3f(this._positonAdr, p.x, p.y, .0);
            gl.uniform4f(this._positonAdr, p.x, p.y, .0, 1.0);
            gl.uniform4f(this._colorAdr, p.x, p.y, p.x / p.y, 1.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        });
    }
}