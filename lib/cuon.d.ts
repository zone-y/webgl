declare module cuon {
    export var getWebGLContext: (canvas: HTMLElement, opt_debug?: boolean)=>WebGLRenderingContext;
    export var initShaders: (gl: WebGLRenderbuffer, vshader: string, fshader: string)=>boolean;
    export var getProgram: (gl: any)=>WebGLProgram;
    export var program: WebGLProgram;
    export class Vector3 {
        constructor(opt_src?: number[]);
        elements: Float32Array;
        x: number;
        y: number;
        z: number;
        normalize(): Vector3;
    }
    export class Vector4 {

    }
    export class Matrix4 {
        constructor(opt_src?: Matrix4);
        elements: Float32Array;
        lookAt(eX: number, eY: number, eZ: number, aX: number, aY: number, aZ: number, uX: number, uY: number, uZ: number): Matrix4;
        setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
        /**
         * 设置透视投影矩阵
         * @param fovy 上下方向可视角度
         * @param aspect 近裁剪面宽高比
         * @param near 近裁剪面位置
         * @param far 远裁剪面位置
         */
        setPerspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
        setLookAt(eX: number, eY: number, eZ: number, aX: number, aY: number, aZ: number, uX: number, uY: number, uZ: number): Matrix4;
        setIdentity(): Matrix4;
        setTranslate(x: number, y: number, z: number): Matrix4;
        setScale(x: number, y: number, z: number): Matrix4;
        set(src: Matrix4): Matrix4;
        concat(other: Matrix4): Matrix4;
        multiply(other: Matrix4): Matrix4;
        multiplyVector3(pos: Vector3): Vector3;
        multiplyVector4(pos: Vector4): Vector4;
        transpose(): Matrix4;
        rotate(angle: number, x: number, y: number, z: number): Matrix4;
        setInverseOf(other: Matrix4): Matrix4;
        invert(): Matrix4;
    }
}