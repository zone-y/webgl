declare module cuon {
    export var getWebGLContext: (canvas: HTMLElement, opt_debug?: boolean)=>WebGLRenderingContext;
    export var initShaders: (gl: WebGLRenderbuffer, vshader: string, fshader: string)=>boolean;
    export var getProgram: (gl: any)=>WebGLProgram;
    export class Vector3 {

    }
    export class Vector4 {

    }
    export class Matrix4 {
        constructor(opt_src?: Matrix4);
        setIdentity(): Matrix4;
        set(src: Matrix4): Matrix4;
        concat(other: Matrix4): Matrix4;
        multiply(other: Matrix4): Matrix4;
        multiplyVector3(pos: Vector3): Vector3;
        multiplyVector4(pos: Vector4): Vector4;
        transpose(): Matrix4;
        setInverseOf(other: Matrix4): Matrix4;
        invert(): Matrix4;
    }
}