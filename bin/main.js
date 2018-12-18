class Main {
    constructor() {
        this._points = [];
        this._positonAdr = 0;
    }
    start() {
        console.log("Hi webgl");
        let cvs = document.getElementById("view");
        let gl = cuon.getWebGLContext(cvs);
        gl.clearColor(1.0, 1.0, .2, .7);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (cuon.initShaders(gl, shader.v_shader, shader.f_shader)) {
            this._positonAdr = gl.getAttribLocation(cuon.getProgram(gl), "a_Position");
            this._gl = gl;
        }
        cvs.onclick = (e) => { this.onClick(e); };
    }
    onClick(e) {
        this._points.push({
            x: (e.clientX - 150 - 8) / 150,
            y: (150 - e.clientY + 8) / 150
        });
        this.draw();
    }
    draw() {
        let gl = this._gl;
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._points.forEach(p => {
            gl.vertexAttrib3f(this._positonAdr, p.x, p.y, .0);
            gl.drawArrays(gl.POINTS, 0, 1);
        });
    }
}
let app = new Main();
app.start();
