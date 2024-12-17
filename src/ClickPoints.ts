import { MyBase } from "./MyBase.js";

let gl: WebGLRenderingContext;
let canvas: HTMLCanvasElement;

export class ClickPoint extends MyBase{
    protected onLoad(vs: string, fs: string): void {
        if (cuon.initShaders(gl, vs, fs)) {
            this._positonAdr = gl.getAttribLocation(cuon.getProgram(gl), "a_Position");
            this._colorAdr = gl.getAttribLocation(cuon.getProgram(gl), "a_Color");
            canvas.onclick = (e)=>{this.onClick(e);}
            // this.initBuffer();
            // gl.clear(gl.COLOR_BUFFER_BIT);
            // gl.drawArrays(gl.POINTS, 0, this._points.length);
        }
    }
    constructor(_gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        super('cp.vert', 'cp.frag', 'ClickPoints');
        this._points = [];
        this._positonAdr = 0;
        this._colorAdr = 0;
        gl = _gl, canvas = cvs;
        gl.clearColor(1.0, 1.0, .2, .7);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    private bufferData() {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        const points = [];
        this._points.forEach(p => {
            const r = Math.abs(p.x),
                  g = Math.abs(p.y),
                  b = (r + g) / 2;
            points.push(p.x, p.y, r , g, b);
        })
        const vertices = new Float32Array(points);
        const FSIZE = vertices.BYTES_PER_ELEMENT;
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this._positonAdr, 2, gl.FLOAT, false, FSIZE * 5, 0);
        gl.enableVertexAttribArray(this._positonAdr);

        gl.vertexAttribPointer(this._colorAdr, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
        gl.enableVertexAttribArray(this._colorAdr);
    }

    
    private _positonAdr: number;
    private _colorAdr: number;
    private _points: Point[];

    onClick(e: MouseEvent): void {
        this._points.push({
            x: (e.clientX - 256 - 8) / 256,
            y: (192 - e.clientY + 8) / 192
        });
        this.draw();
        /**
         * 答疑：【为何不是点击一次，调用一次drawArrays，而是要在for循环中多次调用drawArrays】
         * 此问题可由gl.clear()的效果得到启发。
         * 如果方法draw()中，没有调用gl.clear(gl.COLOR_BUFFER_BIT);我们会发现canvas颜色变成了"白色"，
         * 其实canvas的颜色并非白色，而是在没有执行gl.clear(gl.COLOR_BUFFER_BIT)的情况下，canvas的颜色是”透明“的
         * 但div是白色的，所以我们看到了白色。
         * 那么，为什么在没有调用gl.clear()的情况下直接调用drawArrays会使canvas变透明呢？
         * drawArrays函数的功能（2019年3月7日09:18:25时理解）是将指定的点数据填充至"颜色缓冲区"，而非直接绘制到屏幕上，
         * 并且，将canvas背景使用指定的颜色填充（在调用gl.clear()的前提下）。如果没有调用gl.clear()，则使用默认颜色，即：vec4(0.0, 0.0, 0.0, 0.0)
         * 这一透明色填充。执行过drawArrays之后，gl会将颜色缓冲区中的内容显示在屏幕上。
         * 因此，理论上，在将颜色缓冲区内容显示到屏幕之前，可以使用drawArrays添加无限多的点。
         * 结论：点击事件之后，浏览器将会进行重绘，在所有事件处理完毕之后，将颜色缓冲区的内容显示到屏幕上，如果每次点击只执行一次drawArrays，那么自然就只能显示一个点
         * 2022年10月27日14点53分：结论错误，使用for循环的原因是调用gl.drawArrays时，第三个参数值为1，若想要一次性绘制多个点，使用缓冲区对象即可。
         */
    }

    draw():void {
        this.bufferData();
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, this._points.length);
    }
}