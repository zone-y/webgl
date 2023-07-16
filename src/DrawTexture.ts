import { loadFile, shaders, tick } from "./Loader.js";

const dir = 'DrawTexture';
const files = ['dt.vert', 'dt.frag'];
/**canvas画布宽高比 */
let CVS_ASPECT: number;

let gl: WebGLRenderingContext;

export class DrawTextures {

    constructor(_gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        CVS_ASPECT = cvs.width / cvs.height;
        const tasks = [];
        files.forEach(f => {
            tasks.push(loadFile(f, dir));
        });
        Promise.all(tasks)
        .then(() => {
            this.init(gl);
            tick(this.update.bind(this));
            const itasks = [];
            const urls = ['./assets/DrawTexture/forest.png', './assets/DrawTexture/alien.png'];
            urls.forEach((u, i) => {
                itasks.push(this.loadImage(u));
            });
            Promise.all(itasks)
            .then((imgs: HTMLImageElement[]) => {
                imgs.forEach(i => {
                    if (i.src.match(/alien/)) {
                        this.addImage(i, 0.4, 1);
                    } else {
                        this.addImage(i, 2.0, 0);
                    }
                })
            })
        })
        .catch(e => {
            console.error(e);
        })
        gl = _gl;
    }

    private init(gl: WebGLRenderingContext) {
        if (!cuon.initShaders(gl, shaders['dt.vert'], shaders['dt.frag'])) {
            console.error('shader初始化失败');
            return;
        }
        gl.enable(gl.DEPTH_TEST);
        // if (this.initBuffer() < 0) {
        //     return;
        // }
    }

    private _vertices: number[] = [];

    private addImage(img: HTMLImageElement, width: number, index: number) {
        const vertices = this.generateVertsCoord(img, width, new cuon.Vector3([-1.0, -1.0, index * 0.1 - 0.99]), index);
        console.log('顶点数据：', vertices);
        this.initBuffer(vertices);

        const indices = new Uint8Array([
            0, 1, 2, 0, 2, 3
        ]);
        const iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        // this._vertices = this._vertices.concat(vertices);
        // const bytes = new Float32Array(this._vertices);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        // gl.bufferData(gl.ARRAY_BUFFER, bytes.byteLength, gl.DYNAMIC_DRAW);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, bytes);

        // 向缓冲区写入顶点数据
        this.initTexture(img, 0);
        this.draw();
    }
    private _buffer: WebGLBuffer;
    private initBuffer(a): number {
        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error('buffer创建失败');
            return -1;
        }
        this._buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a), gl.STATIC_DRAW);
        this.setAttrib('a_Position', 3, 6, 0);
        this.setAttrib('a_TexCoord', 2, 6, 3);
        this.setAttrib('a_Index', 1, 6, 5);
        gl.clearColor(.8, .7, .2, .8);
        return 0;
    }

    private setAttrib(name: string, size: number, stride: number, offset: number) {
        const FSIZE = Float32Array.BYTES_PER_ELEMENT;
        const attrib = gl.getAttribLocation(cuon.program, name);
        if (attrib < 0) {
            console.warn('attrib not found: ', name);
        } else {
            gl.vertexAttribPointer(attrib, size, gl.FLOAT, false, stride * FSIZE, offset * FSIZE);
            gl.enableVertexAttribArray(attrib);
        }
    }

    /**
     * 生成纹理对应的顶点数据
     * @param img 
     * @param width 纹理在世界坐标系中的宽度
     * @param pos 纹理左下角在世界坐标系中的坐标
     */
    private generateVertsCoord(img: HTMLImageElement, width: number, pos: cuon.Vector3, index: number) {
        const aspect = img.height / img.width;
        const height = width * aspect * CVS_ASPECT;
        const {x, y, z} = pos;
        return ([
            x, y, z, 0.0, 0.0, index,
            x + width, y, z, 1.0, 0.0, index,
            x + width, y + height, z, 1.0, 1.0, index,
            x, y + height, z, 0.0, 1.0, index
        ]);
    }

    private loadImage(src: string) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            }
            img.src = src;
        })
    }

    private _elapse: number;
    private _transArr = [0.0, 0, 0.5, 0.5, 0, 0.5, 0, 0];
    private _index: number = 0;
    private update(dlt: number) {
        // if (this._elapse === undefined) {
        //     this._elapse = dlt;
        // } else if (this._elapse >= 1000) {
        //     this._elapse -= 1000;
            this.draw();
        //     this._index += 2;
        //     if (this._index >= this._transArr.length) {
        //         this._index = 0;
        //     }
        // } else {
        //     this._elapse += dlt;
        // }
    }

    private draw() {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.uniform2f(gl.getUniformLocation(cuon.program, 'u_Trans'), this._transArr[this._index], this._transArr[this._index + 1]);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
    }

    private initTexture(img: HTMLImageElement, index: number) {
        const sampler = 'u_Sampler' + index;
        const samper = gl.getUniformLocation(cuon.program, sampler);
        if (samper) {
            const texture = gl.createTexture();
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0 + index);
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.uniform1i(samper, index);
        }
    }
}