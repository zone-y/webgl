import { loadFile, shaders, tick } from "./Loader.js";

const dir = 'DrawTexture';
const files = ['dt.vert', 'dt.frag'];
/**canvas画布宽高比 */
let CVS_ASPECT: number;

export class DrawTextures {

    private _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, cvs?: HTMLCanvasElement) {
        CVS_ASPECT = cvs.width / cvs.height;
        const tasks = [];
        files.forEach(f => {
            tasks.push(loadFile(f, dir));
        });
        Promise.all(tasks)
        .then(() => {
            if (!cuon.initShaders(gl, shaders['dt.vert'], shaders['dt.frag'])) {
                console.error('shader初始化失败');
                return;
            }
            // const itasks = [];
            // const urls = ['./assets/cocos.png'];
            // urls.forEach((u, i) => {
            //     itasks.push(this.loadImage(u));
            // });
            // Promise.all(itasks)
            // .then((imgs: HTMLImageElement[]) => {

            // })
            const img = new Image();
            img.onload = () => {
                this.addImage(img, 0);
                this.draw();
            }
            img.src = "./assets/DrawTexture/forest.png";
        })
        .catch(e => {
            console.error(e);
        })
        this._gl = gl;
        document.onkeydown = (evt: KeyboardEvent) => {
            switch(evt.code) {
                case 'ArrowRight':
                    console.log('向右');
                    break;
                case 'ArrowLeft':
                    console.log('向左');
                    break;
            }
        }
    }

    private addImage(img: HTMLImageElement, index: number) {
        const vertices = this.generateVertsCoord(img, 2.0, new cuon.Vector3([-1.0, -1.0, index * 0.1 - 0.99]), index);
        console.log('顶点数据：', vertices);
        const gl = this._gl;
        // 向缓冲区写入顶点数据
        this.setVerts(vertices);
        this.initTexture(img, index);
        gl.enable(gl.DEPTH_TEST);
    }

    private setVerts(vertices: Float32Array): number {
        const gl = this._gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error('buffer创建失败');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        this.setAttrib('a_Position', 3, 6, 0);
        this.setAttrib('a_TexCoord', 2, 6, 3);
        this.setAttrib('a_Indexxx', 1, 6, 5);
        return 0;
    }

    private setAttrib(name: string, size: number, stride: number, offset: number) {
        const FSIZE = Float32Array.BYTES_PER_ELEMENT;
        const gl = this._gl;
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
        return new Float32Array([
            x + 0.4, y, z, 0.0, 0.0, index,
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
        if (this._elapse === undefined) {
            this._elapse = dlt;
        } else if (this._elapse >= 1000) {
            this._elapse -= 1000;
            this.draw();
            this._index += 2;
            if (this._index >= this._transArr.length) {
                this._index = 0;
            }
        } else {
            this._elapse += dlt;
        }
    }

    private draw() {
        const gl = this._gl;
        gl.clearColor(.8, .7, .2, .8);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.uniform2f(gl.getUniformLocation(cuon.program, 'u_Trans'), this._transArr[this._index], this._transArr[this._index + 1]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    private initTexture(img: HTMLImageElement, index: number) {
        const gl = this._gl;
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