declare module cuon {
    export var getWebGLContext: (canvas: HTMLElement, opt_debug?: boolean)=>WebGLRenderingContext;
    export var initShaders: (gl: WebGLRenderbuffer, vshader: string, fshader: string)=>boolean;
    export var getProgram: (gl: any)=>WebGLProgram;
}